import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { COLORS } from '../styles/colors'
import { useAuth } from '../hooks/useAuth'

import AuthStack from './AuthStack'
import AppStack from './AppStack'

export default function RootNavigator() {
  const { user, isRestoring, restoreSession } = useAuth()

  useEffect(() => {
    restoreSession() 
  }, [])

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    )
  }

  return user ? <AppStack /> : <AuthStack />
}