import React, { useRef, useEffect } from "react";
import { View, ScrollView, Animated, Easing } from "react-native";
import { Text } from "../ui/components/text";
import LottieView from "lottie-react-native";
import { slotNamesMap } from "@/lib/constants";

interface Props {
  partialResults: any[];
}

export default function RecommendationsPreview({ partialResults }: Props) {
  const totalSlots = 5; // Number of meal slots per day
  const completedSlots = Object.keys(partialResults).length;
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

        {/* Show latest recommendations */}
        {partialResults.length > 0 && (
          <ScrollView className="bg-gray-extra-light p-4 rounded-lg h-52">
            <Text className="font-bodyBold mb-2">Latest recommendations</Text>
            <View className="gap-1">
              {partialResults.slice(-3).map((recommendation, index) => (
                <View key={index} className="mb-2">
                  <Text className="text-sm font-bodyBold text-primary-main">
                    {
                      slotNamesMap[
                        recommendation.slot as keyof typeof slotNamesMap
                      ]
                    }
                  </Text>
                  <Text className="text-sm text-gray-dark">
                    • {recommendation.recipe.title}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
