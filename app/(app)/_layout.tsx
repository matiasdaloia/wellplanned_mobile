import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

