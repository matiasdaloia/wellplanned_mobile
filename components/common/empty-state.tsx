import { horizontalScale, verticalScale } from "@/lib/metrics";
import { Image } from "expo-image";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import { View } from "react-native";
import { Text } from "../ui/components/text";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface Props {
  title: string;
  description: string;
  imageSrc: ImageSourcePropType;
}

export default function EmptyState({ description, imageSrc, title }: Props) {
  return (
    <View className="gap-5 flex-1 items-center justify-center">
      <Image
        style={{
          width: horizontalScale(90),
          height: verticalScale(90),
        }}
        source={imageSrc}
        placeholder={blurhash}
        contentFit="contain"
        transition={1000}
      />
      <View className="gap-2">
        <Text className="text-xl font-bodyBold text-center">{title}</Text>
        <Text className="text-center">{description}</Text>
      </View>
    </View>
  );
}
