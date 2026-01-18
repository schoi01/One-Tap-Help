import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import {
  listenRequests,
  acceptRequest,
  completeRequest,
  FireRequest,
  listenCaretakers,
  checkAnyCaretakerOnShift,
} from "../store/requestsApi";
import { sortRequests } from "../utils/requestSort";
import RequestCard from "../components/RequestCard";

export default function GuardianScreen({ onViewHistory }: { onViewHistory?: () => void }) {
  const [requests, setRequests] = useState<FireRequest[]>([]);
  const [anyCaretakerOnShift, setAnyCaretakerOnShift] = useState(false);
  const [tab, setTab] = useState<"active" | "pending">("active");
  const guardianId = "guardianA";

  useEffect(() => {
    const unsub = listenRequests(setRequests);
    return unsub;
  }, []);

  // Listen to caretaker shifts for visibility only
  useEffect(() => {
    const unsub = listenCaretakers(async (caretakers) => {
      const onShiftAny = caretakers.some((c) => c.onShift === true);
      setAnyCaretakerOnShift(onShiftAny);
    });
    return unsub;
  }, []);

  // Active: pending requests or requests accepted by me
  const activeRequests = useMemo(
    () => sortRequests(
      requests.filter(
        (r) => r.status !== "completed" && (r.status === "pending" || r.acceptedBy === guardianId)
      ) as any
    ),
    [requests]
  );

  // Pending: requests accepted by someone else (not me)
  const pendingRequests = useMemo(
    () => sortRequests(
      requests.filter(
        (r) => r.status !== "completed" && r.acceptedBy && r.acceptedBy !== guardianId
      ) as any
    ),
    [requests]
  );

  const displayedRequests = tab === "active" ? activeRequests : pendingRequests;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guardian</Text>
        <Text style={styles.headerSub}>Oversight & First-responder</Text>

        <View style={styles.statusBox}>
          {anyCaretakerOnShift ? (
            <Text style={styles.statusText}>✓ Caretaker on shift</Text>
          ) : (
            <Text style={[styles.statusText, styles.statusAlert]}>
              ⚠️ No caretakers on shift
            </Text>
          )}
          <Text style={styles.subText}>
            Anyone can accept requests • First-come, first-served
          </Text>
        </View>

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
              acceptRequest(id, guardianId)
            }
            onResolve={(id: string) =>
              item.acceptedBy === guardianId
                ? completeRequest(id, guardianId)
                : null
            }
            acceptedBy={item.acceptedBy}
            currentUserId={guardianId}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === "active" ? "No active requests." : "No pending requests."}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  statusBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34C759",
  },
  statusAlert: {
    color: "#FF9500",
  },
  subText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
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
    borderRadius: 8,
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
