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
import { useSupabase } from "@/context/supabase-provider";

WebBrowser.maybeCompleteAuthSession();

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter."
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter."
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character."
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
    name: z.string().min(1, "Please enter your first name."),
    lastName: z.string().min(1, "Please enter your last name."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export type FormType = z.infer<typeof formSchema>;

export const SignupForm = () => {
  const router = useRouter();
  const { signUp } = useSupabase();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit: handleSubmitSignup,
    control: formControl,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
    },
  });

  const onSubmit = async ({ email, password, name, lastName }: FormType) => {
    const options = {
      data: { first_name: name, last_name: lastName },
    };

    setLoading(true);

    try {
      await signUp(email, password, options);
      reset();
      router.push("/(app)/(protected)");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred while signing up, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

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
        <ControlledInput
          name="password"
          control={formControl}
          label="Password"
          secureTextEntry
        />
        <ControlledInput
          name="confirmPassword"
          control={formControl}
          label="Confirm Password"
          secureTextEntry
        />
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

