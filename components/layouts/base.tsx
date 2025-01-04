import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { Text } from "../ui/components/text";
import { Image } from "../ui/components/image";
import { useQuery } from "@tanstack/react-query";
import { mealPlanService } from "@/lib/mealplan-service";

interface BaseLayoutProps {
  children: React.ReactNode | JSX.Element;
  headerTitle?: string;
  noPadding?: boolean;
}

function Header({ headerTitle }: { headerTitle?: string }) {
  const router = useRouter();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  const { top } = useSafeAreaInsets();

  return (
    <View
      className="items-center flex-row justify-between px-6"
      style={{ paddingTop: top }}
    >
      {headerTitle && (
        <Text className="text-white font-bodyBold text-2xl">{headerTitle}</Text>
      )}
      {profile?.profile_image && (
        <TouchableOpacity
          onPress={() => router.push("/(app)/(protected)/profile")}
        >
          <Image
            source={{ uri: profile?.profile_image }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function BaseLayout({
  children,
  headerTitle,
  noPadding,
}: BaseLayoutProps) {
  return (
    <View className="flex-1 bg-primary-dark gap-8">
      <Header headerTitle={headerTitle} />
      <View className="flex-grow bg-white rounded-t-[40px]">
        <View className={twMerge("flex-1", noPadding ? "" : "p-6")}>
          {children}
        </View>
      </View>
    </View>
  );
}
