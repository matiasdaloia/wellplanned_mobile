import RecipeBreakdownTabs from "@/components/recommendations/recipe-breakdown-tabs";
import LoadingState from "@/components/ui/components/loading-state";
import { Text } from "@/components/ui/components/text";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type StreamingMessage =
  | {
      type: "error";
      content: string;
    }
  | {
      type: "update" | "complete";
      content: string;
    };

export default function Page() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState<
    "idle" | "streaming" | "complete" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState();

  const { data: recommendation, isLoading } = useQuery({
    queryKey: ["recommendation", id],
    queryFn: () => mealPlanService.getMealPlanRecommendation(id as string),
  });

  useEffect(() => {
    if (recommendation?.recipe_breakdown_content) {
      setStatus("complete");
      setBreakdown(recommendation.recipe_breakdown_content);
      return;
    }

    if (!isLoading && recommendation) {
      const generateBreakdown = async () => {
        const es = await mealPlanService.createSSEConnectionForRecipeBreakdown(
          id as string
        );

        if (!es) {
          setStatus("error");
          setError("Failed to start recommendation breakdown generation");
          return;
        }

        es.addEventListener("message", (event) => {
          if (event.data === "" || event.data === null) return;

          try {
            const data = JSON.parse(event.data) as StreamingMessage;

            console.log({ data });

            switch (data.type) {
              case "update":
                setStatus("streaming");
                setBreakdown(data.content);
                break;

              case "complete":
                setStatus("complete");
                setBreakdown(data.content);
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
      };

      generateBreakdown();
    }
  }, [recommendation, isLoading, id]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading recipe..."
        subtitle="We're getting your recipe ready."
      />
    );
  }

  if (!recommendation) {
    return (
      <LoadingState
        title="Recipe not found"
        subtitle="We couldn't find this recipe."
      />
    );
  }

  return (
    <View className="flex-1 relative bg-white">
      <TouchableOpacity
        style={{
          borderRadius: 999,
          position: "absolute",
          top: top + 10,
          left: 10,
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 10,
        }}
        onPress={() => {
          router.back();
        }}
      >
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>
      <ImageBackground
        source={{ uri: recommendation.recipe_thumbnail as string }}
        style={{
          width: Dimensions.get("window").width,
          aspectRatio: 1,
        }}
        imageStyle={{
          borderRadius: 20,
        }}
        resizeMode="cover"
      >
        <LinearGradient
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            justifyContent: "flex-end",
          }}
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.9)"]}
        >
          {breakdown && (
            <View className="p-5 gap-4">
              <Text className="text-white text-xl font-bodyBold">
                {recommendation.recipe_title}
              </Text>
              <View className="gap-6 flex-row">
                <View className="gap-2 items-center flex-row">
                  <Clock size={20} color="#fff" />
                  <Text className="text-white">{breakdown.time}</Text>
                </View>
                <View className="gap-2 items-center flex-row">
                  <Users size={20} color="#fff" />
                  <Text className="text-white">{breakdown.servings}</Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
      <RecipeBreakdownTabs
        recommendation={{
          ...recommendation,
          breakdown: breakdown || undefined,
          status:
            status === "error"
              ? "failed"
              : status === "complete"
              ? "completed"
              : "pending",
        }}
      />
    </View>
  );
}
