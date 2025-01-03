import { Button } from "@/components/ui/components/button";
import { Image } from "@/components/ui/components/image";
import { Text } from "@/components/ui/components/text";
import { horizontalScale, verticalScale } from "@/lib/metrics";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Page() {
  return (
    <View className="bg-primary-extra-dark flex-1 items-center justify-center gap-4">
      <View className="gap-4 items-center">
        <Image
          source={require("../../../assets/svg/logo_highlight.svg")}
          style={styles.image}
        />
        <Text className="text-white font-bodyRegular">
          Personalized nutrition, made simple
        </Text>
      </View>
      <Link href="/(app)/(auth)/intro" asChild>
        <Button
          label="START NOW"
          variant="secondary"
          className="rounded-full w-60 h-12"
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: horizontalScale(190),
    height: verticalScale(120),
    resizeMode: "contain",
  },
});
