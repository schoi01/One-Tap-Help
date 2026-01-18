import React from "react";
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Image } from "react-native";
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
  icon: number;
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

  const textColorStyles = {
    water: styles.btnWaterText,
    food: styles.btnFoodText,
    bathroom: styles.btnBathroomText,
    help: styles.btnHelpText,
    emergency: styles.bigBtnText,
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
        <Image source={icon} style={styles.iconImage} />
        <Text style={[styles.bigBtnText, textColorStyles[variant]]}>{label}</Text>
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
    <View style={[styles.container]}>
      <View style={styles.topBox}>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <BigButton
              label="WATER"
              icon={require("../assets/water_icon.png")}
              variant="water"
              onPress={() => handleCreate("Water", "normal")}
            />
            <BigButton
              label="BATHROOM"
              icon={require("../assets/washroom_icon.png")}
              variant="bathroom"
              onPress={() => handleCreate("Bathroom", "high")}
            />
          </View>
          <View style={styles.gridRow}>
            <BigButton
              label=" FOOD"
              icon={require("../assets/food_icon.png")}
              variant="food"
              onPress={() => handleCreate("Food", "high")}
            />
            <BigButton
              label="HELP"
              icon={require("../assets/help_icon.png")}
              variant="help"
              onPress={() => handleCreate("Help", "high")}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomBox}>
        <BigButton
          label="EMERGENCY"
          icon={require("../assets/emergency_icon.png")}
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
    minHeight: 120,
    paddingHorizontal: 10,
  },

  fullWidthBtn: {
    width: "100%",
    minHeight: 100,
  },

  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
  },

  iconPlaceholder: {
    fontSize: 40,
  },

  btnWater: {
    backgroundColor: "#6AACD3",
  },
  btnFood: {
    backgroundColor: "#78BF62",
  },
  btnBathroom: {
    backgroundColor: "#F6EECF",
  },
  btnHelp: {
    backgroundColor: "#DCA56E",
  },
  btnEmergency: {
    backgroundColor: "#D43F42",
  },

  btnWaterText: {
    color: "#FFFAE2",
  },
  btnFoodText: {
    color: "#42291A",
  },
  btnBathroomText: {
    color: "#42291A",
  },
  btnHelpText: {
    color: "#FFFAE2",
  },

  bigBtnText: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  iconImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
