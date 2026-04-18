import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { COLORS } from '../styles/colors'
import MesOffresScreen            from '../screens/MesOffresScreen'
import GestionCandidaturesScreen  from '../screens/GestionCandidaturesScreen'
import ProfileScreen          from '../screens/ProfileScreen'
import HomeScreen             from '../screens/HomeScreen'
import EditProfileScreen      from '../screens/EditProfileScreen'
import PublishJobScreen       from '../screens/PublishJobScreen'
import DetailJobScreen        from '../screens/DetailjobScreen'
import MesCandidaturesScreen  from '../screens/MesCandidaturesScreen'

const Drawer = createDrawerNavigator()
const Tab    = createBottomTabNavigator()
const Stack  = createNativeStackNavigator()

function NotifScreen() {
  return <View style={s.ph}><Text style={s.phText}>Notifications à venir 🔔</Text></View>
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMap"   component={HomeScreen} />
      <Stack.Screen name="DetailJob" component={DetailJobScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain"       component={ProfileScreen} />
      <Stack.Screen name="EditProfile"       component={EditProfileScreen} />
      <Stack.Screen name="PublishJob"        component={PublishJobScreen} />
      <Stack.Screen name="MesCandidatures"   component={MesCandidaturesScreen} />
      <Stack.Screen name="MesOffres"             component={MesOffresScreen} />
      <Stack.Screen name="GestionCandidatures"   component={GestionCandidaturesScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:  COLORS.primary,
          borderTopColor:   'rgba(247,231,206,0.1)',
          borderTopWidth:   1,
          height:           60,
          paddingBottom:    8,
        },
        tabBarActiveTintColor:   COLORS.accent,
        tabBarInactiveTintColor: COLORS.creamMuted,
        tabBarLabelStyle:        { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={s.tabIcon}>👤</Text> }}
      />
      <Tab.Screen
        name="Jobs"
        component={HomeStack}
        options={{ tabBarLabel: 'Jobs', tabBarIcon: () => <Text style={s.tabIcon}>📍</Text> }}
      />
      <Tab.Screen
        name="Notifs"
        component={NotifScreen}
        options={{ tabBarLabel: 'Notifs', tabBarIcon: () => <Text style={s.tabIcon}>🔔</Text> }}
      />
    </Tab.Navigator>
  )
}

function CustomDrawer({ navigation }) {
  const { user }   = useSelector((state) => state.auth)
  const { logout } = useAuth()

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'NJ'

  const isFreelance = user?.role === 'freelance'

  const items = isFreelance
    ? [
        { label: 'Mon profil',       icon: '👤', screen: 'ProfileMain'      },
        { label: 'Mes candidatures', icon: '📋', screen: 'MesCandidatures'  },
      ]
    : [
        { label: 'Mon profil',        icon: '👤', screen: 'ProfileMain'           },
        { label: 'Mes offres',        icon: '📋', screen: 'MesOffres'             },
        { label: 'Candidatures',      icon: '👥', screen: 'GestionCandidatures'   },
      ]

  return (
    <DrawerContentScrollView style={s.drawer} contentContainerStyle={{ flex: 1 }}>
      <View style={s.drawerHeader}>
        <View style={s.drawerAvatar}>
          <Text style={s.drawerInitials}>{initials}</Text>
        </View>
        <Text style={s.drawerName}>
          {user ? `${user.firstName} ${user.lastName}` : 'Mon compte'}
        </Text>
        <Text style={s.drawerRole}>
          {isFreelance ? 'Freelance' : 'Recruteur'}
        </Text>
      </View>

      <View style={s.drawerItems}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={s.drawerItem}
            onPress={() => {
              navigation.closeDrawer()
              navigation.navigate('Main', {
                screen: 'Profil',
                params: { screen: item.screen }
              })
            }}
          >
            <Text style={s.drawerItemIcon}>{item.icon}</Text>
            <Text style={s.drawerItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutIcon}>🚪</Text>
        <Text style={s.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  )
}

export default function AppStack() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown:    false,
        drawerStyle:    { backgroundColor: COLORS.primaryMid, width: 280 },
        overlayColor:   'rgba(0,0,0,0.5)',
        swipeEdgeWidth: 40,
      }}
    >
      <Drawer.Screen name="Main" component={MainTabs} />
    </Drawer.Navigator>
  )
}

const s = StyleSheet.create({
  ph:      { flex: 1, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  phText:  { color: COLORS.cream, fontSize: 18 },
  tabIcon: { fontSize: 18 },
  drawer:  { backgroundColor: COLORS.primaryMid, flex: 1 },
  drawerHeader: {
    alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(247,231,206,0.08)', marginBottom: 8,
  },
  drawerAvatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.accentMuted, borderWidth: 2, borderColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  drawerInitials: { fontSize: 24, fontWeight: '700', color: COLORS.accent },
  drawerName:     { fontSize: 16, fontWeight: '700', color: COLORS.cream, marginBottom: 4 },
  drawerRole:     { fontSize: 13, color: COLORS.creamMuted },
  drawerItems:    { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4,
  },
  drawerItemIcon: { fontSize: 18 },
  drawerItemText: { fontSize: 15, color: COLORS.cream, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    margin: 16, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(224,92,92,0.3)',
    backgroundColor: 'rgba(224,92,92,0.08)',
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { color: '#e05c5c', fontSize: 14, fontWeight: '600' },
})