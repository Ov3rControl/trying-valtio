import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import EventsScreen from "../screens/EventsScreen";
import EventDetailScreen from "../screens/EventDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SIgnupScreen";
import HomeScreen from "../screens/HomeScreen";

import { StackParamList } from "./types";

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator();

const options: NativeStackNavigationOptions = {
  headerShown: false,
};

const EventStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EventList" component={EventsScreen as React.FC} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen as React.FC} />
      <Tab.Screen
        name="Events"
        component={EventStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <>
        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
      </>
      <>
        <Stack.Screen name="Login" component={LoginScreen} options={options} />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={options}
        />
      </>
    </Stack.Navigator>
  );
};
export default AppNavigator;
