import { horizontalScale, verticalScale } from "@/lib/metrics";
import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-extra-dark">
      <LottieView
        source={require("../../../assets/animations/onboarding/jumping_avocado.json")}
        style={{
          width: horizontalScale(180),
          height: verticalScale(180),
        }}
        autoPlay
        loop
      />
    </View>
  );
}
