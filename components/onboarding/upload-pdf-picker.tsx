import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Alert } from "react-native";
import { Button } from "../ui/components/button";
import { useSupabase } from "@/context/supabase-provider";
import { FileUpload, mealPlanService } from "@/lib/mealplan-service";
import { useMutation } from "@tanstack/react-query";

interface Props {
  onSuccess: () => void;
}

export default function UploadPdfPicker({ onSuccess }: Props) {
  const { getAccessToken } = useSupabase();

  const uploadPdfMutation = useMutation({
    mutationFn: (file: FileUpload) => mealPlanService.uploadPDF(file),
    onSuccess: onSuccess,
  });

  const handleFileUpload = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        throw new Error("No token available");
      }

      mealPlanService.setToken(token);

      const { canceled, assets } = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (canceled) {
        throw new Error("User canceled the document picker");
      }

      const result = assets[0];

      if (result.uri) {
        uploadPdfMutation.mutate({
          uri: result.uri,
          type: result.mimeType || "application/pdf",
          name: result.name,
        });
      }
    } catch (e) {
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
    }
  };

  return (
    <Button
      label="Upload PDF"
      onPress={handleFileUpload}
      disabled={uploadPdfMutation.isPending}
      loading={uploadPdfMutation.isPending}
    />
  );
}
