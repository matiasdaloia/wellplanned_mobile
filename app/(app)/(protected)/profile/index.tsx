import BaseLayout from "@/components/layouts/base";
import { Image } from "@/components/ui/components/image";
import { Text } from "@/components/ui/components/text";
import { useSupabase } from "@/context/supabase-provider";
import { mealPlanService } from "@/lib/mealplan-service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ChevronRight, LogOut, User } from "lucide-react-native";
import React from "react";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Page() {
  const { user, signOut } = useSupabase();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });

  if (!profile || !user) {
    return null;
  }

  const handleSignOut = async () => {
    Alert.alert("Are you sure you want to log out?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <BaseLayout headerTitle="Settings">
      <View className="items-center gap-5">
        <View className="bg-slate-50 p-4 rounded-xl items-center flex-row w-full gap-3">
          {profile.profile_image && (
            <Image
              source={{ uri: profile.profile_image }}
              className="w-16 h-16 rounded-full"
              alt={`${profile.first_name} ${profile.last_name}`}
            />
          )}
          <View>
            <Text className="text-lg text-primary-dark font-bodyBold">
              {profile.first_name} {profile.last_name}
            </Text>
            <Text>{user.email}</Text>
          </View>
        </View>
        <View className="bg-slate-50 w-full rounded-xl p-4">
          <Text className="font-bodyBold mb-3">Account</Text>
          <View className="gap-3">
            <Link href="/(app)/(protected)/profile/edit" asChild>
              <TouchableOpacity>
                <View className="flex-row items-center justify-between py-3 px-1">
                  <View className="flex-row items-center gap-3">
                    <User size={20} color="#000" />
                    <Text>Profile</Text>
                  </View>
                  <ChevronRight size={20} color="#000" />
                </View>
              </TouchableOpacity>
            </Link>
            <View className="border-t border-gray-200" />
            <TouchableOpacity onPress={handleSignOut}>
              <View className="flex-row items-center justify-between py-3 px-1">
                <View className="flex-row items-center gap-3">
                  <LogOut size={20} color="#000" />
                  <Text>Log out</Text>
                </View>
                <ChevronRight size={20} color="#000" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
}

