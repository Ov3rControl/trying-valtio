import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

import { useQuery } from "react-query";
import { fetchEvents } from "../api/api";

import { TabScreenProp } from "../navigation/types";
import { EventCard } from "../components/EventCard";

type Props = TabScreenProp<"Events">;

const EventsScreen: React.FC<Props> = () => {
  const { data } = useQuery("events", fetchEvents);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EventCard event={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
});
