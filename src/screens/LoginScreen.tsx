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
import { login } from "../api/api";
import { ScreenProp } from "../navigation/types";
import { useAuth } from "../store/auth";

type FormData = {
  email: string;
  password: string;
};

type Props = ScreenProp<"Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "mohamed@gmail.com",
    password: "123456",
  });
  const [error, setError] = useState<string>("");

  const { setUser } = useAuth();

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      setUser(data);
      navigation.replace("AppTabs");
    },
    onError: () => {
      setError("An error occurred during login.");
      Alert.alert("Error", error);
    },
  });

  const handleLogin = () => {
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
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupLink}>Sign Up</Text>
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupLink: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
