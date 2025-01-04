import { Platform } from "react-native";
import EventSource from "react-native-sse";
import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface FileUpload {
  uri: string;
  type: string;
  name: string;
}

export interface ProfileImageUploadResponse {
  success: boolean;
  image_url: string;
  file_name: string;
  uploaded_at: string;
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

  private async getHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  }

  async uploadPDF(file: FileUpload): Promise<UploadResponse> {
    const headers = await this.getHeaders();

    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const response = await fetch(`${API_URL}/mealplans/upload`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async createSSEConnectionForMealplanGeneration(): Promise<
    EventSource | undefined
  > {
    const headers = await this.getHeaders();
    try {
      const eventSource = new EventSource(
        `${API_URL}/mealplans/generate/overview`,
        {
          method: "POST",
          headers: {
            ...headers,
            Accept: "text/event-stream",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return eventSource;
    } catch (error) {
      console.error("Failed to create SSE connection:", error);
    }
  }

  async getCurrentUserMealPlan(mealPlanId?: string) {
    const headers = await this.getHeaders();

    const endpoint = mealPlanId
      ? `${API_URL}/mealplans/${mealPlanId}/with-recipes`
      : `${API_URL}/mealplans`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch meal plan: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadProfileImage(
    file: FileUpload
  ): Promise<ProfileImageUploadResponse> {
    const headers = await this.getHeaders();

    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const response = await fetch(`${API_URL}/profile/image`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async updateUserProfile(data: Record<string, any>) {
    const headers = await this.getHeaders();

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserProfile() {
    const headers = await this.getHeaders();

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return response.json();
  }

  async hasAlreadyUploadedPDF() {
    const headers = await this.getHeaders();

    const response = await fetch(`${API_URL}/mealplans/exists`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch uploaded PDF: ${response.statusText}`);
    }

    return response.json();
  }
}

export const mealPlanService = new MealPlanService();
