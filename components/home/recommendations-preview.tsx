import React, { useRef, useEffect } from "react";
import { View, ScrollView, Animated, Easing } from "react-native";
import { Text } from "../ui/components/text";
import LottieView from "lottie-react-native";
import { slotNamesMap } from "../../lib/constants";
import _ from "lodash";
import MealRecommendations from "./meal-recommendations";

interface Props {
  partialResults: any[];
}

export default function RecommendationsPreview({ partialResults }: Props) {
  const totalSlots = 5; // Number of meal slots per day
  const completedSlots = Object.keys(_.groupBy(partialResults, "slot")).length;
  const progress = (completedSlots / totalSlots) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const groupedRecommendationsBySlot = _.groupBy(partialResults, "slot");

  return (
    <View className="flex-1 px-4">
      <View className="items-center mb-8">
        <LottieView
          source={require("../../assets/animations/loading_utensils.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />

        <View className="w-full gap-4">
          <View className="items-center">
            <Text className="text-lg font-bodyBold text-primary-main">
              Finding the best recipes for you...
            </Text>
            <Text className="text-sm text-gray-dark">
              {completedSlots} of {totalSlots} meal types completed
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
        </View>
      </View>

      {/* Show recommendations grouped by slot */}
      {partialResults.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
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
      )}
    </View>
  );
}
