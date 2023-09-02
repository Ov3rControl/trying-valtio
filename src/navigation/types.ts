import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type StackParamList = {
  Home: undefined;
  AppTabs: undefined;
  Login: undefined;
  SignUp: undefined;
  EventList: undefined;
  EventDetail: { id: string };
};
export type NavigationProp = NativeStackNavigationProp<StackParamList>;
export type ScreenProp<T extends keyof StackParamList> = NativeStackScreenProps<
  StackParamList,
  T
>;

export type TabParamList = {
  Home: undefined;
  Events: undefined;
  Login: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
export type TabScreenProp<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;
