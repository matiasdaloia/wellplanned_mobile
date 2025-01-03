import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import * as z from "zod";

import { Text } from "../ui/components/text";
import { ControlledInput } from "../ui/components/input";
import { Button } from "../ui/components/button";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export type FormType = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { signInWithPassword } = useSupabase();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email }: FormType) => {
    setLoading(true);

    try {
      await signInWithPassword(email, form.getValues().password);
      form.reset();
      router.push("/(app)/(protected)");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred while signing in, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-5">
      <View className="items-center gap-1">
        <Text className="text-center text-3xl font-bodyBold text-primary-dark">
          Welcome back!
        </Text>
        <Text className="text-center text-gray-600">
          Let's get started on your journey to a healthier you. Please login to
          access your personalized diet plan.
        </Text>
      </View>
      <View className="gap-4">
        <ControlledInput control={form.control} label="Email" name="email" />
        <ControlledInput
          control={form.control}
          label="Password"
          name="password"
          secureTextEntry
        />
        <Text>
          No account?{" "}
          <Link href="/(app)/(auth)/sign-up">
            <Text className="text-primary-main font-bodyBold underline">
              Sign up
            </Text>
          </Link>
        </Text>
        <Button
          disabled={loading}
          onPress={form.handleSubmit(onSubmit)}
          label="Log In"
          loading={loading}
        />
      </View>
    </View>
  );
};

