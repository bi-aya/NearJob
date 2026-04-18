import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet, Modal, Linking
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApplication } from '../hooks/useApplication'
import { COLORS } from '../styles/colors'

const STATUS_CONFIG = {
  pending:  { color: COLORS.accent, label: 'En attente' },
  viewed:   { color: '#7B9CFF',     label: 'Vue'        },
  accepted: { color: '#1D9E75',     label: 'Acceptée'   },
  rejected: { color: '#e05c5c',     label: 'Refusée'    },
}

// ─── Modal profil candidat ────────────────────────────────────────────
function CandidatModal({ app, onClose, onAccept, onReject }) {
  const c = app.applicant
  if (!c) return null
  const initials = `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Profil du candidat</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: COLORS.creamMuted, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar */}
            <View style={styles.candidatHero}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.candidatName}>{c.firstName} {c.lastName}</Text>
              {c.category && <Text style={styles.candidatRole}>{c.category} · Freelance</Text>}
              {c.city && <Text style={styles.candidatCity}>📍 {c.city}</Text>}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {c.dailyRate && (
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{Number(c.dailyRate).toLocaleString('fr-FR')} €</Text>
                  <Text style={styles.statLabel}>Tarif/jour</Text>
                </View>
              )}
              {c.competences?.length > 0 && (
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{c.competences.length}</Text>
                  <Text style={styles.statLabel}>Compétences</Text>
                </View>
              )}
              {c.reviewCount > 0 && (
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{c.reviewCount}</Text>
                  <Text style={styles.statLabel}>Avis reçus</Text>
                </View>
              )}
            </View>

            {/* Bio */}
            {c.bio ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>À PROPOS</Text>
                <Text style={styles.bioText}>{c.bio}</Text>
              </View>
            ) : null}

            {/* Compétences */}
            {c.competences?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>COMPÉTENCES</Text>
                <View style={styles.skillsWrap}>
                  {c.competences.map((s, i) => (
                    <View key={i} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>
                        {typeof s === 'object' ? s.name : s}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Expériences */}
            {c.experiences?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EXPÉRIENCES</Text>
                {c.experiences.map((xp) => (
                  <View key={xp.id} style={styles.xpItem}>
                    <Text style={styles.xpTitle}>{xp.title}</Text>
                    <Text style={styles.xpCompany}>{xp.company}</Text>
                    <Text style={styles.xpDate}>{xp.startDate} — {xp.endDate ?? 'Présent'}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Message de candidature */}
            {app.message && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>MESSAGE</Text>
                <Text style={styles.bioText}>"{app.message}"</Text>
              </View>
            )}

            {/* Contact */}
            {c.email && (
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => Linking.openURL(`mailto:${c.email}`)}
              >
                <Text style={styles.contactBtnText}>✉️  Contacter par email</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Actions */}
          {app.status === 'pending' || app.status === 'viewed' ? (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => { onReject(app.id); onClose() }}>
                <Text style={styles.rejectBtnText}>✕  Refuser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => { onAccept(app.id); onClose() }}>
                <Text style={styles.acceptBtnText}>✓  Accepter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.statusBanner, { backgroundColor: `${STATUS_CONFIG[app.status].color}22` }]}>
              <Text style={[styles.statusBannerText, { color: STATUS_CONFIG[app.status].color }]}>
                Candidature {STATUS_CONFIG[app.status].label.toLowerCase()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

// ─── Card candidature ─────────────────────────────────────────────────
function CandidatureCard({ app, onPress }) {
  const cfg      = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending
  const c        = app.applicant
  const initials = c ? `${c.firstName?.[0] ?? ''}${c.lastName?.[0] ?? ''}`.toUpperCase() : '?'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <View style={styles.miniAvatar}>
          <Text style={styles.miniAvatarText}>{initials}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{c?.firstName} {c?.lastName}</Text>
        <Text style={styles.cardJob} numberOfLines={1}>
          Pour : {app.job?.title ?? 'Offre supprimée'}
        </Text>
        {c?.category && <Text style={styles.cardMeta}>{c.category}</Text>}
        {app.message && (
          <Text style={styles.cardMessage} numberOfLines={1}>"{app.message}"</Text>
        )}
      </View>
      <View style={[styles.badge, { backgroundColor: `${cfg.color}22` }]}>
        <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </TouchableOpacity>
  )
}

// ─── Écran principal ──────────────────────────────────────────────────
export default function GestionCandidaturesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { receivedApps, loading, fetchReceivedApplications, updateStatus } = useApplication()
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchReceivedApplications() }, [])

  const handleAccept = (id) => updateStatus(id, 'accepted')
  const handleReject = (id) => updateStatus(id, 'rejected')

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidatures reçues</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : !receivedApps?.length ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
          <Text style={styles.emptyText}>Aucune candidature reçue pour l'instant.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>{receivedApps.length} candidature{receivedApps.length > 1 ? 's' : ''}</Text>
          {receivedApps.map((app) => (
            <CandidatureCard key={app.id} app={app} onPress={() => setSelected(app)} />
          ))}
        </ScrollView>
      )}

      {selected && (
        <CandidatModal
          app={selected}
          onClose={() => setSelected(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
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
  backBtn:      { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(247,231,206,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow:    { color: COLORS.cream, fontSize: 18, fontWeight: '700' },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: COLORS.cream },
  count:        { fontSize: 13, color: COLORS.creamMuted, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primaryMid, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(247,231,206,0.1)',
    padding: 14, marginBottom: 10,
  },
  cardLeft:       { justifyContent: 'center' },
  cardName:       { fontSize: 14, fontWeight: '700', color: COLORS.cream, marginBottom: 2 },
  cardJob:        { fontSize: 12, color: COLORS.creamMuted },
  cardMeta:       { fontSize: 11, color: COLORS.creamMuted, marginTop: 2 },
  cardMessage:    { fontSize: 12, color: COLORS.creamMuted, fontStyle: 'italic', marginTop: 4 },
  badge:          { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText:      { fontSize: 10, fontWeight: '700' },
  miniAvatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accentMuted, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText:      { color: COLORS.creamMuted, textAlign: 'center', fontSize: 14 },
  // Modal
  modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard:     { backgroundColor: COLORS.primaryMid, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:    { fontSize: 18, fontWeight: '800', color: COLORS.cream },
  candidatHero:  { alignItems: 'center', marginBottom: 20 },
  avatar:        { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.accentMuted, borderWidth: 2, borderColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:    { fontSize: 26, fontWeight: '800', color: COLORS.accent },
  candidatName:  { fontSize: 20, fontWeight: '800', color: COLORS.cream, marginBottom: 4 },
  candidatRole:  { fontSize: 13, color: COLORS.creamMuted, marginBottom: 4 },
  candidatCity:  { fontSize: 12, color: COLORS.creamMuted },
  statsRow:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox:       { flex: 1, backgroundColor: 'rgba(247,231,206,0.04)', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(247,231,206,0.08)' },
  statValue:     { fontSize: 16, fontWeight: '800', color: COLORS.accent },
  statLabel:     { fontSize: 10, color: COLORS.creamMuted, marginTop: 2 },
  section:       { marginBottom: 16 },
  sectionTitle:  { fontSize: 11, fontWeight: '800', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  bioText:       { fontSize: 13, color: COLORS.cream, lineHeight: 20, opacity: 0.85 },
  skillsWrap:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill:     { backgroundColor: 'rgba(232,168,56,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(232,168,56,0.25)' },
  skillPillText: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  xpItem:        { backgroundColor: 'rgba(247,231,206,0.04)', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(247,231,206,0.08)' },
  xpTitle:       { fontSize: 13, fontWeight: '700', color: COLORS.cream },
  xpCompany:     { fontSize: 12, color: COLORS.creamMuted, marginTop: 2 },
  xpDate:        { fontSize: 11, color: COLORS.creamMuted, marginTop: 2 },
  contactBtn:    { borderWidth: 1, borderColor: 'rgba(232,168,56,0.3)', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginBottom: 16 },
  contactBtnText:{ color: COLORS.accent, fontWeight: '700', fontSize: 13 },
  actions:       { flexDirection: 'row', gap: 10, marginTop: 8 },
  rejectBtn:     { flex: 1, backgroundColor: 'rgba(224,92,92,0.1)', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224,92,92,0.3)' },
  rejectBtnText: { color: '#e05c5c', fontWeight: '800', fontSize: 14 },
  acceptBtn:     { flex: 1, backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  acceptBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  statusBanner:  { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  statusBannerText: { fontWeight: '700', fontSize: 14 },
})