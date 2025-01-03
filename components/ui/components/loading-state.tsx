import type { AnimationObject } from 'lottie-react-native'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface LoadingStateProps {
  source?: string | AnimationObject
  title?: string
  subtitle?: string
}

export default function LoadingState({ source, title, subtitle }: LoadingStateProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-20 h-20">
        <LottieView
          source={source ?? require('../../../assets/animations/loading_utensils.json')}
          style={{
            transform: [{ scale: 2.8 }],
            flex: 1
          }}
          autoPlay
          loop
        />
      </View>
      <Text className="font-bodyBold text-xl">{title ?? 'Loading...'}</Text>
      <Text className="font-body text-[#71717A]">{subtitle ?? 'This may take a few seconds.'}</Text>
    </View>
  )
}
