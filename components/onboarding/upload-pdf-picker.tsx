import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import { Alert } from "react-native";
import { Button } from "../ui/components/button";
import { useSupabase } from "@/context/supabase-provider";

interface Props {
  onSuccess: () => void;
}

export default function UploadPdfPicker({ onSuccess }: Props) {
  const { user } = useSupabase();
  const [uploadingDocument, setUploadingDocument] = useState(false);
  // const generateMealPlanMutation = api.mealplan.create.useMutation()

  const handleFileUpload = async () => {
    if (uploadingDocument) {
      return;
    }

    setUploadingDocument(true);

    try {
      const { canceled, assets } = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (canceled) {
        throw new Error("User canceled the document picker");
      }

      const result = assets[0];
      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: "base64",
      });
      const filePath = `meal_plan-${user?.id}.pdf`;

      const { error } = await supabase.storage
        .from("files")
        .upload(`mealplans/${filePath}`, decode(base64), {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      // TODO: Generate meal plan api
      // generateMealPlanMutation.mutate()

      onSuccess();
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
    } finally {
      setUploadingDocument(false);
    }
  };
  return (
    <Button
      label="Upload diet plan"
      onPress={handleFileUpload}
      disabled={uploadingDocument}
      loading={uploadingDocument}
    />
  );
}
