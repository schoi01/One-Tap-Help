import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { RequestItem } from "../types/request";
import { timeAgo } from "../utils/time";
import UrgencyBadge from "./UrgencyBadge";

export default function RequestCard({
  item,
  onAcknowledge,
  onResolve,
  acceptedBy,
  disabledReason,
  currentUserId,
}: {
  item: any;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  acceptedBy?: string | null;
  disabledReason?: string;
  currentUserId?: string;
}) {
  const isCompleted = item.status === "completed";
  const isEmergency = item.urgency === "emergency";
  const alreadyAccepted = item.status === "accepted";
  const canAccept = item.status === "pending" && !isCompleted;
  const isAcceptedByMe = acceptedBy && currentUserId && acceptedBy === currentUserId;
  const isAcceptedByOther = acceptedBy && currentUserId && acceptedBy !== currentUserId;
  const canComplete = isAcceptedByMe && !isCompleted;

  // Automatically accept emergency requests
  useEffect(() => {
    if (isEmergency && canAccept && currentUserId) {
      onAcknowledge(item.id);
    }
  }, [isEmergency, canAccept, item.id, currentUserId, onAcknowledge]);

  return (
    <View
      style={[
        styles.card,
        isCompleted && styles.cardResolved,
        isEmergency && styles.cardEmergency,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.title,
            isCompleted && styles.muted,
            isEmergency && styles.emergencyTitle,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <UrgencyBadge urgency={item.urgency} />
      </View>

      <Text style={[styles.meta, isCompleted && styles.muted, isEmergency && styles.emergencyMeta]}>
        {timeAgo(item.createdAt)} • {item.status.toUpperCase()}
      </Text>

      {acceptedBy && (
        <Text style={[styles.meta, styles.muted, isEmergency && styles.emergencyMeta]}>
          Accepted by: {acceptedBy}
        </Text>
      )}

      {disabledReason && alreadyAccepted && (
        <Text style={[styles.meta, styles.hint]}>
          💡 {disabledReason}
        </Text>
      )}

      <View style={styles.actionsRow}>
        {isEmergency ? (
          // Emergency card: show "Call 911" button full width
          <Pressable
            disabled={!canComplete}
            onPress={() => Linking.openURL("tel:911")}
            style={({ pressed }) => [
              styles.btn,
              styles.fullWidth,
              styles.emergency911Btn,
              !canComplete && styles.disabled,
              pressed && canComplete && styles.emergency911BtnPressed,
            ]}
          >
            <Text style={styles.btnText}>Call 911</Text>
          </Pressable>
        ) : alreadyAccepted ? (
          // Non-emergency, already accepted: show Complete button full width
          <Pressable
            disabled={!canComplete}
            onPress={() => onResolve(item.id)}
            style={({ pressed }) => [
              styles.btn,
              styles.fullWidth,
              styles.resolve,
              !canComplete && styles.disabled,
              pressed && canComplete && styles.resolvePressed,
            ]}
          >
            <Text style={styles.btnText}>Complete</Text>
          </Pressable>
        ) : (
          // Non-emergency, not accepted yet: show both Accept and Complete buttons
          <>
            <Pressable
              disabled={!canAccept}
              onPress={() => onAcknowledge(item.id)}
              style={({ pressed }) => [
                styles.btn,
                styles.ack,
                !canAccept && styles.disabled,
                pressed && canAccept && styles.ackPressed,
              ]}
            >
              <Text style={styles.btnText}>Accept</Text>
            </Pressable>

            <Pressable
              disabled={!canComplete}
              onPress={() => onResolve(item.id)}
              style={({ pressed }) => [
                styles.btn,
                styles.resolve,
                !canComplete && styles.disabled,
                pressed && canComplete && styles.resolvePressed,
              ]}
            >
              <Text style={styles.btnText}>
                {isAcceptedByOther ? "Accepted" : "Complete"}
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {isAcceptedByOther && (
        <Text style={styles.acceptedByOtherHint}>
          ⏳ Waiting for {acceptedBy} to complete
        </Text>
      )}

      {isEmergency && (
        <View style={styles.emergencyHintContainer}>
          <Text style={styles.emergencyHint}>
            Emergency is pinned to the top until completed.
          </Text>
          <Pressable
            onPress={() => onResolve(item.id)}
            style={({ pressed }) => [
              styles.resolvedBtn,
              pressed && styles.resolvedBtnPressed,
            ]}
          >
            <Text style={styles.resolvedBtnText}>Resolved</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 14,
    marginTop: 12,
    borderWidth: 3,
    borderColor: "#212121",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardResolved: { opacity: 0.55 },
  cardEmergency: { backgroundColor: "#B91C1C" },

  topRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  title: { fontSize: 18, fontWeight: "800", color: "#111827", flexShrink: 1 },
  meta: { marginTop: 6, fontSize: 13, color: "#374151" },

  muted: { color: "#6B7280" },
  emergencyTitle: { color: "#FFFFFF" },
  emergencyMeta: { color: "#FFFFFF" },

  actionsRow: { marginTop: 12, flexDirection: "row", gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  fullWidth: { flex: 1 },
  ack: { backgroundColor: "#4B9EEB" },
  ackPressed: { backgroundColor: "#B0E0E6" },
  resolve: { backgroundColor: "#57BF42" },
  resolvePressed: { backgroundColor: "#B0F0B0" },
  emergency911Btn: { backgroundColor: "#DC143C" },
  emergency911BtnPressed: { backgroundColor: "#FF6B6B" },
  btnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },

  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },

  emergencyHint: { marginTop: 10, fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  emergencyHintContainer: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resolvedBtn: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#FFFFFF", borderRadius: 30 },
  resolvedBtnPressed: { opacity: 0.7 },
  resolvedBtnText: { fontSize: 11, fontWeight: "700", color: "#B91C1C" },
  acceptedByOtherHint: { marginTop: 8, fontSize: 12, fontWeight: "600", color: "#666" },
  hint: { color: "#FF9500", marginTop: 8, fontSize: 12 },
});
