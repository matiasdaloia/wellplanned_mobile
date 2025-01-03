import React from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/components/button";
import { Text } from "../ui/components/text";

interface DayButtonProps {
  date: Date;
  setDaySlot: React.Dispatch<React.SetStateAction<number>>;
  daySlot: number;
}

export default function DayButton({
  date,
  setDaySlot,
  daySlot,
}: DayButtonProps) {
  const dayShort = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = date.toLocaleDateString("en-US", { day: "numeric" });
  const isActive = daySlot === date.getDay();

  const handleChangeDate = () => {
    const newDaySlot = date.getDay();
    setDaySlot(newDaySlot);
  };

  return (
    <Button
      className={twMerge(
        "min-w-[51px] min-h-[73px] rounded-xl  items-center",
        isActive ? "bg-highlight-main" : "bg-transparent"
      )}
      onPress={handleChangeDate}
    >
      <View className="items-center">
        <Text className="text-3xl font-bodyBold">{dayNumber}</Text>
        <Text
          className={twMerge(
            "font-medium",
            isActive ? "text-black" : "text-gray-main"
          )}
        >
          {dayShort}
        </Text>
      </View>
    </Button>
  );
}

