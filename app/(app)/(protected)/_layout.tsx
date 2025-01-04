import SplashScreen from "@/components/common/splashscreen";
import colors from "@/components/ui/colors";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Tabs } from "expo-router";
import {
  Calendar,
  ChefHat,
  ShoppingBasket,
  UserCircle,
} from "lucide-react-native";

export default function Layout() {
  const { data, isLoading } = useQuery({
    queryKey: ["hasAlreadyUploadedPDF"],
    queryFn: () => mealPlanService.hasAlreadyUploadedPDF(),
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  if (isLoading || isLoadingProfile) {
    return <SplashScreen />;
  }

  if (!data?.exists) {
    return <Redirect href="/(app)/(auth)/onboarding/upload" />;
  }

  if (!profile?.is_onboarded) {
    return <Redirect href="/(app)/(auth)/onboarding/profile" />;
  }

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
