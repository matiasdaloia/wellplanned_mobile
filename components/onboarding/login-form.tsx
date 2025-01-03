import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import * as z from "zod";

import type { CodeFormType } from "./signup-form";
import { codeSchema } from "./signup-form";
import { supabase } from "@/lib/supabase";
import { Text } from "../ui/components/text";
import { ControlledInput } from "../ui/components/input";
import { Button } from "../ui/components/button";

const schema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
});

export type FormType = z.infer<typeof schema>;

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const { handleSubmit, control, getValues } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit: handleSubmitCode, control: codeFormControl } =
    useForm<CodeFormType>({
      resolver: zodResolver(codeSchema),
    });

  const onSubmit = async ({ email }: FormType) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (data.user === null) {
      Alert.alert("Check your email for the verification code to continue");
      setPendingVerification(true);
    }

    setLoading(false);
  };

  const onVerify = async ({ code }: CodeFormType) => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: getValues().email,
      token: code,
      type: "email",
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (session) {
      router.push("/(app)/(protected)");
    }
    setLoading(false);
  };

  if (pendingVerification) {
    return (
      <View className="p-5">
        <View className="gap-4">
          <View className="items-center">
            <Text className="text-3xl text-center font-bodyBold text-primary-dark">
              Verification code
            </Text>
            <Text className="text-center text-gray-600">
              Enter the 6-digit code sent to your email{" "}
              <Text className="text-primary-main font-bodyBold">
                {getValues().email}
              </Text>
            </Text>
          </View>
          <ControlledInput control={codeFormControl} label="Code" name="code" />
          <Button
            label="Verify"
            loading={loading}
            onPress={handleSubmitCode(onVerify)}
          />
        </View>
      </View>
    );
  }

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
        <ControlledInput control={control} label="Email" name="email" />
        <Text>
          No account?{" "}
          <Link href="/(auth)/sign-up">
            <Text className="text-primary-main font-bodyBold underline">
              Sign up
            </Text>
          </Link>
        </Text>
        <Button
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          label="Log In"
          loading={loading}
        />
      </View>
    </View>
  );
};

