import React, { useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApplication } from '../hooks/useApplication'
import { COLORS } from '../styles/colors'

const STATUS_CONFIG = {
  pending:  { color: COLORS.accent,  label: 'En attente' },
  viewed:   { color: '#7B9CFF',      label: 'Vue'        },
  accepted: { color: '#1D9E75',      label: 'Acceptée'   },
  rejected: { color: '#e05c5c',      label: 'Refusée'    },
}

function CandidatureCard({ app, onWithdraw }) {
  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending

  const handleWithdraw = () => {
    Alert.alert(
      'Retirer la candidature',
      `Voulez-vous retirer votre candidature pour "${app.job?.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Retirer', style: 'destructive', onPress: () => onWithdraw(app.id) },
      ]
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{app.job?.title ?? 'Offre supprimée'}</Text>
          {app.job?.city && <Text style={styles.cardMeta}>📍 {app.job.city}</Text>}
          {app.job?.type && <Text style={styles.cardMeta}>💼 {app.job.type}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: `${cfg.color}22` }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {app.message ? (
        <Text style={styles.message} numberOfLines={2}>"{app.message}"</Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          {new Date(app.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Text>
        {app.status === 'pending' && (
          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>Retirer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default function MesCandidaturesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { myApps, loading, fetchMyApps, withdraw } = useApplication()

  useEffect(() => {
    fetchMyApps()
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes candidatures</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : !myApps?.length ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
          <Text style={styles.emptyText}>Vous n'avez pas encore postulé à une offre.</Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Jobs')}
          >
            <Text style={styles.exploreBtnText}>Explorer les offres →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>{myApps.length} candidature{myApps.length > 1 ? 's' : ''}</Text>
          {myApps.map((app) => (
            <CandidatureCard key={app.id} app={app} onWithdraw={withdraw} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(247,231,206,0.08)',
    backgroundColor: COLORS.primaryMid,
  },
  backBtn:     { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(247,231,206,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { color: COLORS.cream, fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.cream },
  count:       { fontSize: 13, color: COLORS.creamMuted, marginBottom: 12 },
  card: {
    backgroundColor: COLORS.primaryMid, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(247,231,206,0.1)',
    padding: 16, marginBottom: 12,
  },
  cardHeader:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  cardTitle:   { fontSize: 15, fontWeight: '700', color: COLORS.cream, marginBottom: 4 },
  cardMeta:    { fontSize: 12, color: COLORS.creamMuted, marginTop: 2 },
  badge:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText:   { fontSize: 11, fontWeight: '700' },
  message:     { fontSize: 13, color: COLORS.creamMuted, fontStyle: 'italic', marginBottom: 8, lineHeight: 18 },
  cardFooter:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  date:        { fontSize: 11, color: COLORS.creamMuted },
  withdrawBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(224,92,92,0.4)', backgroundColor: 'rgba(224,92,92,0.08)' },
  withdrawText:{ color: '#e05c5c', fontSize: 12, fontWeight: '600' },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText:   { color: COLORS.creamMuted, textAlign: 'center', fontSize: 14, marginBottom: 20 },
  exploreBtn:  { backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  exploreBtnText: { color: COLORS.primary, fontWeight: '700' },
})