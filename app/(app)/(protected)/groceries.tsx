import BaseLayout from "@/components/layouts/base";
import colors from "@/components/ui/colors";
import { Checkbox } from "@/components/ui/components/checkbox";
import EmptyState from "@/components/ui/components/empty-state";
import LoadingState from "@/components/ui/components/loading-state";
import { Text } from "@/components/ui/components/text";
import _ from "lodash";
import { Share2 } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export default function Page() {
  // const {
  //   data: mealPlan,
  //   isLoading,
  //   refetch,
  //   error,
  // } = api.mealplan.findByUserId.useQuery();

  // TODO: Get plan by user id from api and remove mock data
  const isLoading = false;
  const mealPlan = {
    groceries: [
      {
        name: "Eggs",
        aisle: "Dairy",
      },
      {
        name: "Milk",
        aisle: "Dairy",
      },
      {
        name: "Butter",
        aisle: "Dairy",
      },
      {
        name: "Bread",
        aisle: "Bakery",
      },
      {
        name: "Chicken",
        aisle: "Meat",
      },
      {
        name: "Beef",
        aisle: "Meat",
      },
    ],
    status: "processed",
  };
  const refetch = () => {};
  const error = false;

  const formattedToday = today.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  });
  const formattedNextWeek = nextWeek.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  });

  const ingredientsGroupedByAisle = _.groupBy(mealPlan?.groceries, "aisle");

  if (isLoading || mealPlan?.status === "processing_groceries") {
    return (
      <BaseLayout headerTitle="Groceries">
        <LoadingState
          title="We are generating your grocery list..."
          subtitle="This may take a few seconds the first time."
        />
      </BaseLayout>
    );
  }

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

  return (
    <BaseLayout headerTitle="Groceries">
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <View className="gap-5 p-2">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="font-bodyBold text-2xl">For this week</Text>
              <Text className="text-[#71717A]">
                {formattedToday} to {formattedNextWeek}
              </Text>
            </View>
            <TouchableOpacity onPress={() => console.log("share list...")}>
              <Share2 size={21} color={colors.primary.main} />
            </TouchableOpacity>
          </View>

          <View className="gap-8">
            {Object.entries(ingredientsGroupedByAisle).map(
              ([aisle, ingredients]) => (
                <View key={aisle} className="gap-2">
                  <Text className="capitalize">{aisle}:</Text>
                  <View className="gap-3 pl-4">
                    {ingredients.map((ingredient, i) => (
                      <Checkbox
                        key={i}
                        labelClassName="font-bodyLight"
                        label={ingredient.name}
                        accessibilityLabel={ingredient.name}
                        onChange={() => {}}
                      />
                    ))}
                  </View>
                </View>
              )
            )}
          </View>
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
