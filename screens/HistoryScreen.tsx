import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { listenRequests, FireRequest } from "../store/requestsApi";
import RequestCard from "../components/RequestCard";

export default function HistoryScreen({ onBack }: { onBack?: () => void }) {
  const [requests, setRequests] = useState<FireRequest[]>([]);
  const [historyType, setHistoryType] = useState<"caretaker" | "guardian">("caretaker");
  const caretakerId = "caretakerA";
  const guardianId = "guardianA";
  const currentUserId = historyType === "caretaker" ? caretakerId : guardianId;

  useEffect(() => {
    const unsub = listenRequests(setRequests);
    return unsub;
  }, []);

  const completedRequests = useMemo(
    () =>
      requests
        .filter((r) => r.status === "completed" && r.acceptedBy === currentUserId)
        .sort((a, b) => (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0)),
    [requests, currentUserId]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSub}>Completed requests</Text>
          </View>
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </Pressable>
        </View>

        <View style={styles.roleButtons}>
          <Pressable
            style={[
              styles.roleBtn,
              historyType === "caretaker" && styles.roleBtnActive,
            ]}
            onPress={() => setHistoryType("caretaker")}
          >
            <Text
              style={[
                styles.roleBtnText,
                historyType === "caretaker" && styles.roleBtnTextActive,
              ]}
            >
              Caretaker
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.roleBtn,
              historyType === "guardian" && styles.roleBtnActive,
            ]}
            onPress={() => setHistoryType("guardian")}
          >
            <Text
              style={[
                styles.roleBtnText,
                historyType === "guardian" && styles.roleBtnTextActive,
              ]}
            >
              Guardian
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={completedRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            item={item as any}
            onAcknowledge={() => {}}
            onResolve={() => {}}
            acceptedBy={item.acceptedBy}
            currentUserId={currentUserId}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No completed requests yet.</Text>
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
    alignItems: "flex-start",
    marginBottom: 12,
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
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  roleButtons: {
    flexDirection: "row",
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: "#111827",
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  roleBtnTextActive: {
    color: "#fff",
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
