import RecipeBreakdownTabs from "@/components/recommendations/recipe-breakdown-tabs";
import LoadingState from "@/components/ui/components/loading-state";
import { Text } from "@/components/ui/components/text";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ChefHat, Users } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { id, imageUrl } = useLocalSearchParams();

  // const { data: recipe, isLoading } = api.recommendation.getRecipeBreakdown.useQuery({
  //   recommendationId: id as string
  // })
  // TODO: Remove mock data
  const recipe = {
    title: "Spaghetti Carbonara",
    difficulty: "Easy",
    servings: 4,
  };
  const isLoading = false;

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
        source={{ uri: imageUrl as string }}
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
          {recipe && (
            <View className="p-5 gap-4">
              <Text className="text-white text-xl font-bodyBold">
                {recipe.title}
              </Text>
              <View className="gap-6 flex-row">
                <View className="gap-2 items-center flex-row">
                  <ChefHat size={20} color="#fff" />
                  <Text className="text-white">{recipe.difficulty}</Text>
                </View>
                <View className="gap-2 items-center flex-row">
                  <Users size={20} color="#fff" />
                  <Text className="text-white">
                    Servings: {recipe.servings}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
      {isLoading && <LoadingState title="Loading your recipe..." />}
      {recipe && <RecipeBreakdownTabs recipe={recipe} />}
    </View>
  );
}
