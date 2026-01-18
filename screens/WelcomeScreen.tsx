import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function WelcomeScreen({
  onSignIn,
  onLogIn,
}: {
  onSignIn: () => void;
  onLogIn: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>One-Tap Help</Text>
        <Text style={styles.subtitle}>Emergency assistance at your fingertips</Text>

        <View style={styles.buttonsContainer}>

          <Pressable
            style={({ pressed }) => [styles.logInButton, pressed && styles.buttonPressed]}
            onPress={onLogIn}
          >
            <Text style={styles.logInButtonText}>Log In</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [styles.signInButton, pressed && styles.buttonPressed]}
            onPress={onSignIn}
          >
            <Text style={styles.signInButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footer}>Secure. Fast. Reliable.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F1EC",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  signInButton: {
    backgroundColor: "#87CEEB",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  logInButton: {
    backgroundColor: "#57BF42",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  logInButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  footer: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
