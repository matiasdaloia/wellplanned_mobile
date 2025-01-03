import { LoginForm } from "@/components/onboarding/login-form";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import { Image } from "expo-image";
import React from "react";
import { SafeAreaView, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 bg-primary-dark">
      <SafeAreaView style={{ flex: 0.4 }}>
        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../../../assets/svg/logo_highlight.svg")}
            style={{
              width: horizontalScale(170),
              height: verticalScale(100),
              resizeMode: "contain",
            }}
          />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white rounded-tl-[40px] rounded-tr-[40px]">
        <SafeAreaView>
          <LoginForm />
        </SafeAreaView>
      </View>
    </View>
  );
}

