import { memo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { z } from "zod";
import { EventSchema } from "../schemas";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationStack = StackNavigationProp<StackParamList, "AppTabs">;

type Props = {
  event: z.infer<typeof EventSchema>;
};

export const EventCard: React.FC<Props> = memo(({ event }) => {
  const navigation = useNavigation<NavigationStack>();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("EventDetail", { id: String(event.id) })
      }
    >
      <View style={styles.card}>
        <Image style={styles.cardImage} source={{ uri: event.image }} />
        <Text style={styles.cardTitle}>{event.title}</Text>
        <View style={styles.cardContent}>
          <Text>{`Date: ${new Date(event.date).toLocaleDateString()}`}</Text>
          <Text>{`Price: $${event.price}`}</Text>
          <Text>{`Location: ${event.location}`}</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
  },
  cardImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    height: 140,
    width: "100%",
  },
  cardContent: {
    padding: 16,
  },
});
