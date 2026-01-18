import React from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { createRequest } from "../store/requestsApi";
import { Urgency } from "../types/request";

function BigButton({
  label,
  icon,
  onPress,
  variant = "water",
  fullWidth = false,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  variant?: "water" | "food" | "bathroom" | "help" | "emergency";
  fullWidth?: boolean;
}) {
  const variantStyles = {
    water: styles.btnWater,
    food: styles.btnFood,
    bathroom: styles.btnBathroom,
    help: styles.btnHelp,
    emergency: styles.btnEmergency,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bigBtn,
        fullWidth && styles.fullWidthBtn,
        variantStyles[variant],
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.iconPlaceholder}>{icon}</Text>
        <Text style={styles.bigBtnText}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function PatientScreen() {
  const patientId = "patientA";
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleCreate = (title: string, urgency: Urgency) => {
    createRequest({ title, urgency, createdBy: patientId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <BigButton
              label="WATER"
              icon="💧"
              variant="water"
              onPress={() => handleCreate("Water", "normal")}
            />
            <BigButton
              label="FOOD"
              icon="🍽️"
              variant="food"
              onPress={() => handleCreate("Food", "high")}
            />
          </View>
          <View style={styles.gridRow}>
            <BigButton
              label="BATHROOM"
              icon="🚽"
              variant="bathroom"
              onPress={() => handleCreate("Bathroom", "high")}
            />
            <BigButton
              label="HELP"
              icon="🔔"
              variant="help"
              onPress={() => handleCreate("Help", "high")}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomBox}>
        <BigButton
          label="EMERGENCY"
          icon="🚨"
          variant="emergency"
          fullWidth={true}
          onPress={() => handleCreate("Emergency", "emergency")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 16,
    padding: 16,
  },

  topBox: {
    flex: 1,
    gap: 12,
  },

  bottomBox: {
    minHeight: 120,
    justifyContent: "flex-end",
  },

  gridContainer: {
    flex: 1,
    gap: 12,
  },

  gridRow: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  bigBtn: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  fullWidthBtn: {
    width: "100%",
    minHeight: 100,
  },

  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  iconPlaceholder: {
    fontSize: 40,
  },

  btnWater: {
    backgroundColor: "#3B82F6",
  },
  btnFood: {
    backgroundColor: "#F59E0B",
  },
  btnBathroom: {
    backgroundColor: "#8B5CF6",
  },
  btnHelp: {
    backgroundColor: "#EC4899",
  },
  btnEmergency: {
    backgroundColor: "#DC2626",
  },

  bigBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
