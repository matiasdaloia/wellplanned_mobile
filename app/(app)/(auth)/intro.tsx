import IntroPage from "@/components/onboarding/intro-page";
import { ImageBackground } from "expo-image";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { twMerge } from "tailwind-merge";

export default function Page() {
  const onboardingRef = useRef<Onboarding>(null);

  return (
    <View className="flex-1">
      <ImageBackground
        style={styles.imageBackground}
        source={require("../../../assets/png/texture_background.jpg")}
      >
        <Onboarding
          ref={onboardingRef}
          bottomBarHighlight={false}
          showDone={false}
          showNext={false}
          showSkip={false}
          DotComponent={({ selected }) => {
            return (
              <View
                className={twMerge(
                  "bg-transparent rounded-full border border-secondary-main h-3 w-3 mx-1.5",
                  selected && "bg-secondary-main"
                )}
              />
            );
          }}
          containerStyles={{
            paddingHorizontal: 20,
            paddingVertical: 56,
          }}
          pages={[
            {
              backgroundColor: "transparent",
              image: <></>,
              title: (
                <IntroPage
                  title="Helping people to follow the RECIPES!"
                  subtitle="Your Personalized Guide to Healthier Living."
                  image={require("../../../assets/svg/dish.svg")}
                />
              ),
              subtitle: <></>,
            },
            {
              backgroundColor: "transparent",
              image: <></>,
              title: (
                <IntroPage
                  title="Your Nutritionist’s  Plan, at your Fingertips."
                  subtitle="Thrive with Personalized Guidance on Your App."
                  image={require("../../../assets/svg/calendar.svg")}
                />
              ),
              subtitle: <></>,
            },
            {
              backgroundColor: "transparent",
              image: <></>,
              title: (
                <IntroPage
                  title="The Power of Professional Guidance."
                  subtitle="Achieve Your Health Goals Effortlessly."
                  image={require("../../../assets/svg/hand.svg")}
                />
              ),
              subtitle: <></>,
            },
          ]}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
});
