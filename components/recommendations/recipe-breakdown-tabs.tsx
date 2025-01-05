import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/components/button";
import { Text } from "../ui/components/text";

interface Recipe {
  id: string;
  recipe_title: string;
  recipe_link: string;
  recipe_thumbnail: string;
  breakdown?: {
    ingredients: string[];
    instructions: string[];
    author: string;
    servings: number;
    steps: string[];
    time: number;
    title: string;
  };
  status: "pending" | "completed" | "failed";
}

interface Props {
  recommendation: Recipe;
}

export default function RecipeBreakdownTabs({ recommendation }: Props) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );

  if (!recommendation.breakdown || recommendation.status !== "completed") {
    return (
      <View className="p-6 flex-1 items-center justify-center">
        <Text className="text-gray-600">
          {recommendation.status === "failed"
            ? "Failed to load recipe breakdown. Please try again later."
            : "Loading recipe breakdown..."}
        </Text>
      </View>
    );
  }

  const { breakdown } = recommendation;

  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <View className="p-6 pb-10 gap-7 flex-1">
        {/* Tab buttons */}
        <View className="flex-row items-center justify-between py-1 px-4 bg-gray-extra-light rounded-xl w-full">
          <Button
            label="Ingredients"
            textClassName={twMerge(
              "text-black font-bodyBold",
              activeTab === "ingredients" && "text-white"
            )}
            className={twMerge(
              "flex-1 rounded-2xl bg-transparent h-14",
              activeTab === "ingredients" && "bg-secondary-main"
            )}
            onPress={() => setActiveTab("ingredients")}
          />
          <Button
            label="Instructions"
            textClassName={twMerge(
              "text-black font-bodyBold",
              activeTab === "instructions" && "text-white"
            )}
            className={twMerge(
              "flex-1 rounded-2xl bg-transparent h-14",
              activeTab === "instructions" && "bg-secondary-main"
            )}
            onPress={() => setActiveTab("instructions")}
          />
        </View>

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && (
          <View className="gap-2 flex-1">
            {breakdown.ingredients.map((ingredient, i) => (
              <Text key={i} className="text-[#748189]">
                - {ingredient}
              </Text>
            ))}
          </View>
        )}

        {/* Instructions Tab */}
        {activeTab === "instructions" && (
          <View className="gap-7 flex-1">
            {breakdown.steps.map((step, i) => (
              <View className="gap-1" key={i}>
                <Text className="text-2xl font-bodyBold text-[#0A2533]">
                  Step {i + 1}
                </Text>
                <Text className="text-[#748189]">{step}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
