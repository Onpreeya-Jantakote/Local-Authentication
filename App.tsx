import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

export default function App() {
  const [checkingToken, setCheckingToken] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (!t) {
          router.replace("/signin"); // ถ้าไม่มี token ไปหน้า SignIn
        } else {
          setToken(t);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingToken(false);
      }
    };
    checkToken();
  }, []);

  // ฟังก์ชัน Biometric เรียกหลัง login
  const handleBiometric = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !enrolled) {
        Alert.alert(
          "Biometric Error",
          "Your device does not support biometric authentication or no biometrics enrolled."
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enter App",
        fallbackLabel: "Enter Passcode",
      });

      if (result.success) {
        setAuthenticated(true);
        router.replace("/book");
      } else {
        Alert.alert("Authentication Failed", "Cannot enter app");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (checkingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Checking login status...</Text>
      </View>
    );
  }

  if (token && !authenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome back! Please authenticate to continue.</Text>
        <Button title="Authenticate" onPress={handleBiometric} />
      </View>
    );
  }

  return null;
}
