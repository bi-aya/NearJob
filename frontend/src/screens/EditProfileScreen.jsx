import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { styles } from '../styles/editProfile.styles'
import { COLORS } from '../styles/colors'
import { useProfile } from '../hooks/useProfile'

const formatYear = (date) => date.getFullYear().toString()

// ─── Date Picker ──────────────────────────────────────────────────────
function DatePickerField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  const date = value ? new Date(parseInt(value), 0, 1) : new Date()

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios')
    if (selectedDate) onChange(formatYear(selectedDate))
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShow(true)}>
        <Text style={value ? styles.datePickerText : styles.datePickerPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.datePickerIcon}>📅</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  )
}

// ─── Section : Infos ──────────────────────────────────────────────────
function InfosSection({ data, onChange }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>INFORMATIONS</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.rowField]}>
          <Text style={styles.label}>PRÉNOM</Text>
          <TextInput
            style={styles.input}
            value={data.firstName}
            onChangeText={(t) => onChange('firstName', t)}
            placeholder="Prénom"
            placeholderTextColor="#aaa"
            returnKeyType="next"
          />
        </View>
        <View style={[styles.fieldGroup, styles.rowField]}>
          <Text style={styles.label}>NOM</Text>
          <TextInput
            style={styles.input}
            value={data.lastName}
            onChangeText={(t) => onChange('lastName', t)}
            placeholder="Nom"
            placeholderTextColor="#aaa"
            returnKeyType="next"
          />
        </View>
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>CATÉGORIE MÉTIER</Text>
        <TextInput
          style={styles.input}
          value={data.category}
          onChangeText={(t) => onChange('category', t)}
          placeholder="Ex: Développeur, Designer, Photographe..."
          placeholderTextColor="#aaa"
          returnKeyType="next"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>VILLE</Text>
        <TextInput
          style={styles.input}
          value={data.city}
          onChangeText={(t) => onChange('city', t)}
          placeholder="Ex: Casablanca"
          placeholderTextColor="#aaa"
          returnKeyType="next"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>TARIF JOURNALIER (€)</Text>
        <TextInput
          style={styles.input}
          value={data.dailyRate}
          onChangeText={(t) => onChange('dailyRate', t)}
          placeholder="Ex: 350"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          returnKeyType="next"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>BIO</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={data.bio}
          onChangeText={(t) => onChange('bio', t)}
          placeholder="Présente-toi en quelques phrases..."
          placeholderTextColor="#aaa"
          multiline
          maxLength={500}
          returnKeyType="done"
        />
        <Text style={{ fontSize: 11, color: '#aaa', textAlign: 'right', marginTop: 4 }}>
          {data.bio?.length ?? 0}/500
        </Text>
      </View>
    </View>
  )
}

// ─── Section : Skills ─────────────────────────────────────────────────
function SkillsSection({ skills, setSkills }) {
  const { allCompetences } = useProfile()

  const toggleSkill = (skillName) => {
    setSkills(prev =>
      prev.includes(skillName)
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    )
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>COMPÉTENCES</Text>
        <Text style={{ fontSize: 12, color: '#888' }}>{skills.length} sélectionnée(s)</Text>
      </View>
      <Text style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
        Sélectionnez vos expertises dans la liste ci-dessous :
      </Text>
      <View style={styles.skillsWrap}>
        {allCompetences?.map((comp) => {
          const isSelected = skills.includes(comp.name)
          return (
            <TouchableOpacity
              key={comp.id}
              onPress={() => toggleSkill(comp.name)}
              activeOpacity={0.7}
              style={[
                styles.skillPill,
                isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
              ]}
            >
              <Text style={[styles.skillPillText, isSelected && { color: '#FFF' }]}>
                {comp.name}
              </Text>
              {isSelected && <Text style={{ color: '#FFF', marginLeft: 5, fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

// ─── Section : Expériences ────────────────────────────────────────────
function ExperiencesSection({ experiences, onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', startDate: '', endDate: '',
  })

  const handleAdd = () => {
    if (!form.title.trim() || !form.company.trim() || !form.startDate) {
      Alert.alert('Champs requis', 'Titre, entreprise et date de début sont obligatoires.')
      return
    }
    onAdd({ ...form, endDate: form.endDate || null })
    setForm({ title: '', company: '', startDate: '', endDate: '' })
    setShowForm(false)
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXPÉRIENCES</Text>
        <TouchableOpacity onPress={() => setShowForm((v) => !v)}>
          <Text style={styles.sectionAddBtn}>{showForm ? 'Annuler' : '+ Ajouter'}</Text>
        </TouchableOpacity>
      </View>

      {experiences?.map((xp) => (
        <View key={xp.id} style={styles.xpItem}>
          <Text style={styles.xpItemTitle}>{xp.title}</Text>
          <Text style={styles.xpItemCompany}>{xp.company}</Text>
          <Text style={styles.xpItemDate}>
            {xp.startDate} — {xp.endDate ?? 'Présent'}
          </Text>
        </View>
      ))}

      {showForm && (
        <View style={styles.xpForm}>
          <Text style={styles.xpFormTitle}>Nouvelle expérience</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>POSTE</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(t) => setForm((p) => ({ ...p, title: t }))}
              placeholder="Ex: Développeur Frontend"
              placeholderTextColor="#aaa"
              returnKeyType="next"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>ENTREPRISE</Text>
            <TextInput
              style={styles.input}
              value={form.company}
              onChangeText={(t) => setForm((p) => ({ ...p, company: t }))}
              placeholder="Ex: Agence TechNova"
              placeholderTextColor="#aaa"
              returnKeyType="next"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowField}>
              <DatePickerField
                label="DÉBUT"
                value={form.startDate}
                onChange={(val) => setForm((p) => ({ ...p, startDate: val }))}
                placeholder="Choisir"
              />
            </View>
            <View style={styles.rowField}>
              <DatePickerField
                label="FIN (optionnel)"
                value={form.endDate}
                onChange={(val) => setForm((p) => ({ ...p, endDate: val }))}
                placeholder="Présent"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.xpSaveBtn} onPress={handleAdd}>
            <Text style={styles.xpSaveBtnText}>Enregistrer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.xpCancelBtn} onPress={() => setShowForm(false)}>
            <Text style={styles.xpCancelBtnText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// ══════════════════════════════════════════════════════════════════════
// ÉCRAN PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { user } = useSelector((state) => state.auth)

  const {
    profile, saving,
    updateProfileData, updateSkillsData,
    allCompetences, addExperienceData,
  } = useProfile()

  const [form, setForm] = useState({
    firstName: '', lastName: '', bio: '', category: '', city: '', dailyRate: '',
  })
  const [skills, setSkills] = useState([])

  useEffect(() => {
    if (!profile) return
    setForm({
      firstName: profile.firstName ?? user?.firstName ?? '',
      lastName:  profile.lastName  ?? user?.lastName  ?? '',
      bio:       profile.bio       ?? '',
      category:  profile.category  ?? '',
      city:      profile.city      ?? '',
      dailyRate: profile.dailyRate?.toString() ?? '',
    })
    setSkills(
      (profile.competences ?? []).map((s) => typeof s === 'object' ? s.name : s)
    )
  }, [profile])

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleAddExperience = (data) => addExperienceData(data)

  const handleSave = async () => {
    console.log("=== handleSave appelé ===")
    console.log("form :", form)
    try {
      const result = await updateProfileData({
        ...form,
        dailyRate: form.dailyRate ? Number(form.dailyRate) : undefined,
      })
    
       const selectedIds = (allCompetences || [])
      .filter(c => (skills || []).includes(c.name))
      .map(c => c.id);
       await updateSkillsData(selectedIds);

      navigation.goBack()
    } catch (error) {
      console.error("Erreur :", error)
    }
  }
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'NJ'

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backArrow} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={COLORS.primary} size="small" />
            : <Text style={styles.saveBtnText}>Enregistrer</Text>
          }
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.kvWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {profile?.avatar
                ? <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
                : <Text style={styles.avatarInitials}>{initials}</Text>
              }
            </View>
          </View>

          <InfosSection data={form} onChange={handleChange} />

          {user?.role === 'freelance' && (
            <SkillsSection skills={skills} setSkills={setSkills} />
          )}

          {user?.role === 'freelance' && (
            <ExperiencesSection
              experiences={profile?.experiences}
              onAdd={handleAddExperience}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}