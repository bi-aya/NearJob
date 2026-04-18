import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet, TextInput, Modal
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useJob } from '../hooks/useJob'
import { COLORS } from '../styles/colors'

const STATUS_CONFIG = {
  active: { color: '#1D9E75', label: 'Active'    },
  draft:  { color: '#E8A838', label: 'Brouillon' },
  closed: { color: '#e05c5c', label: 'Fermée'    },
}
const TYPE_LABELS = {
  freelance: 'Freelance',
  cdi_cdd:   'CDI / CDD',
  stage:     'Stage',
}

// ─── Modal édition ────────────────────────────────────────────────────
function EditJobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       job.title       ?? '',
    description: job.description ?? '',
    category:    job.category    ?? '',
    city:        job.city        ?? '',
    budget:      job.budget ? String(job.budget) : '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title.trim() || form.title.length < 5) {
      Alert.alert('Erreur', 'Titre : 5 caractères minimum.')
      return
    }
    if (!form.description.trim() || form.description.length < 20) {
      Alert.alert('Erreur', 'Description : 20 caractères minimum.')
      return
    }
    setSaving(true)
    await onSave(job.id, {
      ...form,
      budget: form.budget ? Number(form.budget) : undefined,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier l'offre</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: COLORS.creamMuted, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { key: 'title',       label: 'Titre',       placeholder: 'Titre du poste' },
              { key: 'category',    label: 'Catégorie',   placeholder: 'Ex: Développement' },
              { key: 'city',        label: 'Ville',       placeholder: 'Ex: Casablanca' },
              { key: 'budget',      label: 'Budget (€)',  placeholder: 'Ex: 5000', numeric: true },
            ].map(({ key, label, placeholder, numeric }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={form[key]}
                  onChangeText={(t) => setForm(p => ({ ...p, [key]: t }))}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.creamMuted}
                  keyboardType={numeric ? 'numeric' : 'default'}
                />
              </View>
            ))}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={form.description}
                onChangeText={(t) => setForm(p => ({ ...p, description: t }))}
                placeholder="Description du poste..."
                placeholderTextColor={COLORS.creamMuted}
                multiline
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={COLORS.primary} />
              : <Text style={styles.saveBtnText}>Enregistrer</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

// ─── Card offre ───────────────────────────────────────────────────────
function OffreCard({ job, onEdit, onDelete }) {
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.active

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'offre',
      `Supprimer "${job.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(job.id) },
      ]
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.cardMeta}>
            {TYPE_LABELS[job.type] ?? job.type}
            {job.city ? `  ·  ${job.city}` : ''}
          </Text>
          {job.budget && (
            <Text style={styles.cardBudget}>
              {Number(job.budget).toLocaleString('fr-FR')} €
            </Text>
          )}
        </View>
        <View style={[styles.badge, { backgroundColor: `${cfg.color}22` }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <Text style={styles.cardDesc} numberOfLines={2}>{job.description}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(job)}>
          <Text style={styles.editBtnText}>✏️  Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>🗑  Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Écran principal ──────────────────────────────────────────────────
export default function MesOffresScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { myJobs, loading, fetchMyJobs, deleteJob, updateJob } = useJob()
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => { fetchMyJobs() }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes offres</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('PublishJob')}
        >
          <Text style={styles.addBtnText}>+ Publier</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : !myJobs?.length ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
          <Text style={styles.emptyText}>Aucune offre publiée.</Text>
          <TouchableOpacity
            style={styles.publishBtn}
            onPress={() => navigation.navigate('PublishJob')}
          >
            <Text style={styles.publishBtnText}>Publier une offre →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>{myJobs.length} offre{myJobs.length > 1 ? 's' : ''}</Text>
          {myJobs.map((job) => (
            <OffreCard
              key={job.id}
              job={job}
              onEdit={setEditingJob}
              onDelete={deleteJob}
            />
          ))}
        </ScrollView>
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={updateJob}
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
  backBtn:     { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(247,231,206,0.15)', alignItems: 'center', justifyContent: 'center' },
  backArrow:   { color: COLORS.cream, fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.cream },
  addBtn:      { backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText:  { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  count:       { fontSize: 13, color: COLORS.creamMuted, marginBottom: 12 },
  card: {
    backgroundColor: COLORS.primaryMid, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(247,231,206,0.1)',
    padding: 16, marginBottom: 12,
  },
  cardTop:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  cardTitle:   { fontSize: 15, fontWeight: '700', color: COLORS.cream, marginBottom: 4 },
  cardMeta:    { fontSize: 12, color: COLORS.creamMuted },
  cardBudget:  { fontSize: 12, color: COLORS.accent, fontWeight: '600', marginTop: 2 },
  cardDesc:    { fontSize: 13, color: COLORS.creamMuted, lineHeight: 18, marginBottom: 12 },
  badge:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText:   { fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn:     { flex: 1, backgroundColor: 'rgba(232,168,56,0.12)', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,168,56,0.3)' },
  editBtnText: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
  deleteBtn:   { flex: 1, backgroundColor: 'rgba(224,92,92,0.08)', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224,92,92,0.3)' },
  deleteBtnText:{ color: '#e05c5c', fontWeight: '700', fontSize: 13 },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText:   { color: COLORS.creamMuted, textAlign: 'center', fontSize: 14, marginBottom: 20 },
  publishBtn:  { backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  publishBtnText: { color: COLORS.primary, fontWeight: '700' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.primaryMid, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '85%',
  },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 18, fontWeight: '800', color: COLORS.cream },
  fieldGroup:   { marginBottom: 16 },
  fieldLabel:   { fontSize: 12, color: COLORS.creamMuted, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input:        { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 12, color: COLORS.cream, fontSize: 14 },
  saveBtn:      { backgroundColor: COLORS.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText:  { color: COLORS.primary, fontWeight: '800', fontSize: 15 },
})