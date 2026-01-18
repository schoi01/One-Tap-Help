import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import PatientScreen from "./screens/PatientScreen";
import CaretakerScreen from "./screens/CaretakerScreen";
import GuardianScreen from "./screens/GuardianScreen";
import HistoryScreen from "./screens/HistoryScreen";
import RoleSwitcher from "./components/RoleSwitcher";

type Role = "patient" | "caretaker" | "guardian" | "history";

export default function App() {
  const [role, setRole] = useState<Role>("patient");

  return (
    <SafeAreaView style={styles.safe}>
      <RoleSwitcher role={role} onChangeRole={setRole} />

      {role === "patient" && <PatientScreen />}
      {role === "caretaker" && <CaretakerScreen onViewHistory={() => setRole("history")} />}
      {role === "guardian" && <GuardianScreen onViewHistory={() => setRole("history")} />}
      {role === "history" && <HistoryScreen onBack={() => setRole("caretaker")} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FA" },
});


