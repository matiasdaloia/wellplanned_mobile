import BaseLayout from "@/components/layouts/base";
import UploadImagePicker from "@/components/onboarding/upload-image-picker";
import EditProfileForm from "@/components/profile/edit-profile-form";
import React from "react";
import { View } from "react-native";

export default function Page() {
  return (
    <BaseLayout headerTitle="Profile">
      <View className="items-center">
        <UploadImagePicker />
      </View>
      <View className="mt-5">
        <EditProfileForm />
      </View>
    </BaseLayout>
  );
}
