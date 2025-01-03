import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../ui/components/text";
import { Button } from "../ui/components/button";
import { horizontalScale, verticalScale } from "@/lib/metrics";

interface Props {
  title: string;
  subtitle: string;
  image: string;
}

export default function IntroPage({ title, subtitle, image }: Props) {
  return (
    <View className="gap-16 items-center">
      <Image
        source={require("../../assets/svg/isologo_primary.svg")}
        style={styles.isologo}
      />
      <View>
        <Text className="text-4xl font-titleBold text-primary-dark">
          {title}
        </Text>
        <Text className="text-primary-dark">{subtitle}</Text>
      </View>
      <Image source={image} style={styles.image} />
      <View className="gap-2">
        <Link href="/(app)/(auth)/sign-up" asChild>
          <Button
            label="START NOW"
            variant="secondary"
            className="rounded-full w-60 h-12"
          />
        </Link>
        <Text className="text-sm text-center tracking-wide text-primary-dark">
          Already have an account?{" "}
          <Link href="/(app)/(auth)/sign-in" asChild>
            <Text className="font-bodyBold text-sm text-primary-dark underline">
              Log in
            </Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  isologo: {
    width: horizontalScale(36),
    height: verticalScale(36),
    resizeMode: "contain",
  },
  image: {
    width: horizontalScale(90),
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
