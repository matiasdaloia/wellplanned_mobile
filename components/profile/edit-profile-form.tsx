import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

import { useSupabase } from "@/context/supabase-provider";
import { supabase } from "@/lib/supabase";
import { ControlledInput } from "../ui/components/input";
import { ControlledSelect } from "../ui/components/select";
import { availableLanguages } from "@/lib/auth/constants";
import { Button } from "../ui/components/button";
import { mealPlanService } from "@/lib/mealplan-service";
import { useMutation, useQuery } from "@tanstack/react-query";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  language: z.string().optional(),
});

type FormType = z.infer<typeof schema>;

export default function EditProfileForm() {
  const { user } = useSupabase();
  const router = useRouter();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => mealPlanService.getUserProfile(),
  });
  const { mutateAsync: updateProfileMutation, isPending } = useMutation({
    mutationFn: (data: Record<string, any>) =>
      mealPlanService.updateUserProfile(data),
  });

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      email: user?.email ?? "",
      language: profile?.language ?? "",
    },
  });

  const onSubmit = async ({
    email,
    firstName,
    lastName,
    language,
  }: FormType) => {
    try {
      await updateProfileMutation({
        first_name: firstName,
        last_name: lastName,
        language,
      });

      if (email) {
        await supabase.auth.updateUser({
          email,
        });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred, please try again."
      );
    }
  };

  return (
    <View className="gap-5">
      <View className="gap-2">
        <ControlledInput
          control={control}
          label="First Name"
          name="firstName"
        />
        <ControlledInput control={control} label="Last Name" name="lastName" />
        <ControlledSelect
          control={control}
          label="Language"
          name="language"
          options={availableLanguages}
        />
        <ControlledInput control={control} label="Email" name="email" />
      </View>
      <View>
        <Button
          label="Save"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        />
        <Button
          onPress={() => router.back()}
          variant="outline"
          disabled={isPending}
          loading={isPending}
          label="Cancel"
        />
      </View>
    </View>
  );
}
