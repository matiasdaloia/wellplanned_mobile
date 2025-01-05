import { horizontalScale } from "@/lib/metrics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "../ui/components/text";

// TODO: Change type
interface Props {
  recommendation: any;
}

export default function MealRecommendationCard({ recommendation }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/recommendations/${recommendation.id}`);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <ImageBackground
          source={{ uri: recommendation.recipe_thumbnail }}
          style={{
            width: Dimensions.get("window").width * 0.8 - horizontalScale(32),
            aspectRatio: 1,
            marginRight: horizontalScale(16),
          }}
          imageStyle={{
            borderRadius: 12,
          }}
          resizeMode="cover"
        >
          <LinearGradient
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
              justifyContent: "flex-end",
            }}
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.9)"]}
          >
            <View className="p-6 gap-2">
              <Text className="text-white text-xl font-bodyBold">
                {recommendation.recipe_title}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}
