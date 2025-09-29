import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const BASE_URL = "http://192.168.1.124:3000/api";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
    price: "",
    available: true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = async () => {
    const { title, author, description, genre, year, price } = formData;

    if (!title || !author) {
      Alert.alert("Error", "Title and Author are required");
      return;
    }

    // Validate year
    const yearNum = year ? parseInt(year, 10) : undefined;
    if (year && (isNaN(yearNum!) || yearNum! < 1000 || yearNum! > new Date().getFullYear())) {
      Alert.alert("Error", "Please enter a valid year");
      return;
    }

    // Validate price
    const priceNum = price ? parseFloat(price) : undefined;
    if (price && (isNaN(priceNum!) || priceNum! < 0)) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = {
        title,
        author,
        description: description || "",
        genre: genre || "",
        year: year ? parseInt(year) : new Date().getFullYear(),
        price: price ? parseFloat(price) : 0,
        available: formData.available
      };

      const res = await fetch(`${BASE_URL}/books`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Book added successfully");
        router.replace("/book");
      } else {
        Alert.alert("Error", data.message || "Cannot add book");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New Book</Text>
              <Text style={styles.subtitle}>Fill in the book details</Text>
            </View>

            <View style={styles.form}>
              {/* Required Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor="#999"
                  value={formData.title}
                  onChangeText={(value) => handleInputChange('title', value)}
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Author *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter author name"
                  placeholderTextColor="#999"
                  value={formData.author}
                  onChangeText={(value) => handleInputChange('author', value)}
                />
              </View>

              {/* Optional Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter book description"
                  placeholderTextColor="#999"
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Genre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Fiction, Science, Romance"
                  placeholderTextColor="#999"
                  value={formData.genre}
                  onChangeText={(value) => handleInputChange('genre', value)}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Text style={styles.label}>Publication Year</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2024"
                    placeholderTextColor="#999"
                    value={formData.year}
                    onChangeText={(value) => handleInputChange('year', value)}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Text style={styles.label}>Price ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    value={formData.price}
                    onChangeText={(value) => handleInputChange('price', value)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Availability Switch */}
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Available for rent</Text>
                <Switch
                  value={formData.available}
                  onValueChange={(value) => handleInputChange('available', value)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.available ? "#007AFF" : "#f4f3f4"}
                />
              </View>

              {/* Action Buttons */}
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleAdd}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Adding Book..." : "Add Book"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 0.48,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});