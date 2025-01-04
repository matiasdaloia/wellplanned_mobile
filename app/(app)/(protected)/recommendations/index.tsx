import MealRecommendations from "@/components/home/meal-recommendations";
import RecommendationsPreview from "@/components/home/recommendations-preview";
import BaseLayout from "@/components/layouts/base";
import EmptyState from "@/components/ui/components/empty-state";
import LoadingState from "@/components/ui/components/loading-state";
import { Text } from "@/components/ui/components/text";
import { slotNamesMap } from "@/lib/constants";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import EventSource from "react-native-sse";

type StreamingMessage =
  | {
      type: "error";
      content: string;
    }
  | {
      type: "update" | "complete";
      content: any[];
    };

export default function Page() {
  const [status, setStatus] = useState<
    "idle" | "streaming" | "complete" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // First fetch the current meal plan to get its ID
  const { data: mealPlans, isLoading: isLoadingMealPlan } = useQuery({
    queryKey: ["mealPlan"],
    queryFn: () => mealPlanService.getCurrentUserMealPlan(),
  });

  // Then check for existing recommendations
  const { data: existingRecommendations, isLoading: isLoadingRecommendations } =
    useQuery({
      queryKey: ["recommendations", mealPlans?.[0]?.id],
      queryFn: () =>
        mealPlanService.getMealPlanRecommendations(mealPlans[0].id),
      enabled: !!mealPlans?.[0]?.id,
    });

  useEffect(() => {
    if (existingRecommendations) {
      setStatus("complete");
      setRecommendations(existingRecommendations);
      return;
    }

    if (!isLoadingMealPlan && !isLoadingRecommendations && mealPlans?.[0]?.id) {
      const generateRecommendations = async () => {
        const es =
          await mealPlanService.createSSEConnectionForRecommendations();

        if (!es) {
          setStatus("error");
          setError("Failed to start recommendations generation");
          return;
        }

        es.addEventListener("message", (event) => {
          if (event.data === "" || event.data === null) return;

          try {
            const data = JSON.parse(event.data) as StreamingMessage;

            switch (data.type) {
              case "update":
                setStatus("streaming");
                setRecommendations((prev) => [...prev, ...data.content]);
                break;

              case "complete":
                setStatus("complete");
                setRecommendations(data.content);
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

      generateRecommendations();
    }
  }, [
    mealPlans,
    isLoadingMealPlan,
    isLoadingRecommendations,
    existingRecommendations,
  ]);

  const groupedRecommendationsBySlot = _.groupBy(recommendations, "slot");

  if (
    isLoadingMealPlan ||
    (isLoadingRecommendations && !existingRecommendations)
  ) {
    return (
      <BaseLayout headerTitle="Recommendations">
        <LoadingState
          title="Getting ready..."
          subtitle="We're checking for existing recommendations."
        />
      </BaseLayout>
    );
  }

  if (status === "error") {
    return (
      <BaseLayout headerTitle="Recommendations">
        <EmptyState
          title="Something went wrong"
          subtitle={error || "Failed to load recommendations"}
          type="error"
          onPressButton={() => setStatus("idle")}
          buttonLabel="Try again"
        />
      </BaseLayout>
    );
  }

  if (status === "idle") {
    return (
      <BaseLayout headerTitle="Recommendations">
        <LoadingState
          title="Getting ready..."
          subtitle="We're about to start generating your recommendations."
        />
      </BaseLayout>
    );
  }

  if (status === "streaming") {
    return (
      <BaseLayout headerTitle="Recommendations">
        <RecommendationsPreview partialResults={recommendations} />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout headerTitle="Recommendations">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-5 flex-1">
          {Object.keys(groupedRecommendationsBySlot).map((key) => (
            <View className="gap-4" key={key}>
              <View>
                <Text className="text-lg font-bodyBold">
                  Your recommendations for{" "}
                  {slotNamesMap[Number(key) as keyof typeof slotNamesMap]}
                </Text>
                <Text className="text-gray-600">
                  Here are some recipes that you can try for{" "}
                  {slotNamesMap[Number(key) as keyof typeof slotNamesMap]}{" "}
                  today. They are based on your meal plan.
                </Text>
              </View>
              <MealRecommendations
                recommendationsForSlot={groupedRecommendationsBySlot[key]}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </BaseLayout>
  );
}

