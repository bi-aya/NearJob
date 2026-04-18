import 'react-native-gesture-handler'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { store } from './src/Redux/store'
import RootNavigator from './src/navigation/RootNavigator'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from './Notification/notification'

// ── Composant interne pour accéder au store ───────────────────────────
function AppContent() {
  const notifListener = useRef()
  const responseListener = useRef()
  const user = useSelector(state => state.auth.user) // écoute l'état auth

  useEffect(() => {
    // Enregistrer le push token seulement quand l'utilisateur est connecté
    if (user) {
      registerForPushNotificationsAsync(user.id).then(token => {
        if (token) console.log('Token enregistré:', token)
      })
    }
  }, [user]) // se déclenche à chaque changement de user

  useEffect(() => {
    notifListener.current =
      Notifications.addNotificationReceivedListener(notif => {
        console.log('Notif reçue:', notif)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(resp => {
        console.log('Notif tappée:', resp)
      })

    return () => {
      notifListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  )
}

// ── Composant principal ───────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}