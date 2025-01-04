import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button } from "../ui/components/button";
import { useSupabase } from "@/context/supabase-provider";
import { useMealPlanGenerator } from "@/hooks/use-meal-plan-generator";

interface Props {
  onSuccess: () => void;
}

export default function UploadPdfPicker({ onSuccess }: Props) {
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [pdfUri, setPdfUri] = useState<string>();
  const { status, streamingContent, finalResult, error, generateMealPlan } =
    useMealPlanGenerator(pdfUri);

  console.log({ status, streamingContent, finalResult, error });

  const handleFileUpload = async () => {
    if (uploadingDocument) {
      return;
    }

    setUploadingDocument(true);

    try {
      const { canceled, assets } = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (canceled) {
        throw new Error("User canceled the document picker");
      }

      const result = assets[0];

      if (result.uri) {
        setPdfUri(result.uri);
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
    } finally {
      setUploadingDocument(false);
    }
  };
  return (
    <Button
      label={pdfUri ? "Generate meal plan" : "Upload PDF"}
      onPress={pdfUri ? generateMealPlan : handleFileUpload}
      disabled={uploadingDocument || status === "loading"}
      loading={uploadingDocument || status === "loading"}
    />
  );
}
