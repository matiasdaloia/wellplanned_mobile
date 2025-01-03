import { useSupabase } from "@/context/supabase-provider";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Pen, Upload } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "../ui/components/image";
import colors from "../ui/colors";

export default function UploadImagePicker() {
  const { user } = useSupabase();
  const { data: profile } = {
    data: { avatar: "https://avatars.githubusercontent.com/u/4723117?v=4" },
  };

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handleFileUpload = async () => {
    if (uploadingDocument) {
      return;
    }

    setUploadingDocument(true);

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

      // Check file size (limit to 5MB)
      const fileInfo = await FileSystem.getInfoAsync(result.uri, {
        size: true,
      });
      const fileSize = fileInfo.exists ? fileInfo.size || 0 : 0;
      console.log("File size:", fileSize, "bytes");

      if (fileSize > 5 * 1024 * 1024) {
        throw new Error(
          "File size too large. Please select an image under 5MB."
        );
      }

      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: "base64",
      });

      const mimeType = result.mimeType || "image/jpeg"; // Fallback MIME type
      const fileExtension = mimeType.split("/")[1];
      const filePath = `avatars/${Date.now()}-${user?.id}.${fileExtension}`;

      const arrayBuffer = decode(base64);

      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, arrayBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage error:", error);
        return Alert.alert(
          "Upload Error",
          `Failed to upload image: ${error.message}`
        );
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        Alert.alert(
          "Error while uploading the file, please try again",
          e.message
        );
      } else {
        Alert.alert(
          "Error while uploading the file",
          "An unknown error occurred, please try again."
        );
      }
    } finally {
      setUploadingDocument(false);
    }
  };

  return (
    <Pressable
      onPress={handleFileUpload}
      style={{
        position: "relative",
      }}
    >
      <TouchableOpacity>
        {profile?.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary-extra-light items-center justify-center">
            <Upload size={25} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
      <Pressable
        className="absolute bg-white shadow-[0px 0.5px 0.15px rgba(62,62,108,0.15)] rounded-full p-2 bottom-0 right-0 z-3"
        onPress={handleFileUpload}
      >
        <Pen size={16} color={colors.primary.main} />
      </Pressable>
    </Pressable>
  );
}
