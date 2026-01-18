import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";

type Role = "GUARDIAN" | "PATIENT" | "CAREGIVER" | null;
type Step = "ROLE_SELECTION" | "DETAILS_FORM";

interface GuardianData {
  role: "GUARDIAN";
  guardianFullName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  patientFullName: string;
  healthCondition: string;
}

interface PatientData {
  role: "PATIENT";
  fullName: string;
  phone: string;
  email: string;
  healthCondition: string;
}

interface CaregiverData {
  role: "CAREGIVER";
  fullName: string;
  phone: string;
  email: string;
}

type FormData = GuardianData | PatientData | CaregiverData | null;

export default function SignInScreen({
  onComplete,
  onCancel,
}: {
  onComplete?: (role: Role, data: FormData) => void;
  onCancel?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState<Step>("ROLE_SELECTION");
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  // Guardian fields
  const [guardianFullName, setGuardianFullName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");

  // Patient fields
  const [patientFullName, setPatientFullName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [healthCondition, setHealthCondition] = useState("");

  // Caregiver fields
  const [caregiverFullName, setCaregiverFullName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");

  const [formData, setFormData] = useState<FormData>(null);

  // Word counter for health condition
  const wordCount = useMemo(() => {
    const words = healthCondition.trim().split(/\s+/).filter((word) => word.length > 0);
    return words.length;
  }, [healthCondition]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentStep("DETAILS_FORM");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    if (selectedRole === "GUARDIAN") {
      if (!guardianFullName.trim()) {
        Alert.alert("Validation Error", "Guardian Full Name is required");
        return false;
      }
      if (!guardianPhone.trim() || !validatePhone(guardianPhone)) {
        Alert.alert("Validation Error", "Valid Guardian Phone is required");
        return false;
      }
      if (!guardianEmail.trim() || !validateEmail(guardianEmail)) {
        Alert.alert("Validation Error", "Valid Guardian Email is required");
        return false;
      }
      if (!patientFullName.trim()) {
        Alert.alert("Validation Error", "Patient Full Name is required");
        return false;
      }
      if (wordCount === 0 || wordCount > 150) {
        Alert.alert("Validation Error", "Health Condition must be between 1 and 150 words");
        return false;
      }
    } else if (selectedRole === "PATIENT") {
      if (!patientFullName.trim()) {
        Alert.alert("Validation Error", "Full Name is required");
        return false;
      }
      if (!patientPhone.trim() || !validatePhone(patientPhone)) {
        Alert.alert("Validation Error", "Valid Phone is required");
        return false;
      }
      if (!patientEmail.trim() || !validateEmail(patientEmail)) {
        Alert.alert("Validation Error", "Valid Email is required");
        return false;
      }
      if (wordCount === 0 || wordCount > 150) {
        Alert.alert("Validation Error", "Health Condition must be between 1 and 150 words");
        return false;
      }
    } else if (selectedRole === "CAREGIVER") {
      if (!caregiverFullName.trim()) {
        Alert.alert("Validation Error", "Full Name is required");
        return false;
      }
      if (!caregiverPhone.trim() || !validatePhone(caregiverPhone)) {
        Alert.alert("Validation Error", "Valid Phone is required");
        return false;
      }
      if (!caregiverEmail.trim() || !validateEmail(caregiverEmail)) {
        Alert.alert("Validation Error", "Valid Email is required");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      let data: FormData = null;

      if (selectedRole === "GUARDIAN") {
        data = {
          role: "GUARDIAN",
          guardianFullName,
          guardianPhone,
          guardianEmail,
          guardianRelationship,
          patientFullName,
          healthCondition,
        };
      } else if (selectedRole === "PATIENT") {
        data = {
          role: "PATIENT",
          fullName: patientFullName,
          phone: patientPhone,
          email: patientEmail,
          healthCondition,
        };
      } else if (selectedRole === "CAREGIVER") {
        data = {
          role: "CAREGIVER",
          fullName: caregiverFullName,
          phone: caregiverPhone,
          email: caregiverEmail,
        };
      }

      setFormData(data);

      // Call onComplete callback
      if (onComplete) {
        onComplete(selectedRole, data);
      } else {
        Alert.alert("Success", "Sign-in process completed!");
      }
    }
  };

  const handleBack = () => {
    setCurrentStep("ROLE_SELECTION");
    setSelectedRole(null);
    // Clear form fields
    setGuardianFullName("");
    setGuardianPhone("");
    setGuardianEmail("");
    setGuardianRelationship("");
    setPatientFullName("");
    setPatientPhone("");
    setPatientEmail("");
    setHealthCondition("");
    setCaregiverFullName("");
    setCaregiverPhone("");
    setCaregiverEmail("");
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleBack();
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete(selectedRole, formData);
    } else {
      Alert.alert("Success", "Sign-in process completed!");
    }
  };

  const renderRoleSelection = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.subtitle}>Choose how you want to proceed</Text>

      <View style={styles.roleButtonsContainer}>
        <Pressable
          style={({ pressed }) => [styles.roleButton, pressed && styles.roleButtonPressed]}
          onPress={() => handleRoleSelect("GUARDIAN")}
        >
          <Text style={styles.roleButtonText}>Guardian</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.roleButton, pressed && styles.roleButtonPressed]}
          onPress={() => handleRoleSelect("PATIENT")}
        >
          <Text style={styles.roleButtonText}>Patient</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.roleButton, pressed && styles.roleButtonPressed]}
          onPress={() => handleRoleSelect("CAREGIVER")}
        >
          <Text style={styles.roleButtonText}>Caregiver</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDetailsForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {selectedRole === "GUARDIAN" ? "Guardian Sign In" : selectedRole === "PATIENT" ? "Patient Sign In" : "Caregiver Sign In"}
        </Text>

        {selectedRole === "GUARDIAN" && (
          <>
            {/* Guardian Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Guardian Information</Text>

              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={guardianFullName}
                onChangeText={setGuardianFullName}
              />

              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={guardianPhone}
                onChangeText={setGuardianPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={guardianEmail}
                onChangeText={setGuardianEmail}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Relationship to Patient</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Parent, Spouse, Sibling"
                value={guardianRelationship}
                onChangeText={setGuardianRelationship}
              />
            </View>

            {/* Patient Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Patient Information</Text>

              <Text style={styles.label}>Patient Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter patient's full name"
                value={patientFullName}
                onChangeText={setPatientFullName}
              />

              <Text style={styles.label}>Health Condition *</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Describe patient's health condition (max 150 words)"
                value={healthCondition}
                onChangeText={setHealthCondition}
                multiline
                numberOfLines={5}
              />
              <Text style={styles.wordCount}>{wordCount}/150 words</Text>
            </View>
          </>
        )}

        {selectedRole === "PATIENT" && (
          <View style={styles.section}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={patientFullName}
              onChangeText={setPatientFullName}
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={patientPhone}
              onChangeText={setPatientPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={patientEmail}
              onChangeText={setPatientEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Health Condition *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe your health condition (max 150 words)"
              value={healthCondition}
              onChangeText={setHealthCondition}
              multiline
              numberOfLines={5}
            />
            <Text style={styles.wordCount}>{wordCount}/150 words</Text>
          </View>
        )}

        {selectedRole === "CAREGIVER" && (
          <View style={styles.section}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={caregiverFullName}
              onChangeText={setCaregiverFullName}
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={caregiverPhone}
              onChangeText={setCaregiverPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={caregiverEmail}
              onChangeText={setCaregiverEmail}
              keyboardType="email-address"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderActionView = () => (
    <View style={styles.container}>
      {selectedRole === "GUARDIAN" || selectedRole === "PATIENT" ? (
        <>
          <Text style={styles.title}>QR Code</Text>
          <Text style={styles.subtitle}>Scan this code to proceed</Text>

          <View style={styles.qrContainer}>
            {formData && (
              <Text style={styles.qrPlaceholder}>QR Code Placeholder</Text>
            )}
          </View>

          {selectedRole === "GUARDIAN" && (
            <Pressable
              style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>Scan QR Code</Text>
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.cameraPlaceholderText}>📷</Text>
            <Text style={styles.cameraPlaceholderLabel}>Camera Scanner</Text>
            <Text style={styles.cameraPlaceholderDesc}>
              Scan the Patient or Guardian QR code
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={handleCancel}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      {currentStep === "ROLE_SELECTION" && renderRoleSelection()}
      {currentStep === "DETAILS_FORM" && renderDetailsForm()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F1EC",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  roleButtonsContainer: {
    gap: 12,
    marginTop: 20,
  },
  roleButton: {
    backgroundColor: "#87CEEB",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  roleButtonPressed: {
    backgroundColor: "#B0E0E6",
  },
  roleButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#E1E1E3",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 14,
    color: "#111827",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  wordCount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#57BF42",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000000",
  },
  qrPlaceholder: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  continueButton: {
    backgroundColor: "#4B9EEB",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: "#E1E1E3",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    gap: 12,
  },
  cameraPlaceholderText: {
    fontSize: 64,
  },
  cameraPlaceholderLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  cameraPlaceholderDesc: {
    fontSize: 14,
    color: "#666",
  },
});
