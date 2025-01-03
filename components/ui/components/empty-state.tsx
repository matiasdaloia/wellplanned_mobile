import LottieView from 'lottie-react-native'
import React from 'react'
import { Text, View } from 'react-native'

import { Button } from './button'

interface EmptyStateProps {
  title: string
  subtitle?: string
  type: 'success' | 'error'
  onPressButton?: () => void
  buttonLabel?: string
}

export default function EmptyState({
  title,
  subtitle,
  type,
  onPressButton,
  buttonLabel
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-20 h-20">
        <LottieView
          source={
            type === 'success'
              ? require('../../../assets/animations/success.json')
              : require('../../../assets/animations/error.json')
          }
          style={{
            flex: 1
          }}
          autoPlay
          loop
        />
      </View>
      <Text className="font-bodyBold text-xl">{title}</Text>
      {subtitle && <Text className="font-body text-[#71717A]">{subtitle}</Text>}
      {buttonLabel && onPressButton && <Button label={buttonLabel} onPress={onPressButton} />}
    </View>
  )
}
