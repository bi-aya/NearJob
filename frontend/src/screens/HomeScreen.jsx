import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Animated, Dimensions, Alert,
} from 'react-native'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useJob } from '../hooks/useJob'
import { useProfile } from '../hooks/useProfile'
import { COLORS } from '../styles/colors'

const { width, height } = Dimensions.get('window')

const TYPE_CONFIG = {
  freelance: { color: COLORS.accent,   label: 'Freelance', icon: '💼' },
  cdi_cdd:   { color: '#4CAF7D',       label: 'CDI/CDD',   icon: '🏢' },
  stage:     { color: '#7B9CFF',       label: 'Stage',     icon: '🎓' },
}

// ─── Calcul distance Haversine (en km) ───────────────────────────────
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Mini carte job au bas de l'écran ────────────────────────────────
function JobPreviewCard({ job, onPress, onClose, userLocation }) {
  const slideAnim = useRef(new Animated.Value(200)).current

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start()
  }, [job?.id])

  if (!job) return null

  const cfg    = TYPE_CONFIG[job.type] ?? TYPE_CONFIG.freelance
  const budget = job.budget
    ? `${Number(job.budget).toLocaleString('fr-FR')} €${
        job.budgetType === 'daily'
          ? '/j'
          : job.budgetType === 'monthly'
          ? '/mois'
          : ''
      }`
    : null

  const distance =
    userLocation && job.latitude && job.longitude
      ? getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          job.latitude,
          job.longitude,
        ).toFixed(1)
      : null

  return (
    <Animated.View style={[styles.previewCard, { transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.previewBadge, { backgroundColor: `${cfg.color}22`, borderColor: `${cfg.color}55` }]}>
        <Text style={{ fontSize: 10 }}>{cfg.icon}</Text>
        <Text style={[styles.previewBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>

      <Text style={styles.previewTitle} numberOfLines={1}>{job.title}</Text>

      <View style={styles.previewMeta}>
        {job.city && (
          <View style={styles.previewMetaItem}>
            <Text style={styles.previewMetaIcon}>📍</Text>
            <Text style={styles.previewMetaText}>{job.city}</Text>
          </View>
        )}
        {budget && (
          <View style={styles.previewMetaItem}>
            <Text style={styles.previewMetaIcon}>💰</Text>
            <Text style={[styles.previewMetaText, { color: COLORS.accent }]}>{budget}</Text>
          </View>
        )}
        {distance && (
          <View style={styles.previewMetaItem}>
            <Text style={styles.previewMetaIcon}>📏</Text>
            <Text style={styles.previewMetaText}>{distance} km</Text>
          </View>
        )}
        {job.recruiter && (
          <View style={styles.previewMetaItem}>
            <Text style={styles.previewMetaIcon}>👤</Text>
            <Text style={styles.previewMetaText}>
              {job.recruiter.firstName} {job.recruiter.lastName}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.previewClose} onPress={onClose}>
          <Text style={styles.previewCloseText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.previewBtn} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.previewBtnText}>Voir les détails  →</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ÉCRAN HOME — CARTE
// ═══════════════════════════════════════════════════════════════════════
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { jobs, loading, fetchJobs } = useJob()
  const { updateLocationData } = useProfile()

  const [selectedJob, setSelectedJob]     = useState(null)
  const [userLocation, setUserLocation]   = useState(null)  // { latitude, longitude }
  const [nearbyMode, setNearbyMode]       = useState(false) // filtre 5km activé
  const [locLoading, setLocLoading]       = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  // ─── Jobs avec coords valides ──────────────────────────────────────
  const mappableJobs = jobs.filter(
    (j) => j.latitude != null && j.longitude != null,
  )

  // ─── Filtrage ≤ 5 km si mode actif ────────────────────────────────
  const displayedJobs =
    nearbyMode && userLocation
      ? mappableJobs.filter(
          (j) =>
            getDistanceKm(
              userLocation.latitude,
              userLocation.longitude,
              j.latitude,
              j.longitude,
            ) <= 5,
        )
      : mappableJobs

  // ─── Bouton géolocalisation ───────────────────────────────────────
  const handleLocateMe = useCallback(async () => {
    setLocLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Autorise l\'accès à ta position dans les paramètres de l\'application.',
        )
        setLocLoading(false)
        return
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const { latitude, longitude } = loc.coords
      setUserLocation({ latitude, longitude })

      // ✅ Enregistrement en backend via hook → action → API
      await updateLocationData(latitude, longitude)

      // Centrer la carte sur la position
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        600,
      )

      // Activer le filtre 5 km
      setNearbyMode(true)

      Alert.alert(
        '📍 Position enregistrée',
        `${displayedJobs.length} offre(s) dans un rayon de 5 km autour de vous.`,
      )
    } catch (err) {
      console.error('Erreur géoloc :', err)
      Alert.alert('Erreur', 'Impossible de récupérer ta position.')
    } finally {
      setLocLoading(false)
    }
  }, [updateLocationData, displayedJobs.length])

  const handleToggleNearby = () => {
    if (!userLocation) {
      handleLocateMe()
    } else {
      setNearbyMode((prev) => !prev)
    }
  }

  const handleMarkerPress = (job) => {
    setSelectedJob(job)
    mapRef.current?.animateToRegion(
      {
        latitude:      job.latitude,
        longitude:     job.longitude,
        latitudeDelta:  0.05,
        longitudeDelta: 0.05,
      },
      400,
    )
  }

  const handleViewDetail = () => {
    if (selectedJob) {
      navigation.navigate('DetailJob', { jobId: selectedJob.id })
    }
  }

  const initialRegion = mappableJobs.length > 0
    ? {
        latitude:      mappableJobs[0].latitude,
        longitude:     mappableJobs[0].longitude,
        latitudeDelta:  2.5,
        longitudeDelta: 2.5,
      }
    : { latitude: 31.7917, longitude: -7.0926, latitudeDelta: 8, longitudeDelta: 8 }

  return (
    <View style={styles.container}>
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
          <View style={[styles.menuLine, { width: 22 }]} />
          <View style={[styles.menuLine, { width: 16 }]} />
          <View style={[styles.menuLine, { width: 22 }]} />
        </TouchableOpacity>
        <View>
          <Text style={styles.topTitle}>NearJob</Text>
          <Text style={styles.topSub}>
            {nearbyMode
              ? `${displayedJobs.length} offre${displayedJobs.length !== 1 ? 's' : ''} dans 5 km`
              : `${displayedJobs.length} offre${displayedJobs.length !== 1 ? 's' : ''} disponibles`
            }
          </Text>
        </View>
        <View style={styles.topRight}>
          {loading && <ActivityIndicator color={COLORS.accent} size="small" />}
        </View>
      </View>

      {/* ── Map ──────────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        onPress={() => setSelectedJob(null)}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Cercle 5 km autour de l'utilisateur */}
        {nearbyMode && userLocation && (
          <Circle
            center={userLocation}
            radius={5000}
            fillColor="rgba(232,168,56,0.08)"
            strokeColor="rgba(232,168,56,0.4)"
            strokeWidth={1.5}
          />
        )}

        {displayedJobs.map((job) => {
          const cfg      = TYPE_CONFIG[job.type] ?? TYPE_CONFIG.freelance
          const isActive = selectedJob?.id === job.id

          return (
            <Marker
              key={job.id}
              coordinate={{ latitude: job.latitude, longitude: job.longitude }}
              onPress={() => handleMarkerPress(job)}
            >
              <View style={[
                styles.markerWrap,
                { backgroundColor: cfg.color, transform: [{ scale: isActive ? 1.2 : 1 }] },
              ]}>
                <Text style={styles.markerIcon}>{cfg.icon}</Text>
              </View>
              <View style={[styles.markerTail, { borderTopColor: cfg.color }]} />
            </Marker>
          )
        })}
      </MapView>

      {/* ── Bouton « Près de moi » ────────────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.nearbyBtn,
          { top: insets.top + 80 },
          nearbyMode && styles.nearbyBtnActive,
        ]}
        onPress={handleToggleNearby}
        disabled={locLoading}
        activeOpacity={0.85}
      >
        {locLoading
          ? <ActivityIndicator color={nearbyMode ? COLORS.primary : COLORS.accent} size="small" />
          : (
            <>
              <Text style={styles.nearbyBtnIcon}>📍</Text>
              <Text style={[styles.nearbyBtnText, nearbyMode && styles.nearbyBtnTextActive]}>
                {nearbyMode ? 'Rayon 5 km ✓' : 'Près de moi'}
              </Text>
            </>
          )
        }
      </TouchableOpacity>

      {/* ── Légende ──────────────────────────────────────────────────── */}
      <View style={[styles.legend, { bottom: selectedJob ? 220 : 24 + insets.bottom }]}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: cfg.color }]} />
            <Text style={styles.legendText}>{cfg.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Preview card ─────────────────────────────────────────────── */}
      {selectedJob && (
        <View style={[styles.previewWrap, { paddingBottom: insets.bottom + 8 }]}>
          <JobPreviewCard
            job={selectedJob}
            userLocation={userLocation}
            onPress={handleViewDetail}
            onClose={() => setSelectedJob(null)}
          />
        </View>
      )}
    </View>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },

  // Top bar
  topBar: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    zIndex:          10,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: 16,
    paddingBottom:   12,
    backgroundColor: 'rgba(16,44,38,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247,231,206,0.08)',
  },
  menuBtn:  { gap: 4, padding: 4 },
  menuLine: { height: 2, backgroundColor: COLORS.cream, borderRadius: 2 },
  topTitle: { fontSize: 18, fontWeight: '800', color: COLORS.cream },
  topSub:   { fontSize: 12, color: COLORS.creamMuted },
  topRight: { width: 40, alignItems: 'center' },

  // Bouton "Près de moi"
  nearbyBtn: {
    position:        'absolute',
    left:            16,
    zIndex:          10,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    backgroundColor: 'rgba(16,44,38,0.92)',
    borderRadius:    20,
    paddingHorizontal: 14,
    paddingVertical:   9,
    borderWidth:     1,
    borderColor:     'rgba(232,168,56,0.35)',
  },
  nearbyBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor:     COLORS.accent,
  },
  nearbyBtnIcon:     { fontSize: 14 },
  nearbyBtnText:     { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
  nearbyBtnTextActive: { color: COLORS.primary },

  // Markers
  markerWrap: {
    width:         36,
    height:        36,
    borderRadius:  18,
    alignItems:    'center',
    justifyContent:'center',
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius:  4,
    elevation:     6,
  },
  markerIcon: { fontSize: 18 },
  markerTail: {
    width:            0,
    height:           0,
    alignSelf:        'center',
    borderLeftWidth:  6,
    borderRightWidth: 6,
    borderTopWidth:   8,
    borderLeftColor:  'transparent',
    borderRightColor: 'transparent',
    marginTop:        -1,
  },

  // Légende
  legend: {
    position:        'absolute',
    right:           12,
    flexDirection:   'column',
    gap:             6,
    backgroundColor: 'rgba(16,44,38,0.88)',
    borderRadius:    10,
    padding:         10,
    borderWidth:     1,
    borderColor:     'rgba(247,231,206,0.1)',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: COLORS.cream, fontWeight: '500' },

  // Preview card
  previewWrap: {
    position:   'absolute',
    bottom:     0,
    left:       0,
    right:      0,
    paddingHorizontal: 12,
  },
  previewCard: {
    backgroundColor: COLORS.primaryMid,
    borderRadius:    20,
    padding:         18,
    borderWidth:     1,
    borderColor:     'rgba(247,231,206,0.12)',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: -4 },
    shadowOpacity:   0.4,
    shadowRadius:    12,
    elevation:       10,
  },
  previewBadge: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            4,
    alignSelf:      'flex-start',
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:   8,
    borderWidth:    1,
    marginBottom:   8,
  },
  previewBadgeText: { fontSize: 11, fontWeight: '700' },
  previewTitle: {
    fontSize:    18,
    fontWeight:  '800',
    color:       COLORS.cream,
    marginBottom: 10,
  },
  previewMeta:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  previewMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewMetaIcon: { fontSize: 12 },
  previewMetaText: { fontSize: 12, color: COLORS.creamMuted, fontWeight: '500' },
  previewActions:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewClose: {
    width:          40,
    height:         40,
    borderRadius:   12,
    borderWidth:    1,
    borderColor:    'rgba(247,231,206,0.15)',
    alignItems:     'center',
    justifyContent: 'center',
  },
  previewCloseText: { color: COLORS.creamMuted, fontSize: 14 },
  previewBtn: {
    flex:           1,
    backgroundColor: COLORS.accent,
    borderRadius:   12,
    paddingVertical: 12,
    alignItems:     'center',
  },
  previewBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
})

// ─── Google Maps style sombre ─────────────────────────────────────────
const darkMapStyle = [
  { elementType: 'geometry',             stylers: [{ color: '#0d2420' }] },
  { elementType: 'labels.text.fill',     stylers: [{ color: '#F7E7CE' }] },
  { elementType: 'labels.text.stroke',   stylers: [{ color: '#102C26' }] },
  { featureType: 'road',        elementType: 'geometry',           stylers: [{ color: '#1a3d35' }] },
  { featureType: 'road',        elementType: 'geometry.stroke',    stylers: [{ color: '#102C26' }] },
  { featureType: 'road.highway',elementType: 'geometry',           stylers: [{ color: '#1f4e42' }] },
  { featureType: 'water',       elementType: 'geometry',           stylers: [{ color: '#071a17' }] },
  { featureType: 'poi',         elementType: 'geometry',           stylers: [{ color: '#0f2e29' }] },
  { featureType: 'poi',         elementType: 'labels.text.fill',   stylers: [{ color: '#E8A838' }] },
  { featureType: 'transit',     elementType: 'geometry',           stylers: [{ color: '#0d2420' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#E8A838' }] },
]