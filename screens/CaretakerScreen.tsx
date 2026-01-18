import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import {
  listenRequests,
  acceptRequest,
  completeRequest,
  FireRequest,
  registerCaretakerToken,
  setCaretakerShift,
  listenCaretakerShift,
} from "../store/requestsApi";
import { sortRequests } from "../utils/requestSort";
import { registerForPushNotifications } from "../utils/notifications";
import RequestCard from "../components/RequestCard";

export default function CaretakerScreen({ onViewHistory }: { onViewHistory?: () => void }) {
  const [requests, setRequests] = useState<FireRequest[]>([]);
  const [onShift, setOnShift] = useState(false);
  const [tab, setTab] = useState<"active" | "pending">("active");
  const caretakerId = "caretakerA";

  useEffect(() => {
    const unsub = listenRequests(setRequests);
    return unsub;
  }, []);

  // Listen to caretaker shift status from Firestore
  useEffect(() => {
    const unsub = listenCaretakerShift(caretakerId, setOnShift);
    return unsub;
  }, []);

  // Register for push notifications
  useEffect(() => {
    (async () => {
      const token = await registerForPushNotifications();
      if (token) {
        await registerCaretakerToken(caretakerId, token);
      }
    })();
  }, []);

  const handleShiftToggle = async () => {
    await setCaretakerShift(caretakerId, !onShift);
  };

  // Active: pending requests or requests accepted by me (only if on shift)
  const activeRequests = useMemo(
    () => {
      if (!onShift) return [];
      return sortRequests(
        requests.filter(
          (r) => r.status !== "completed" && (r.status === "pending" || r.acceptedBy === caretakerId)
        ) as any,
        caretakerId
      );
    },
    [requests, onShift]
  );

  // Pending: requests accepted by someone else (not me) (only if on shift)
  const pendingRequests = useMemo(
    () => {
      if (!onShift) return [];
      return sortRequests(
        requests.filter(
          (r) => r.status !== "completed" && r.acceptedBy && r.acceptedBy !== caretakerId
        ) as any,
        caretakerId
      );
    },
    [requests, onShift]
  );

  const displayedRequests = tab === "active" ? activeRequests : pendingRequests;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Caretaker</Text>
            <Text style={styles.headerSub}>Newest first • Emergency pinned</Text>
          </View>
          <Pressable
            style={[
              styles.shiftBtn,
              onShift ? styles.shiftBtnActive : styles.shiftBtnInactive,
            ]}
            onPress={handleShiftToggle}
          >
            <Text style={styles.shiftBtnText}>{onShift ? "ON SHIFT" : "OFF SHIFT"}</Text>
          </Pressable>
        </View>
        {!onShift && (
          <Text style={styles.warning}>⚠️ Guardian fallback active</Text>
        )}

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === "active" && styles.tabActive]}
            onPress={() => setTab("active")}
          >
            <Text style={[styles.tabText, tab === "active" && styles.tabTextActive]}>
              Active ({activeRequests.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === "pending" && styles.tabActive]}
            onPress={() => setTab("pending")}
          >
            <Text style={[styles.tabText, tab === "pending" && styles.tabTextActive]}>
              Pending ({pendingRequests.length})
            </Text>
          </Pressable>
          <Pressable
            style={styles.historyBtn}
            onPress={onViewHistory}
          >
            <Text style={styles.historyBtnText}>History</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={displayedRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            item={item as any}
            onAcknowledge={(id: string) =>
              acceptRequest(id, caretakerId)
            }
            onResolve={(id: string) =>
              item.acceptedBy === caretakerId
                ? completeRequest(id, caretakerId)
                : null
            }
            acceptedBy={item.acceptedBy}
            currentUserId={caretakerId}
            disabledReason={!onShift ? "Off shift - Guardian can help" : undefined}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {!onShift 
                ? "You're off shift. Turn on shift to see requests."
                : tab === "active" ? "No active requests." : "No pending requests."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F1EC",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "#666",
  },
  shiftBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  shiftBtnActive: {
    backgroundColor: "#57BF42",
  },
  shiftBtnInactive: {
    backgroundColor: "#B91C1C",
  },
  shiftBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  warning: {
    color: "#FF9500",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#111827",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  historyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  historyBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  listContent: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
