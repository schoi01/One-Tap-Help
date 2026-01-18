import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import WelcomeScreen from "./screens/WelcomeScreen";
import SignInScreen from "./screens/SignInScreen";
import PatientScreen from "./screens/PatientScreen";
import CaretakerScreen from "./screens/CaregiverScreen";
import GuardianScreen from "./screens/GuardianScreen";
import HistoryScreen from "./screens/HistoryScreen";
import RoleSwitcher from "./components/RoleSwitcher";

type Role = "patient" | "caretaker" | "guardian" | "history" | null;
type AppScreen = "welcome" | "signin" | "main";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [role, setRole] = useState<Role>(null);

  const handleSignInComplete = (signInRole: any, data: any) => {
    // Map sign-in roles to app roles
    const roleMap: { [key: string]: Role } = {
      PATIENT: "patient",
      CAREGIVER: "caretaker",
      GUARDIAN: "guardian",
    };

    const appRole = roleMap[signInRole];
    if (appRole) {
      setRole(appRole);
      setCurrentScreen("main");
    }
  };

  const handleSignInCancel = () => {
    setCurrentScreen("welcome");
  };

  const handleLogIn = () => {
    // For now, log in goes to patient screen by default
    setRole("patient");
    setCurrentScreen("main");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {currentScreen === "welcome" && (
        <WelcomeScreen
          onSignIn={() => setCurrentScreen("signin")}
          onLogIn={handleLogIn}
        />
      )}

      {currentScreen === "signin" && (
        <SignInScreen
          onComplete={handleSignInComplete}
          onCancel={handleSignInCancel}
        />
      )}

      {currentScreen === "main" && (
        <>
          {/* <RoleSwitcher
            role={role || "patient"}
            onChangeRole={(newRole) => setRole(newRole as Role)}
          /> */}

          {role === "patient" && <PatientScreen />}
          {role === "caretaker" && (
            <CaretakerScreen onViewHistory={() => setRole("history")} />
          )}
          {role === "guardian" && (
            <GuardianScreen onViewHistory={() => setRole("history")} />
          )}
          {role === "history" && (
            <HistoryScreen onBack={() => setRole(role || "patient")} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FA" },
});


