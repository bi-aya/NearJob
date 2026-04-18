import React, { useEffect, useState, useRef } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated, Linking, Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getJobByIdApi } from '../apis/jobApi'
import { COLORS } from '../styles/colors'
import { useApplication } from '../hooks/useApplication'
// ─── Config ───────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  freelance: { color: COLORS.accent, label: 'Freelance', icon: '💼' },
  cdi_cdd:   { color: '#4CAF7D',     label: 'CDI / CDD',  icon: '🏢' },
  stage:     { color: '#7B9CFF',     label: 'Stage',      icon: '🎓' },
}
const STATUS_CONFIG = {
  active: { color: '#1D9E75', label: 'Active'     },
  draft:  { color: COLORS.accent, label: 'Brouillon' },
  closed: { color: '#e05c5c', label: 'Fermée'     },
}
const BUDGET_LABEL = { fixed: 'Budget fixe', daily: '/ jour', monthly: '/ mois' }

const TABS = [
  { key: 'info',      label: 'Description', icon: '📄' },
  { key: 'recruiter', label: 'Recruteur',   icon: '👤' },
  { key: 'apply',     label: 'Postuler',    icon: '🚀' },
]

// ─── Tab Description ──────────────────────────────────────────────────
function InfoTab({ job }) {
  const cfg    = TYPE_CONFIG[job.type]   ?? TYPE_CONFIG.freelance
  const stCfg  = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.active
  const budget = job.budget
    ? `${Number(job.budget).toLocaleString('fr-FR')} €  ${BUDGET_LABEL[job.budgetType] ?? ''}`
    : null

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Statut */}
      <View style={styles.row}>
        <View style={[styles.chip, { backgroundColor: `${stCfg.color}22`, borderColor: `${stCfg.color}55` }]}>
          <View style={[styles.chipDot, { backgroundColor: stCfg.color }]} />
          <Text style={[styles.chipText, { color: stCfg.color }]}>{stCfg.label}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: `${cfg.color}22`, borderColor: `${cfg.color}55` }]}>
          <Text style={{ fontSize: 11 }}>{cfg.icon}</Text>
          <Text style={[styles.chipText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Infos clés */}
      <View style={styles.infoGrid}>
        {job.category && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>🏷️</Text>
            <Text style={styles.infoBoxLabel}>Catégorie</Text>
            <Text style={styles.infoBoxValue}>{job.category}</Text>
          </View>
        )}
        {job.city && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>📍</Text>
            <Text style={styles.infoBoxLabel}>Ville</Text>
            <Text style={styles.infoBoxValue}>{job.city}</Text>
          </View>
        )}
        {budget && (
          <View style={[styles.infoBox, { borderColor: `${COLORS.accent}33` }]}>
            <Text style={styles.infoBoxIcon}>💰</Text>
            <Text style={styles.infoBoxLabel}>Rémunération</Text>
            <Text style={[styles.infoBoxValue, { color: COLORS.accent }]}>{budget}</Text>
          </View>
        )}
        {job.createdAt && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxIcon}>📅</Text>
            <Text style={styles.infoBoxLabel}>Publié le</Text>
            <Text style={styles.infoBoxValue}>
              {new Date(job.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description du poste</Text>
        <Text style={styles.descText}>{job.description}</Text>
      </View>
    </ScrollView>
  )
}

// ─── Tab Recruteur ────────────────────────────────────────────────────
function RecruiterTab({ job }) {
  const r = job.recruiter
  if (!r) {
    return (
      <View style={styles.emptyTab}>
        <Text style={styles.emptyIcon}>🏢</Text>
        <Text style={styles.emptyText}>Informations du recruteur non disponibles</Text>
      </View>
    )
  }
  const initials = `${r.firstName?.[0] ?? ''}${r.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.recruiterHero}>
        <View style={styles.recruiterAvatar}>
          <Text style={styles.recruiterInitials}>{initials}</Text>
        </View>
        <Text style={styles.recruiterName}>{r.firstName} {r.lastName}</Text>
        <View style={styles.recruiterBadge}>
          <Text style={styles.recruiterBadgeText}>🏢  Recruteur</Text>
        </View>
      </View>

      {/* Infos recruteur */}
      <View style={styles.recruiterInfoCard}>
        {r.email && (
          <TouchableOpacity
            style={styles.recruiterInfoRow}
            onPress={() => Linking.openURL(`mailto:${r.email}`)}
          >
            <Text style={styles.recruiterInfoIcon}>✉️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.recruiterInfoLabel}>Email</Text>
              <Text style={[styles.recruiterInfoValue, { color: COLORS.accent }]}>{r.email}</Text>
            </View>
            <Text style={{ color: COLORS.creamMuted, fontSize: 12 }}>→</Text>
          </TouchableOpacity>
        )}
        {r.phone && (
          <TouchableOpacity
            style={[styles.recruiterInfoRow, { borderBottomWidth: 0 }]}
            onPress={() => Linking.openURL(`tel:${r.phone}`)}
          >
            <Text style={styles.recruiterInfoIcon}>📞</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.recruiterInfoLabel}>Téléphone</Text>
              <Text style={[styles.recruiterInfoValue, { color: COLORS.accent }]}>{r.phone}</Text>
            </View>
            <Text style={{ color: COLORS.creamMuted, fontSize: 12 }}>→</Text>
          </TouchableOpacity>
        )}
        {!r.email && !r.phone && (
          <View style={[styles.recruiterInfoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.recruiterInfoIcon}>ℹ️</Text>
            <Text style={styles.recruiterInfoValue}>Aucun contact disponible</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

// ─── Tab Postuler ─────────────────────────────────────────────────────
function ApplyTab({ job, navigation }) {
  const { apply, loading } = useApplication()
  const isClosed = job.status === 'closed'

  const handleApply = () => {
    if (isClosed) {
      Alert.alert('Offre fermée', 'Cette offre n\'est plus disponible.')
      return
    }

    Alert.alert(
      'Postuler',
      `Voulez-vous postuler à "${job.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            const res = await apply(job.id, '')

            if (res.success) {
              Alert.alert('Succès', 'Votre candidature a été envoyée 🚀')
              navigation.goBack()
            } else {
              Alert.alert('Erreur', res.message)
            }
          },
        },
      ],
    )
  }

  return (
    
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Résumé rapide */}
      <View style={styles.applySummary}>
        <Text style={styles.applySummaryTitle}>{job.title}</Text>
        {job.city && <Text style={styles.applySummaryMeta}>📍 {job.city}</Text>}
        {job.budget && (
          <Text style={[styles.applySummaryMeta, { color: COLORS.accent }]}>
            💰 {Number(job.budget).toLocaleString('fr-FR')} €
          </Text>
        )}
      </View>

      {/* Checklist */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avant de postuler</Text>
        {[
          'Votre profil est à jour',
          'Vos compétences correspondent au poste',
          'Vous êtes disponible pour ce type de contrat',
        ].map((item, i) => (
          <View key={i} style={styles.checkItem}>
            <View style={styles.checkDot} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Bouton */}
      <TouchableOpacity
        style={[styles.applyBtn, isClosed && styles.applyBtnDisabled]}
        onPress={handleApply}
        activeOpacity={0.85}
      >
        <Text style={styles.applyBtnText}>
          {isClosed ? '🔒  Offre fermée' : '🚀  Postuler maintenant'}
        </Text>
      </TouchableOpacity>

      {/* Contact direct */}
      {job.recruiter?.email && !isClosed && (
        <TouchableOpacity
          style={styles.applyContact}
          onPress={() => Linking.openURL(`mailto:${job.recruiter.email}?subject=Candidature: ${job.title}`)}
        >
          <Text style={styles.applyContactText}>✉️  Contacter le recruteur directement</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}
// ═══════════════════════════════════════════════════════════════════════
// ÉCRAN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════
export default function DetailJobScreen({ route, navigation }) {
  const { jobId } = route.params
  const insets    = useSafeAreaInsets()
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const indicatorAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getJobByIdApi(jobId)
        setJob(res.data)
      } catch (e) {
        setError('Impossible de charger cette offre.')
      } finally {
        setLoading(false)
      }
    })()
  }, [jobId])

  const handleTabPress = (i) => {
    setActiveTab(i)
    Animated.spring(indicatorAnim, {
      toValue:        i,
      useNativeDriver: false,
      tension:         80,
      friction:        10,
    }).start()
  }

  const TAB_W = (TABS.length > 0) ? 100 / TABS.length : 33.33

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={COLORS.accent} size="large" />
        <Text style={styles.loadingText}>Chargement de l'offre…</Text>
      </View>
    )
  }

  if (error || !job) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
        <Text style={styles.errorText}>{error ?? 'Offre introuvable'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const cfg = TYPE_CONFIG[job.type] ?? TYPE_CONFIG.freelance

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn2} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{job.title}</Text>
          {job.city && <Text style={styles.headerSub}>📍 {job.city}</Text>}
        </View>
        <View style={[styles.headerBadge, { backgroundColor: `${cfg.color}22` }]}>
          <Text style={{ fontSize: 14 }}>{cfg.icon}</Text>
        </View>
      </View>

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(i)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14 }}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Indicateur animé */}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: `${TAB_W}%`,
              left:  indicatorAnim.interpolate({
                inputRange:  TABS.map((_, i) => i),
                outputRange: TABS.map((_, i) => `${i * TAB_W}%`),
              }),
            },
          ]}
        />
      </View>

      {/* ── Contenu ───────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {activeTab === 0 && <InfoTab job={job} />}
        {activeTab === 1 && <RecruiterTab job={job} />}
        {activeTab === 2 && <ApplyTab job={job} navigation={navigation} />}
      </View>

    </View>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: COLORS.primary },
  centered: {
    flex: 1, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  loadingText: { color: COLORS.creamMuted, marginTop: 12, fontSize: 14 },
  errorText:   { color: COLORS.cream, fontSize: 16, textAlign: 'center', marginHorizontal: 32, marginBottom: 24 },

  // Header
  header: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247,231,206,0.08)',
    backgroundColor:   COLORS.primaryMid,
  },
  backBtn2: {
    width:  40, height: 40, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(247,231,206,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { color: COLORS.cream, fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.cream },
  headerSub:   { fontSize: 12, color: COLORS.creamMuted, marginTop: 2 },
  headerBadge: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  // Tabs
  tabBar: {
    flexDirection:   'row',
    backgroundColor: COLORS.primaryMid,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247,231,206,0.08)',
    position:        'relative',
  },
  tabItem: {
    flex:           1,
    paddingVertical: 12,
    alignItems:     'center',
    gap:            4,
  },
  tabLabel: {
    fontSize:   11,
    fontWeight: '600',
    color:      COLORS.creamMuted,
  },
  tabLabelActive: { color: COLORS.accent },
  tabIndicator: {
    position:        'absolute',
    bottom:          0,
    height:          2,
    backgroundColor: COLORS.accent,
    borderRadius:    2,
  },

  // Tab content
  tabContent: { padding: 16, paddingBottom: 40 },

  // Chips
  row:     { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius:    8,
    borderWidth:     1,
  },
  chipDot:  { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, fontWeight: '700' },

  // Info grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
    marginBottom:  20,
  },
  infoBox: {
    flex:          1,
    minWidth:      '45%',
    backgroundColor: 'rgba(247,231,206,0.04)',
    borderRadius:  12,
    borderWidth:   1,
    borderColor:   'rgba(247,231,206,0.1)',
    padding:       12,
    alignItems:    'flex-start',
  },
  infoBoxIcon:  { fontSize: 18, marginBottom: 6 },
  infoBoxLabel: { fontSize: 10, color: COLORS.creamMuted, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  infoBoxValue: { fontSize: 13, color: COLORS.cream, fontWeight: '700' },

  // Section
  section:      { marginBottom: 20 },
  sectionTitle: {
    fontSize:     13,
    fontWeight:   '800',
    color:        COLORS.accent,
    textTransform:'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  descText: {
    fontSize:   14,
    color:      COLORS.cream,
    lineHeight: 22,
    opacity:    0.85,
  },

  // Recruiter tab
  recruiterHero: {
    alignItems:    'center',
    paddingVertical: 24,
    marginBottom:  20,
  },
  recruiterAvatar: {
    width:  80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.accentMuted,
    borderWidth: 2, borderColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  recruiterInitials: { fontSize: 28, fontWeight: '800', color: COLORS.accent },
  recruiterName:     { fontSize: 20, fontWeight: '800', color: COLORS.cream, marginBottom: 8 },
  recruiterBadge: {
    backgroundColor:  'rgba(232,168,56,0.15)',
    borderRadius:     8,
    paddingHorizontal: 12,
    paddingVertical:   5,
  },
  recruiterBadgeText: { color: COLORS.accent, fontWeight: '700', fontSize: 12 },
  recruiterInfoCard: {
    backgroundColor: 'rgba(247,231,206,0.04)',
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     'rgba(247,231,206,0.1)',
    overflow:        'hidden',
  },
  recruiterInfoRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            12,
    padding:        16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247,231,206,0.06)',
  },
  recruiterInfoIcon:  { fontSize: 20 },
  recruiterInfoLabel: { fontSize: 10, color: COLORS.creamMuted, fontWeight: '600', textTransform: 'uppercase' },
  recruiterInfoValue: { fontSize: 14, color: COLORS.cream, fontWeight: '600', marginTop: 2 },

  // Apply tab
  applySummary: {
    backgroundColor: 'rgba(232,168,56,0.07)',
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     'rgba(232,168,56,0.2)',
    padding:         18,
    marginBottom:    24,
  },
  applySummaryTitle: { fontSize: 18, fontWeight: '800', color: COLORS.cream, marginBottom: 8 },
  applySummaryMeta:  { fontSize: 13, color: COLORS.creamMuted, marginTop: 4 },
  checkItem: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
    marginBottom:  10,
  },
  checkDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  checkText: { fontSize: 13, color: COLORS.cream, flex: 1, lineHeight: 18 },
  applyBtn: {
    backgroundColor: COLORS.accent,
    borderRadius:    16,
    paddingVertical: 16,
    alignItems:      'center',
    marginTop:       24,
    marginBottom:    12,
  },
  applyBtnDisabled: { backgroundColor: '#444', opacity: 0.6 },
  applyBtnText:     { color: COLORS.primary, fontWeight: '900', fontSize: 15 },
  applyContact: {
    borderWidth:     1,
    borderColor:     'rgba(232,168,56,0.3)',
    borderRadius:    12,
    paddingVertical: 13,
    alignItems:      'center',
  },
  applyContactText: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },

  // Empty state
  emptyTab: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: COLORS.creamMuted, textAlign: 'center', fontSize: 14, lineHeight: 20 },

  // Back btn (error state)
  backBtn: {
    backgroundColor: COLORS.accent,
    borderRadius:    12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
})