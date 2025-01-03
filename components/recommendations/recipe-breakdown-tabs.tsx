import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/components/button";
import { Text } from "../ui/components/text";

interface Props {
  recipe: any;
}

export default function RecipeBreakdownTabs({ recipe }: Props) {
  const [currentTab, setCurrentTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );

  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
    >
      <View className="p-6 pb-10 gap-7 flex-1">
        <View className="flex-row items-center justify-between py-1 px-4 bg-gray-extra-light rounded-xl w-full">
          <Button
            label="Ingredients"
            textClassName={twMerge(
              "text-black font-bodyBold",
              currentTab === "ingredients" && "text-white"
            )}
            className={twMerge(
              "flex-1 rounded-2xl bg-transparent h-14",
              currentTab === "ingredients" && "bg-secondary-main"
            )}
            onPress={() => setCurrentTab("ingredients")}
          />
          <Button
            label="Instructions"
            textClassName={twMerge(
              "text-black font-bodyBold",
              currentTab === "instructions" && "text-white"
            )}
            className={twMerge(
              "flex-1 rounded-2xl bg-transparent h-14",
              currentTab === "instructions" && "bg-secondary-main"
            )}
            onPress={() => setCurrentTab("instructions")}
          />
        </View>
        <View className="border-t border-gray-extra-light" />
        {currentTab === "ingredients" && (
          <View className="gap-2 flex-1">
            {recipe?.ingredients.map((ingredient, i) => (
              <Text key={i} className="text-[#748189]">
                - {ingredient}
              </Text>
            ))}
          </View>
        )}
        {currentTab === "instructions" && (
          <View className="gap-7 flex-1">
            {recipe?.breakdown.map((step, i) => (
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
