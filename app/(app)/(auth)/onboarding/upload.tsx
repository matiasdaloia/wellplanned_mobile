import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/ui/components/text";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import UploadPdfPicker from "@/components/onboarding/upload-pdf-picker";
import { useQuery } from "@tanstack/react-query";
import { mealPlanService } from "@/lib/mealplan-service";

export default function Page() {
  const router = useRouter();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../../../assets/png/texture_background.jpg")}
        style={{ flex: 1 }}
      >
        <View className="flex-1 gap-8 justify-between">
          <View className="pt-8 bg-primary-main justify-end items-center rounded-bl-[81px] rounded-br-[81px]">
            <SafeAreaView>
              <Text className="text-3xl text-white font-bodyBold text-center">
                Hello {profile?.first_name}!
              </Text>
              <Text className="text-3xl text-white font-bodyBold text-center">
                Let's get started.
              </Text>
            </SafeAreaView>
          </View>
          <View
            className="bg-white justify-center items-center rounded-3xl p-6 gap-4 self-center"
            style={{
              width: Dimensions.get("window").width - horizontalScale(40),
              alignSelf: "center",
            }}
          >
            <LottieView
              source={require("../../../../assets/animations/onboarding/upload.json")}
              style={{
                width: horizontalScale(100),
                height: verticalScale(100),
              }}
              autoPlay
              loop
            />
            <Text className="text-center">
              Ready to take the next step? Upload your diet plan effortlessly –
              whether it's a PDF from your nutritionist or manual input, we've
              got you covered.
            </Text>
            <UploadPdfPicker
              onSuccess={() => router.push("/(app)/(auth)/onboarding/profile")}
            />
          </View>
          <SafeAreaView>
            <Image
              source={require("../../../../assets/svg/isologo_primary.svg")}
              style={{
                width: horizontalScale(40),
                aspectRatio: 1,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}
