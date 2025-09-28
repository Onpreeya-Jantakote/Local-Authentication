import React, { useState, useEffect, use } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolledAsync, setIsEnrolledAsync] = useState(false);
  useEffect(() => {
    const checkBiometricSupport = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(hasHardware);
      if (!hasHardware) {
        Alert.alert(
          "Error",
          "Biometric authentication is not supported on this device."
        );
        return;
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolledAsync(enrolled);
      if (!enrolled) {
        Alert.alert(
          "Error",
          "No biometric records found. Please set up biometrics on your device."
        );
        return;
      }
    };
    checkBiometricSupport();
  }, []);
  const handleLogin = async () => {
    const handleBiometricAuth = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate",
          fallbackLabel: "Enter Passcode",
          disableDeviceFallback: false,
        });
        if (result.success) {
          setIsLogin(true);
        } else {
          Alert.alert("Authentication Failed", "Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred during authentication.");
      }
    };
    console.log({ isBiometricSupported, isEnrolledAsync, isLogin });
    if (isBiometricSupported && isEnrolledAsync && !isLogin)
      await handleBiometricAuth();
  };
  const handleLogout = () => {
    setIsLogin(false);
  };
  return (
    <View style={styles.container}>
      {" "}
      {isLogin ? (
        <>
          {" "}
          <Text>Welcome, you are logged in to Application.</Text>{" "}
          <Button title="Logout" onPress={handleLogout} />{" "}
        </>
      ) : (
        <>
          {" "}
          <Text>Please login to Application.</Text>{" "}
          <Button title="Login" onPress={handleLogin} />{" "}
        </>
      )}{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  spacer: { height: 20 },
  successText: {
    marginTop: 20,
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  failText: { marginTop: 20, color: "red", fontSize: 16 },
});
