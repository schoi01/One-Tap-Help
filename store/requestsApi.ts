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
  await addDoc(requestsCol, {
    title: params.title,
    urgency: params.urgency,
    status: "pending",
    createdAt: serverTimestamp(),
    createdBy: params.createdBy,
    acceptedBy: null,
    completedBy: null,
  });

  // Send notifications to Caregivers on shift only
  try {
    const CaregiversSnap = await getDocs(
      collection(db, "Caregivers")
    );
    const onShiftCaregivers = CaregiversSnap.docs.filter(
      (d) => d.data().onShift === true && d.data().pushToken
    );
    
    for (const CaregiverDoc of onShiftCaregivers) {
      const pushToken = CaregiverDoc.data().pushToken;
      await sendNotification(
        pushToken,
        params.title,
        `${params.urgency.toUpperCase()} request from patient`
      );
    }
    
    if (onShiftCaregivers.length === 0) {
      console.log("No Caregivers on shift - request will be handled by guardian");
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

export async function registerCaregiverToken(
  CaregiverId: string,
  pushToken: string
) {
  try {
    const CaregiverRef = doc(db, "Caregivers", CaregiverId);
    await setDoc(
      CaregiverRef,
      {
        pushToken,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to register Caregiver token:", error);
  }
}

export async function setCaregiverShift(
  CaregiverId: string,
  onShift: boolean
) {
  const CaregiverRef = doc(db, "Caregivers", CaregiverId);
  try {
    await setDoc(
      CaregiverRef,
      {
        onShift,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Caregiver shift updated:", onShift);
  } catch (error) {
    console.error("Could not update Caregiver shift status:", error);
  }
}

export function listenCaregivers(cb: (Caregivers: any[]) => void) {
  const q = query(collection(db, "Caregivers"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    cb(items);
  });
}

export function listenCaregiverShift(
  CaregiverId: string,
  cb: (onShift: boolean) => void
) {
  const CaregiverRef = doc(db, "Caregivers", CaregiverId);
  return onSnapshot(CaregiverRef, (snap) => {
    const onShift = snap.data()?.onShift ?? false;
    cb(onShift);
  });
}

export async function checkAnyCaregiverOnShift(): Promise<boolean> {
  try {
    const CaregiversSnap = await getDocs(collection(db, "Caregivers"));
    return CaregiversSnap.docs.some((doc) => doc.data().onShift === true);
  } catch (error) {
    return false;
  }
}
