import MealRecommendations from "@/components/home/meal-recommendations";
import BaseLayout from "@/components/layouts/base";
import EmptyState from "@/components/ui/components/empty-state";
import LoadingState from "@/components/ui/components/loading-state";
import { Text } from "@/components/ui/components/text";
import _ from "lodash";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const slotNamesMap = {
  0: "Breakfast",
  1: "Mid Morning Snack",
  2: "Lunch",
  3: "Afternoon Snack",
  4: "Dinner",
};

export default function Page() {
  // const {
  //   isLoading,
  //   data: recommendations,
  //   error,
  //   refetch,
  // } = api.recommendation.findByUserId.useQuery();

  // TODO: Remove mock data
  const isLoading = false;
  const recommendations = [
    {
      id: "1",
      slot: 0,
      recipe: {
        title: "Spaghetti Carbonara",
        imageUrl: "https://source.unsplash.com/400x400/?pasta",
        difficulty: "Easy",
        servings: 4,
      },
    },
    {
      id: "2",
      slot: 1,
      recipe: {
        title: "Spaghetti Carbonara",
        imageUrl: "https://source.unsplash.com/400x400/?pasta",
        difficulty: "Easy",
        servings: 4,
      },
    },
    {
      id: "3",
      slot: 2,
      recipe: {
        title: "Spaghetti Carbonara",
        imageUrl: "https://source.unsplash.com/400x400/?pasta",
        difficulty: "Easy",
        servings: 4,
      },
    },
    {
      id: "4",
      slot: 3,
      recipe: {
        title: "Spaghetti Carbonara",
        imageUrl: "https://source.unsplash.com/400x400/?pasta",
        difficulty: "Easy",
        servings: 4,
      },
    },
    {
      id: "5",
      slot: 4,
      recipe: {
        title: "Spaghetti Carbonara",
        imageUrl: "https://source.unsplash.com/400x400/?pasta",
        difficulty: "Easy",
        servings: 4,
      },
    },
  ];
  const error = false;
  const refetch = () => {};

  const groupedRecommendationsBySlot = _.groupBy(recommendations, "slot");

  if (error) {
    return (
      <BaseLayout headerTitle="Groceries">
        <EmptyState
          title="Something went wrong"
          subtitle="We couldn't generate your grocery list."
          type="error"
          onPressButton={refetch}
          buttonLabel="Try again"
        />
      </BaseLayout>
    );
  }

  if (isLoading) {
    return (
      <BaseLayout headerTitle="Recommendations">
        <LoadingState
          title="Loading your recommendations..."
          subtitle="This may take a few seconds the first time."
        />
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
                  today. They are based on the ingredients that you have in your
                  meal plan.
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

