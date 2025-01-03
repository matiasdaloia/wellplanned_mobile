import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import MealRecommendationCard from './meal-recommendation-card'

// TODO: Change type
interface Props {
  recommendationsForSlot: any[]
}

export default function MealRecommendations({ recommendationsForSlot }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {recommendationsForSlot?.map(recommendation => (
        <MealRecommendationCard key={recommendation.id} recommendation={recommendation} />
      ))}
    </ScrollView>
  )
}
