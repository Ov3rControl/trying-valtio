import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation } from "react-query";
import { signUp } from "../api/api";
import { ScreenProp } from "../navigation/types";
import { useAuth } from "../store/auth";
import { z } from "zod";
import { SignUpInputSchema } from "../schemas";

type FormData = z.infer<typeof SignUpInputSchema>;

type Props = ScreenProp<"SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });

  const mutation = useMutation(signUp, {
    onSuccess: (data) => {
      setUser(data);
      navigation.replace("AppTabs");
    },
    onError: () => {
      Alert.alert("Error", "An error occurred during signUp.");
    },
  });

  const handleSignUp = () => {
    mutation.mutate(formData);
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
