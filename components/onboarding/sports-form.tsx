import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import _ from "lodash";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";
import { Text } from "../ui/components/text";
import { Button } from "../ui/components/button";
import { ControlledInput } from "../ui/components/input";

const schema = z.object({
  sports: z.array(z.string(), {
    required_error: "Please select at least one sport, or select 'none'",
  }),
  sportsTimesPerWeek: z.string({
    required_error: "Please enter a number, or 0 if you do not play any sport",
  }),
  allergies: z.array(
    z.string({
      required_error: "Please select at least one option, or select 'none'",
    })
  ),
  dietRestrictions: z.array(
    z.string({
      required_error: "Please select at least one option, or select 'none'",
    })
  ),
});

export type FormType = z.infer<typeof schema>;

export default function SportsForm() {
  const router = useRouter();
  const { data: profile } = {
    data: {
      avatar: "https://example.com/avatar.jpg",
      country: "United States",
      language: "english",
      sports: ["Soccer", "Basketball"],
      sportsTimesPerWeek: "3",
      allergies: ["Peanuts", "Milk"],
      dietRestrictions: ["Vegetarian"],
    },
  };

  const { handleSubmit, setValue, control } = useForm<FormType>({
    defaultValues: {
      sports: profile?.sports ?? [],
      sportsTimesPerWeek: profile?.sportsTimesPerWeek?.toString() ?? "",
      allergies: profile?.allergies ?? [],
      dietRestrictions: profile?.dietRestrictions ?? [],
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormType) => {
    try {
      // await updateProfileMutation.mutateAsync({
      //   ...values,
      //   sportsTimesPerWeek: Number(values.sportsTimesPerWeek),
      // });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    }

    router.push("/(app)/(protected)");
  };

  const commonSports = useMemo(() => {
    return [
      { value: "Soccer" },
      { value: "Basketball" },
      { value: "Volleyball" },
      { value: "Tennis" },
      { value: "Swimming" },
      { value: "Running" },
      { value: "Cycling" },
      { value: "Gym" },
      { value: "Crossfit" },
      { value: "Functional Training" },
      { value: "American Football" },
      { value: "Martial Arts" },
      { value: "Baseball" },
      { value: "Boxing" },
      { value: "Other" },
    ];
  }, []);

  const commonAllergies = useMemo(() => {
    return [
      { value: "Peanuts" },
      { value: "Tree nuts" },
      { value: "Milk" },
      { value: "Eggs" },
      { value: "Wheat" },
      { value: "Soy" },
      { value: "Fish" },
      { value: "Shellfish" },
      { value: "Sesame" },
      { value: "Mustard" },
      { value: "Celery" },
      { value: "Sulphites" },
      { value: "Lupin" },
      { value: "Molluscs" },
      { value: "None" },
    ];
  }, []);

  const commonDietRestrictions = useMemo(() => {
    return [
      { value: "Vegetarian" },
      { value: "Vegan" },
      { value: "Gluten Free" },
      { value: "Ketogenic" },
      { value: "Paleo" },
      { value: "Low Carb" },
      { value: "Dairy Free" },
      { value: "Halal" },
      { value: "Kosher" },
      { value: "Low Fat" },
      { value: "Low Sodium" },
      { value: "No Red Meat" },
      { value: "Pescatarian" },
      { value: "None" },
    ];
  }, []);

  return (
    <View className="flex-1 gap-4">
      <View>
        <Text>What sports do you practice?</Text>
        <View className="gap-2 flex-wrap flex-row">
          {commonSports.map((sport) => (
            <Controller
              key={sport.value}
              name="sports"
              control={control}
              render={({ field }) => (
                <Button
                  label={sport.value}
                  size="sm"
                  className={
                    field.value?.includes(sport.value)
                      ? "bg-blue-500"
                      : "bg-blue-300"
                  }
                  onPress={async () => {
                    const newSports = field.value?.includes(sport.value)
                      ? field.value.filter((item) => item !== sport.value)
                      : [...(field.value ?? []), sport.value];

                    setValue("sports", newSports);
                  }}
                />
              )}
            />
          ))}
        </View>
      </View>

      <ControlledInput
        name="sportsTimesPerWeek"
        control={control}
        label="How many times a week?"
      />

      <View>
        <Text>Do you have any allergies?</Text>
        <View className="gap-2 flex-wrap flex-row">
          {commonAllergies.map((allergy) => (
            <Controller
              key={allergy.value}
              name="allergies"
              control={control}
              render={({ field }) => (
                <Button
                  label={allergy.value}
                  size="sm"
                  className={
                    field.value?.includes(allergy.value)
                      ? "bg-purple-500"
                      : "bg-purple-300"
                  }
                  onPress={async () => {
                    const newAllergies = field.value?.includes(allergy.value)
                      ? field.value.filter((item) => item !== allergy.value)
                      : [...(field.value ?? []), allergy.value];

                    setValue("allergies", newAllergies);
                  }}
                />
              )}
            />
          ))}
        </View>
      </View>

      <View>
        <Text>Do you have any diet restriction?</Text>
        <View className="gap-2 flex-wrap flex-row">
          {commonDietRestrictions.map((restriction) => (
            <Controller
              key={restriction.value}
              name="dietRestrictions"
              control={control}
              render={({ field }) => (
                <Button
                  size="sm"
                  label={restriction.value}
                  className={
                    field.value?.includes(restriction.value)
                      ? "bg-orange-500"
                      : "bg-orange-300"
                  }
                  onPress={async () => {
                    const newDietRestrictions = field.value?.includes(
                      restriction.value
                    )
                      ? field.value.filter((item) => item !== restriction.value)
                      : [...(field.value ?? []), restriction.value];

                    setValue("dietRestrictions", newDietRestrictions);
                  }}
                />
              )}
            />
          ))}
        </View>
      </View>

      <View>
        <Button
          onPress={handleSubmit(onSubmit)}
          // disabled={updateProfileMutation.isPending}
          label="Save"
          // loading={updateProfileMutation.isPending}
        />

        <Button
          variant="outline"
          label="Cancel"
          // loading={updateProfileMutation.isPending}
          // disabled={updateProfileMutation.isPending}
        />
      </View>
    </View>
  );
}
