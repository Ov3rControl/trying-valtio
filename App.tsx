import React, { Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import AppNavigator from "./src/navigation/AppNavigator";
import { Text } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Suspense fallback={<Text>Loading...</Text>}>
          <AppNavigator />
        </Suspense>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
