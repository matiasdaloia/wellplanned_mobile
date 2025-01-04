import { useSupabase } from "@/context/supabase-provider";
import { useState, useEffect } from "react";
import EventSource from "react-native-sse";

export const useMealPlanGenerator = (pdfUri: string | undefined) => {
  const { getAccessToken } = useSupabase();

  const [status, setStatus] = useState("idle");
  const [streamingContent, setStreamingContent] = useState<any>();
  const [finalResult, setFinalResult] = useState<any>();
  const [error, setError] = useState<string>();

  const generateMealPlan = async () => {
    if (!pdfUri) return;

    try {
      setStatus("loading");
      setError(undefined);

      // Create form data
      const formData = new FormData();

      formData.append("file", {
        uri: pdfUri,
        name: "document.pdf",
        type: "application/pdf",
      } as any);

      formData.append("language", "en");

      // Create SSE connection
      const es = new EventSource(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/mealplans/generate/overview`,
        {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await getAccessToken()}`,
          },
          body: formData,
        }
      );

      // Handle SSE events
      es.addEventListener("message", (event) => {
        if (event.data === "" || event.data === null) return;

        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "update":
              setStatus("streaming");
              setStreamingContent(data.content);
              break;

            case "complete":
              setStatus("complete");
              setFinalResult(data.content);
              es.close();
              break;

            case "error":
              setStatus("error");
              setError(data.content);
              es.close();
              break;
          }
        } catch (err) {
          setStatus("error");
          setError("Failed to parse server response");
          es.close();
        }
      });

      es.addEventListener("error", (error) => {
        setStatus("error");
        setError("Connection failed");
        es.close();
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
    status,
    streamingContent,
    finalResult,
    error,
    generateMealPlan,
  };
};
