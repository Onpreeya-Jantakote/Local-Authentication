import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const BASE_URL = "http://192.168.1.124:3000/api";

export default function EditBook() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
    price: "",
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/books/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (res.ok) {
          const book = data.book;
          setFormData({
            title: book.title || "",
            author: book.author || "",
            description: book.description || "",
            genre: book.genre || "",
            year: book.year ? book.year.toString() : "",
            price: book.price ? book.price.toString() : "",
            available: book.available !== undefined ? book.available : true
          });
        } else {
          router.back();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.author.trim()) return;
    
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          genre: formData.genre,
          year: formData.year ? parseInt(formData.year) : 2024,
          price: formData.price ? parseFloat(formData.price) : 0,
          available: formData.available
        }),
      });
      
      if (res.ok) {
        router.replace("/book");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/books/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.ok) {
        router.replace("/book");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Book</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Book title *" 
          value={formData.title} 
          onChangeText={(value) => updateField('title', value)}
          placeholderTextColor="#999"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Author *" 
          value={formData.author} 
          onChangeText={(value) => updateField('author', value)}
          placeholderTextColor="#999"
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Description" 
          value={formData.description} 
          onChangeText={(value) => updateField('description', value)}
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Genre" 
          value={formData.genre} 
          onChangeText={(value) => updateField('genre', value)}
          placeholderTextColor="#999"
        />
        
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, styles.halfInput]} 
            placeholder="Year" 
            value={formData.year} 
            onChangeText={(value) => updateField('year', value)}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <TextInput 
            style={[styles.input, styles.halfInput]} 
            placeholder="Price" 
            value={formData.price} 
            onChangeText={(value) => updateField('price', value)}
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.availableToggle}
          onPress={() => updateField('available', !formData.available)}
        >
          <View style={[
            styles.toggleCircle,
            formData.available && styles.toggleCircleActive
          ]}>
            <Text style={styles.toggleText}>
              {formData.available ? "✓" : ""}
            </Text>
          </View>
          <Text style={styles.availableText}>Available</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.updateButton, 
            (!formData.title.trim() || !formData.author.trim() || updating) && styles.disabledButton
          ]} 
          onPress={handleUpdate}
          disabled={!formData.title.trim() || !formData.author.trim() || updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Book</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 20,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  input: { 
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  availableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleCircleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  availableText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  updateButton: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: { 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: { 
    color: "#FF3B30", 
    fontWeight: "600",
    fontSize: 16,
  },
});