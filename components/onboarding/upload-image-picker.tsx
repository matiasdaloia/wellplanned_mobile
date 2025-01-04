import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { Loader, Loader2, Pen, Upload } from "lucide-react-native";
import React, { useEffect } from "react";
import { Alert, Pressable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "../ui/components/image";
import colors from "../ui/colors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileUpload, mealPlanService } from "@/lib/mealplan-service";

export default function UploadImagePicker() {
  const { data: profile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (data: FileUpload) => mealPlanService.uploadProfileImage(data),
    onSuccess: () => refetch(),
  });

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleFileUpload = async () => {
    try {
      if (Constants.platform?.ios && !status?.granted) {
        const requestPermissionResponse = await requestPermission();

        if (!requestPermissionResponse.granted) {
          Alert.alert(
            "Permission required",
            "You need to grant permission to access your photos to upload an image."
          );
          return;
        }
      }

      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (canceled) return;

      const result = assets[0];

      await mutateAsync({
        uri: result.uri,
        type: result.mimeType || "image/jpeg",
        name: result.fileName || `profile-image-${Date.now()}.jpg`,
      });
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Error while uploading the file",
        e instanceof Error
          ? e.message
          : "An unknown error occurred, please try again."
      );
    }
  };

  useEffect(() => {
    if (error) {
      console.error(error);
      Alert.alert(
        "Error while uploading the file",
        error instanceof Error
          ? error.message
          : "An unknown error occurred, please try again."
      );
    }
  }, [error]);

  return (
    <Pressable
      onPress={handleFileUpload}
      style={{
        position: "relative",
      }}
    >
      <TouchableOpacity disabled={isPending}>
        {profile?.profile_image ? (
          <View className="relative">
            <Image
              source={{ uri: profile.profile_image }}
              className="w-24 h-24 rounded-full"
            />
            {isPending && (
              <View className="absolute inset-0 bg-black/30 rounded-full items-center justify-center">
                <Loader size={25} color="#fff" className="animate-spin" />
              </View>
            )}
          </View>
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary-extra-light items-center justify-center">
            {isPending ? (
              <Loader size={25} color="#fff" className="animate-ping" />
            ) : (
              <Upload size={25} color="#fff" />
            )}
          </View>
        )}
      </TouchableOpacity>
      <Pressable
        className="absolute bg-white shadow-[0px 0.5px 0.15px rgba(62,62,108,0.15)] rounded-full p-2 bottom-0 right-0 z-3"
        onPress={handleFileUpload}
        disabled={isPending}
      >
        <Pen size={16} color={colors.primary.main} />
      </Pressable>
    </Pressable>
  );
}
