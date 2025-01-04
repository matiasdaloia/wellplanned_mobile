import colors from "@/components/ui/colors";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import {
  Calendar,
  ChefHat,
  ShoppingBasket,
  UserCircle,
} from "lucide-react-native";

export default function Layout() {
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
