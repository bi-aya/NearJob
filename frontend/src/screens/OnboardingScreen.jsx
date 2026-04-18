import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native'
import { styles } from '../styles/onboarding.styles'
import { COLORS } from '../styles/colors'

const { width } = Dimensions.get('window')

const SLIDES = [
  {
    id: '1',
    tag: 'Bienvenue',
    title: 'Trouve du travail\nprès de chez toi',
    subtitle: 'NearJob connecte freelances, recruteurs et stagiaires dans ta zone géographique.',
    icon: 'location',
  },
  {
    id: '2',
    tag: 'Recruteurs',
    title: 'Publie une offre\nen 30 secondes',
    subtitle: 'Job, stage ou mission freelance — les talents autour de toi sont notifiés instantanément.',
    icon: 'job',
  },
  {
    id: '3',
    tag: 'Freelances',
    title: 'Soit visible,\ndécroche des missions',
    subtitle: 'Active ta disponibilité et les recruteurs proches te trouvent en temps réel.',
    icon: 'freelance',
  },
  {
    id: '4',
    tag: 'Prêt ?',
    title: 'Rejoins la\ncommunauté NearJob',
    subtitle: 'Chat intégré, notifications push et profil vérifié — tout pour travailler local.',
    icon: 'check',
  },
]

// ─── Icônes ───────────────────────────────────────────────────────────
function SlideIcon({ type }) {
  if (type === 'location') return (
    <View style={styles.iconWrap}>
      <View style={styles.pinOuter}>
        <View style={styles.pinInner} />
      </View>
      <View style={styles.pinTail} />
      <View style={[styles.wave, { width: 48, height: 48, opacity: 0.15 }]} />
      <View style={[styles.wave, { width: 32, height: 32, opacity: 0.25 }]} />
    </View>
  )
  if (type === 'job') return (
    <View style={styles.iconWrap}>
      <View style={styles.briefcase}>
        <View style={styles.briefcaseHandle} />
        <View style={styles.briefcaseLatch} />
      </View>
    </View>
  )
  if (type === 'freelance') return (
    <View style={styles.iconWrap}>
      <View style={[styles.avatarCircle, { width: 28, height: 28, left: 18, top: 18 }]} />
      <View style={[styles.avatarCircle, { width: 20, height: 20, left: 42, top: 12, opacity: 0.6 }]} />
      <View style={[styles.avatarCircle, { width: 16, height: 16, left: 44, top: 38, opacity: 0.4 }]} />
      <View style={styles.connLine1} />
      <View style={styles.connLine2} />
    </View>
  )
  if (type === 'check') return (
    <View style={styles.iconWrap}>
      <View style={styles.shieldOuter}>
        <View style={styles.checkLeft} />
        <View style={styles.checkRight} />
      </View>
    </View>
  )
  return null
}

function Dot({ active }) {
  return <View style={[styles.dot, active && styles.dotActive]} />
}

function SlideItem({ item }) {
  return (
    <View style={styles.slide}>
      <SlideIcon type={item.icon} />
      <View style={styles.pill}>
        <Text style={styles.pillText}>{item.tag}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  )
}

// ─── Écran principal ──────────────────────────────────────────────────
export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)
  const scrollX = useRef(new Animated.Value(0)).current

  const isLast = currentIndex === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) { navigation.replace('Register'); return }
    const next = currentIndex + 1
    flatListRef.current?.scrollToIndex({ index: next, animated: true })
    setCurrentIndex(next)
  }

  const handleSkip = () => navigation.replace('Login')

  const onMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => <Dot key={i} active={i === currentIndex} />)}
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
          <Text style={styles.btnPrimaryText}>
            {isLast ? 'Créer un compte' : 'Suivant'}
          </Text>
        </TouchableOpacity>

        {isLast && (
          <TouchableOpacity style={styles.btnSecondary} onPress={handleSkip}>
            <Text style={styles.btnSecondaryText}>
              J'ai déjà un compte — Se connecter
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}
