import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import _ from "lodash";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { countriesList } from "@/utils/countries";
import { ControlledSelect } from "../ui/components/select";
import { availableLanguages } from "@/lib/auth/constants";
import { Button } from "../ui/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mealPlanService } from "@/lib/mealplan-service";

const schema = z.object({
  country: z.string({ required_error: "Country is required" }),
  language: z.string({ required_error: "Language is required" }),
});

export type FormType = z.infer<typeof schema>;

export default function ProfileForm() {
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
    defaultValues: {
      country: profile?.country ?? "",
      language: profile?.language ?? "",
    },
    resolver: zodResolver(schema),
  });

  const sortedCountriesList = useMemo(
    () => _.sortBy(countriesList, "name.common"),
    [countriesList]
  );

  const onSubmit = async ({ country, language }: FormType) => {
    await updateProfileMutation({ country, language });
    router.push("/(app)/(auth)/onboarding/sports");
  };

  return (
    <View className="gap-4">
      <ControlledSelect
        name="country"
        control={control}
        label="Country"
        options={sortedCountriesList.map((country) => ({
          label: country.name.common,
          value: country.name.common,
        }))}
      />
      <ControlledSelect
        name="language"
        control={control}
        label="Language"
        options={availableLanguages}
      />
      <View>
        <Button
          label="Save"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        />
        <Button
          label="Cancel"
          loading={isPending}
          variant="outline"
          disabled={isPending}
        />
      </View>
    </View>
  );
}
