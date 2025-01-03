import SportsForm from "@/components/onboarding/sports-form";
import UploadImagePicker from "@/components/onboarding/upload-image-picker";
import { Text } from "@/components/ui/components/text";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <View className="rounded-bl-[81px] rounded-br-[81px] py-8 px-5 bg-primary-main items-center">
          <SafeAreaView>
            <Text className="text-3xl text-white text-center font-bodyBold">
              Last step..
            </Text>
          </SafeAreaView>
          <UploadImagePicker />
        </View>
        <ScrollView
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
        >
          <SportsForm />
        </ScrollView>
      </View>
    </View>
  );
}
