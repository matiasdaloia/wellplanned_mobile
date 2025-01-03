import ProfileForm from "@/components/onboarding/profile-form";
import UploadImagePicker from "@/components/onboarding/upload-image-picker";
import { Text } from "@/components/ui/components/text";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <View className="py-8 px-5 bg-primary-main items-center rounded-bl-[81px] rounded-br-[81px]">
          <SafeAreaView>
            <Text className="text-3xl text-white text-center font-bodyBold">
              Let's continue building your profile.
            </Text>
          </SafeAreaView>
          <UploadImagePicker />
        </View>
        <View className="p-5">
          <ProfileForm />
        </View>
      </View>
    </View>
  );
}
