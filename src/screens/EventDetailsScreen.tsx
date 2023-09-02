import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEvent, register } from "../api/api";
import { ScreenProp } from "../navigation/types";
import { useAuth } from "../store/auth";

type Props = ScreenProp<"EventDetail">;

const EventDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id: eventId } = route.params;
  const { user } = useAuth();
  const { data } = useQuery(["event", eventId], () => fetchEvent(eventId));
  const queryClient = useQueryClient();
  const mutation = useMutation((userId: string) => register(userId, eventId), {
    onSuccess: () => {
      queryClient.invalidateQueries("userEvents");
      Alert.alert("Success", "You have registered successfully.");
      navigation.navigate("Home");
    },
    onError: (error: Error) => {
      Alert.alert("Error", "An error occurred during registration.");
      console.error(error);
    },
  });

  const handleRegister = () => {
    if (user?.id) {
      mutation.mutate(user?.id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={{ uri: data?.image }} />
      <View style={styles.content}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text>Date: {new Date(data?.date || "").toLocaleDateString()}</Text>
        <Text>Price: ${data?.price}</Text>
        <Text>Location: {data?.location}</Text>
        <Text>Capacity: {data?.capacity}</Text>
        <Text>Available Spots: {data?.availableSpots}</Text>
        <Text>Speakers: {data?.speakers.join(", ")}</Text>
        <Text style={styles.description}>{data?.description}</Text>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    marginTop: 12,
  },
});

export default EventDetailScreen;
