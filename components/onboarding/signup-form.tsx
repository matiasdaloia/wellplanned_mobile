import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as z from "zod";

import { Text } from "../ui/components/text";
import { ControlledInput } from "../ui/components/input";
import { Button } from "../ui/components/button";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const schema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
});

export const codeSchema = z.object({
  code: z.string().max(6, "Code must be 6 characters"),
});

export type FormType = z.infer<typeof schema>;
export type CodeFormType = z.infer<typeof codeSchema>;

export const SignupForm = () => {
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit: handleSubmitSignup,
    control: formControl,
    getValues,
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit: handleSubmitCode, control: codeFormControl } =
    useForm<CodeFormType>({
      resolver: zodResolver(codeSchema),
    });

  const onSubmit = async ({ email, name, lastName }: FormType) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { first_name: name, last_name: lastName },
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
      <View className="gap-4 p-5">
        <View className="items-center">
          <Text className="text-3xl font-bodyBold text-primary-dark text-center">
            Verification code
          </Text>
          <Text className="text-center text-gray-600">
            Enter the 6-digit code sent to your email
          </Text>
        </View>
        <ControlledInput name="code" control={codeFormControl} label="Code" />
        <Button
          label="Verify"
          loading={loading}
          onPress={handleSubmitCode(onVerify)}
        />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 20,
        paddingHorizontal: 20,
        gap: 16,
      }}
      alwaysBounceVertical={false}
    >
      <View className="items-center">
        <Text className="text-center text-3xl font-bodyBold text-primary-dark">
          Create your account
        </Text>
        <Text className="text-center text-gray-600">
          To get started, please enter your information below.
        </Text>
      </View>
      <View className="gap-4">
        <ControlledInput name="name" control={formControl} label="First Name" />
        <ControlledInput
          name="lastName"
          control={formControl}
          label="Last Name"
        />
        <ControlledInput name="email" control={formControl} label="Email" />
        <Text>
          Already have an account?{" "}
          <Link href="/sign-in">
            <Text className="text-primary-main font-bodyBold underline">
              Sign In
            </Text>
          </Link>
        </Text>
        <Button
          onPress={handleSubmitSignup(onSubmit)}
          disabled={loading}
          label="Sign Up"
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

