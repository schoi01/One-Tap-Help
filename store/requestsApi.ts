import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { Urgency } from "../types/request";
import { sendNotification } from "../utils/notifications";

export type RequestStatus = "pending" | "accepted" | "completed";

export type FireRequest = {
  id: string;
  title: string;
  urgency: Urgency;
  status: RequestStatus;
  createdAt?: any;
  createdBy: string;
  acceptedBy?: string | null;
  acceptedAt?: any;
  completedBy?: string | null;
  completedAt?: any;
};

const requestsCol = collection(db, "requests");

export async function createRequest(params: {
  title: string;
  urgency: Urgency;
  createdBy: string;
}) {
  // Check if there's already an active request of this type (pending or accepted)
  const existingQuery = query(
    requestsCol,
    where("title", "==", params.title),
    where("status", "in", ["pending", "accepted"])
  );
  
  const existingRequests = await getDocs(existingQuery);
  
  if (existingRequests.docs.length > 0) {
    console.log(`A ${params.title} request is already active. Only one request per type allowed.`);
    return;
  }

  await addDoc(requestsCol, {
    title: params.title,
    urgency: params.urgency,
    status: "pending",
    createdAt: serverTimestamp(),
    createdBy: params.createdBy,
    acceptedBy: null,
    completedBy: null,
  });

  // Send notifications to caretakers on shift only
  try {
    const caretakersSnap = await getDocs(
      collection(db, "caretakers")
    );
    const onShiftCaretakers = caretakersSnap.docs.filter(
      (d) => d.data().onShift === true && d.data().pushToken
    );
    
    for (const caretakerDoc of onShiftCaretakers) {
      const pushToken = caretakerDoc.data().pushToken;
      await sendNotification(
        pushToken,
        params.title,
        `${params.urgency.toUpperCase()} request from patient`
      );
    }
    
    if (onShiftCaretakers.length === 0) {
      console.log("No caretakers on shift - request will be handled by guardian");
    }
  } catch (error) {
    console.log("Could not send notifications:", error);
  }
}

export function listenRequests(cb: (items: FireRequest[]) => void) {
  const q = query(requestsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items: FireRequest[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    cb(items);
  });
}

export async function acceptRequest(requestId: string, userId: string) {
  await updateDoc(doc(db, "requests", requestId), {
    status: "accepted",
    acceptedBy: userId,
    acceptedAt: serverTimestamp(),
  });
}

export async function completeRequest(requestId: string, userId: string) {
  await updateDoc(doc(db, "requests", requestId), {
    status: "completed",
    completedBy: userId,
    completedAt: serverTimestamp(),
  });
}

export async function registerCaretakerToken(
  caretakerId: string,
  pushToken: string
) {
  try {
    const caretakerRef = doc(db, "caretakers", caretakerId);
    await setDoc(
      caretakerRef,
      {
        pushToken,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to register caretaker token:", error);
  }
}

export async function setCaretakerShift(
  caretakerId: string,
  onShift: boolean
) {
  const caretakerRef = doc(db, "caretakers", caretakerId);
  try {
    await setDoc(
      caretakerRef,
      {
        onShift,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Caretaker shift updated:", onShift);
  } catch (error) {
    console.error("Could not update caretaker shift status:", error);
  }
}

export function listenCaretakers(cb: (caretakers: any[]) => void) {
  const q = query(collection(db, "caretakers"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    cb(items);
  });
}

export function listenCaretakerShift(
  caretakerId: string,
  cb: (onShift: boolean) => void
) {
  const caretakerRef = doc(db, "caretakers", caretakerId);
  return onSnapshot(caretakerRef, (snap) => {
    const onShift = snap.data()?.onShift ?? false;
    cb(onShift);
  });
}

export async function checkAnyCaretakerOnShift(): Promise<boolean> {
  try {
    const caretakersSnap = await getDocs(collection(db, "caretakers"));
    return caretakersSnap.docs.some((doc) => doc.data().onShift === true);
  } catch (error) {
    return false;
  }
}
