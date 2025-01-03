import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StyleSheet } from "react-native";

import "../global.css";
import { SupabaseProvider } from "@/context/supabase-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairRegular: require("../assets/fonts/heading/PlayfairDisplay-Regular.ttf"),
    PlayfairBlack: require("../assets/fonts/heading/PlayfairDisplay-Black.ttf"),
    PlayfairBold: require("../assets/fonts/heading/PlayfairDisplay-Bold.ttf"),
    OpensansLight: require("../assets/fonts/body/OpenSansHebrew-Light.ttf"),
    OpensansRegular: require("../assets/fonts/body/OpenSansHebrew-Regular.ttf"),
    OpensansBold: require("../assets/fonts/body/OpenSansHebrew-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SupabaseProvider>
          <Slot />
        </SupabaseProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

