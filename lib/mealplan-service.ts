import { Platform } from "react-native";
import EventSource from "react-native-sse";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface FileUpload {
  uri: string;
  type: string;
  name: string;
}

export interface UploadResponse {
  success: boolean;
  pdf_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface MealPlanPreferences {
  target_calories?: number;
  dietary_restrictions?: string[];
  cuisines?: string[];
  allergies?: string[];
}

class MealPlanService {
  private token: string = "";

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    };
  }

  async uploadPDF(file: FileUpload): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const response = await fetch(`${API_URL}/mealplans/upload`, {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  createSSEConnectionForMealplanGeneration(
    language: string = "en",
    preferences?: MealPlanPreferences
  ): EventSource {
    const params = new URLSearchParams({
      language,
      ...(preferences && { preferences: JSON.stringify(preferences) }),
    });

    const eventSource = new EventSource(
      `${API_URL}/mealplans/generate/overview?${params}`,
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    return eventSource;
  }
}

export const mealPlanService = new MealPlanService();
