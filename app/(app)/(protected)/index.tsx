import SplashScreen from "@/components/common/splashscreen";
import BaseLayout from "@/components/layouts/base";
import DayButton from "@/components/menu-overview/day-button";
import colors from "@/components/ui/colors";
import { Button } from "@/components/ui/components/button";
import { Text } from "@/components/ui/components/text";
import { Coffee } from "@/components/ui/icons/coffee";
import { DinnerPlate } from "@/components/ui/icons/dinner-plate";
import { ForkAndKnife } from "@/components/ui/icons/fork-and-knife";
import { Muffin } from "@/components/ui/icons/muffin";
import { todaySlot } from "@/lib/date/utils";
import { mealPlanService } from "@/lib/mealplan-service";
import { horizontalScale } from "@/lib/metrics";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { twMerge } from "tailwind-merge";

interface Meal {
  slot: number;
  meal: string;
}

interface DayMealPlan {
  weekday: number;
  meals: Meal[];
}

interface MealPlanData {
  results: DayMealPlan[];
}

type StreamingMessage =
  | {
      type: "error";
      content: string;
    }
  | {
      type: "update" | "complete";
      content: MealPlanData;
    };

const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date;
});

const slotCardConfig = {
  0: {
    time: "8:00",
    background: "#8BCAB1",
    foreground: "#005244",
    title: "Breakfast",
    icon: <Coffee size={20} color={colors.primary.main} />,
  },
  1: {
    time: "10:00",
    background: "#C3F9E4",
    foreground: "#005244",
    title: "Mid Morning Snack",
    icon: <Muffin size={20} color={colors.primary.main} />,
  },
  2: {
    time: "13:00",
    background: "#88C3C6",
    foreground: "#005244",
    title: "Lunch",
    icon: <ForkAndKnife size={20} color={colors.primary.main} />,
  },
  3: {
    time: "16:00",
    background: "#ACE1E4",
    foreground: "#005244",
    title: "Afternoon Snack",
    icon: <Muffin size={20} color={colors.primary.main} />,
  },
  4: {
    time: "19:00",
    background: "#E4E2AC",
    foreground: "#005244",
    title: "Dinner",
    icon: <DinnerPlate size={20} color={colors.primary.main} />,
  },
};

export default function Page() {
  const [daySlot, setDaySlot] = useState(todaySlot);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string>();
  const [partialResults, setPartialResults] = useState<DayMealPlan[]>();

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ["mealPlan"],
    queryFn: () => mealPlanService.getCurrentUserMealPlan(),
  });

  const selectedDay = currentWeekDays.find((date) => date.getDay() === daySlot);
  const selectedDayFormatted = selectedDay?.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!isLoading && !mealPlans?.length) {
      mealPlanService.createSSEConnectionForMealplanGeneration().then((es) => {
        es?.addEventListener("message", (event) => {
          if (event.data === "" || event.data === null) return;

          try {
            const data = JSON.parse(event.data) as StreamingMessage;

            switch (data.type) {
              case "update":
                setStatus("streaming");
                setPartialResults(data.content.results);
                break;

              case "complete":
                setStatus("complete");
                setPartialResults(data.content.results);
                es.close();
                break;

              case "error":
                setStatus("error");
                setError(data.content);
                es.close();
                break;
            }
          } catch (err) {
            setStatus("error");
            setError("Failed to parse server response");
            es.close();
          }
        });

        es?.addEventListener("error", (error) => {
          setStatus("error");
          setError("Connection failed");
          es.close();
        });
      });
    }
  }, [mealPlans, isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const currentDayMealPlan =
    status === "streaming"
      ? partialResults?.find(
          (result: DayMealPlan) => result.weekday === daySlot
        )
      : mealPlans?.[0]?.data?.results?.find(
          (result: DayMealPlan) => result.weekday === daySlot
        );

  const sortedMeals = currentDayMealPlan?.meals?.sort(
    (a: Meal, b: Meal) => a.slot - b.slot
  );

  return (
    <BaseLayout headerTitle="Weekly Menu" noPadding>
      <View className="gap-6 flex-1">
        <View className="px-5 pt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="gap-4 flex-row">
              {currentWeekDays.map((date) => (
                <DayButton
                  key={date.toISOString()}
                  date={date}
                  daySlot={daySlot}
                  setDaySlot={setDaySlot}
                />
              ))}
            </View>
          </ScrollView>
        </View>
        <View className="flex-1 gap-2">
          <Text className="pl-5 font-medium">{selectedDayFormatted}</Text>
          <View className="flex-row border-t-gray-light border-t">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 50,
                paddingTop: 25,
              }}
            >
              <View className="gap-16 pb-6">
                {status === "error" && (
                  <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <Text className="font-bodyBold">Error</Text>
                    <Text>{error}</Text>
                    <Button
                      onPress={() => setStatus("idle")}
                      label="Try again"
                    />
                  </View>
                )}
                {sortedMeals?.map((meal: Meal, index: number) => {
                  const slot = meal.slot as keyof typeof slotCardConfig;
                  const time = slotCardConfig[slot].time;
                  const title = slotCardConfig[slot].title;
                  const background = slotCardConfig[slot].background;
                  const icon = slotCardConfig[slot].icon;

                  const timeHours = parseInt(time.split(":")[0]);
                  const timeMinutes = parseInt(time.split(":")[1]);
                  const timeDate = new Date();
                  timeDate.setHours(timeHours, timeMinutes);

                  const formattedTime = dayjs(timeDate).format("h A");

                  let showCurrenTimeIndicator = false;

                  const nextSlot = sortedMeals[index + 1];

                  if (nextSlot) {
                    const nextSlotTime =
                      slotCardConfig[
                        nextSlot.slot as keyof typeof slotCardConfig
                      ].time;
                    const nextSlotTimeHours = parseInt(
                      nextSlotTime.split(":")[0]
                    );
                    const nextSlotTimeMinutes = parseInt(
                      nextSlotTime.split(":")[1]
                    );
                    const nextSlotTimeDate = new Date();
                    nextSlotTimeDate.setHours(
                      nextSlotTimeHours,
                      nextSlotTimeMinutes
                    );

                    const now = new Date();
                    const isAfterTimeSlot = now >= timeDate;
                    const isBeforeNextTimeSlot = now < nextSlotTimeDate;

                    showCurrenTimeIndicator =
                      isAfterTimeSlot && isBeforeNextTimeSlot;
                  }

                  return (
                    <View key={index}>
                      <View className="flex-row items-start gap-5 relative">
                        <View
                          className={twMerge(
                            "flex-row items-center justify-center gap-1 rounded-full p-1",
                            showCurrenTimeIndicator
                              ? "bg-highlight-main"
                              : "bg-gray-extra-light"
                          )}
                          style={{
                            width: horizontalScale(56),
                          }}
                        >
                          <Clock size={12} color={colors.primary.main} />
                          <Text className="text-primary-main text-xs">
                            {formattedTime}
                          </Text>
                        </View>
                        <View
                          className="flex-row gap-3 flex-1 rounded-lg p-3"
                          style={{
                            backgroundColor: background,
                          }}
                        >
                          <View>{icon}</View>
                          <View className="flex-1 items-start">
                            <Text className="text-primary-main font-bodyBold text-sm">
                              {title}
                            </Text>
                            <Text className="text-black text-sm font-bodyLight">
                              {meal.meal}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {showCurrenTimeIndicator && (
                        <View>
                          <View className="w-full left-0 -bottom-5 absolute bg-highlight-main h-[1px]">
                            <View className="bg-highlight-main w-3 h-3 rounded-full absolute -top-[6px] -left-[6px]" />
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
}

