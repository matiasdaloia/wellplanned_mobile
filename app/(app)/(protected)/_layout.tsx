import colors from "@/components/ui/colors";
import { useSupabase } from "@/context/supabase-provider";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Tabs } from "expo-router";
import {
  Calendar,
  ChefHat,
  ShoppingBasket,
  UserCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";

export default function Layout() {
  // const { data: profile, isLoading: isLoadingProfile } = api.auth.me.useQuery();
  // const { isLoading: isLoadingMealPlan, data: mealPlan } =
  //   api.mealplan.findByUserId.useQuery();
  // const generateMealPlanMutation = api.mealplan.create.useMutation();

  // if (isLoadingMealPlan || isLoadingProfile) {
  //   return <SplashScreen />;
  // }

  // const isLoading = false;
  // const mealPlan = undefined;
  // const refetch = () => {};
  // const error = false;

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  const {
    data: mealPlan,
    isLoading: isLoadingMealPlan,
    refetch,
    error,
  } = useQuery({
    queryKey: ["mealPlan"],
    queryFn: () => mealPlanService.getCurrentUserMealPlan(),
  });

  // // TODO: Remove mock data
  // if (mealPlan?.status === "processing") {
  //   return (
  //     <BaseLayout headerTitle="Weekly Menu">
  //       <LoadingState
  //         title="Generating your meal plan..."
  //         subtitle="This may take a few seconds the first time."
  //       />
  //     </BaseLayout>
  //   );
  // }

  // if (!mealPlan) {
  //   return <Redirect href="/(app)/(auth)/onboarding/upload" />;
  // }

  // if (mealPlan?.status === "failed") {
  //   return (
  //     <EmptyState
  //       title="Something went wrong"
  //       subtitle="We couldn't generate your meal plan, please try again."
  //       type="error"
  //       onPressButton={() => generateMealPlanMutation.mutate()}
  //       buttonLabel="Try again"
  //     />
  //   );
  // }

  // if (mealPlan?.status === "processed" && !profile?.isOnboarded) {
  //   return <Redirect href="/(auth)/onboarding/profile" />;
  // }

  console.log({
    profile,
    mealPlan,
    isLoadingProfile,
    isLoadingMealPlan,
    error,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Calendar color={color} />,
          tabBarLabel: "Menu",
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          tabBarIcon: ({ color }) => <ChefHat color={color} />,
          tabBarLabel: "Recipes",
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          tabBarIcon: ({ color }) => <ShoppingBasket color={color} />,
          tabBarLabel: "Groceries",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <UserCircle color={color} />,
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
