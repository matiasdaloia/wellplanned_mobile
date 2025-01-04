import React, { useRef, useEffect } from "react";
import { View, ScrollView, Animated, Easing } from "react-native";
import { Text } from "../../components/ui/components/text";
import LottieView from "lottie-react-native";
import { Meal, DayMealPlan } from "../../app/(app)/(protected)";

interface Props {
  partialResults?: DayMealPlan[];
}

export default function MealPlanPreview({ partialResults }: Props) {
  const totalDays = 7;
  const completedDays = partialResults?.length || 0;
  const progress = (completedDays / totalDays) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <LottieView
        source={require("../../assets/animations/loading_utensils.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />

      <View className="w-full gap-4">
        <View className="items-center">
          <Text className="text-lg font-bodyBold text-primary-main">
            Creating your meal plan...
          </Text>
          <Text className="text-sm text-gray-dark">
            {completedDays} of {totalDays} days completed
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full h-2 bg-gray-light rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-primary-main rounded-full"
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>

        {/* Show latest completed day */}
        {partialResults && partialResults.length > 0 && (
          <ScrollView className="bg-gray-extra-light p-4 rounded-lg h-52">
            <Text className="font-bodyBold mb-2">
              Latest completed: Day {partialResults.length}
            </Text>
            <View className="gap-1">
              {partialResults[partialResults.length - 1].meals?.map(
                (meal: Meal, index: number) => (
                  <Text key={index} className="text-sm text-gray-dark">
                    • {meal.meal}
                  </Text>
                )
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
