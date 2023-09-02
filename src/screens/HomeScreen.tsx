import React from "react";
import { View, FlatList, Text, StyleSheet, Button } from "react-native";
import { useQuery } from "react-query";
import { fetchUserEvents } from "../api/api";
import { TabScreenProp } from "../navigation/types";
import { useAuth } from "../store/auth";
import { EventCard } from "../components/EventCard";

type Props = TabScreenProp<"Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  if (!user?.id) {
    navigation.navigate("Login");
  }
  const { data } = useQuery("userEvents", () =>
    fetchUserEvents(user?.id || "")
  );

  return (
    <View style={styles.container}>
      <View style={styles.Header}>
        <Text style={styles.userName}>Name: {user?.name}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
      <Text style={styles.userName}>My Events</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <EventCard event={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  eventTitle: {
    fontSize: 18,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default HomeScreen;
