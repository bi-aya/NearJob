import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native'
import * as Location from 'expo-location'
import { useJob } from '../hooks/useJob'
import { COLORS } from '../styles/colors'

const CATEGORIES = ['Développement', 'Design', 'Marketing', 'Comptabilité', 'Autre']
const TYPES      = [
  { value: 'freelance', label: 'Freelance' },
  { value: 'cdi_cdd',   label: 'CDI / CDD' },
  { value: 'stage',     label: 'Stage'     },
]
const BUDGET_TYPES = [
  { value: 'fixed',   label: 'Fixe'      },
  { value: 'daily',   label: 'Journalier'},
  { value: 'monthly', label: 'Mensuel'   },
]

export default function PublishJobScreen({ navigation }) {
  const { publishJob, loading, error, success, resetStatus, isRecruteur } = useJob()

  // ─── Guard rôle ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isRecruteur) {
      Alert.alert('Accès refusé', 'Cette page est réservée aux recruteurs.')
      navigation.goBack()//car on a ds stack navigation
    }
  }, [isRecruteur])

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [category,    setCategory]    = useState('')
  const [type,        setType]        = useState('freelance')
  const [budget,      setBudget]      = useState('')
  const [budgetType,  setBudgetType]  = useState('fixed')
  const [city,        setCity]        = useState('')
  const [latitude,    setLatitude]    = useState(null)
  const [longitude,   setLongitude]   = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [locLoading,  setLocLoading]  = useState(false)

  // ─── Succès → retour ─────────────────────────────────────────────
  useEffect(() => {
    if (success) {
      Alert.alert('✅ Succès', 'Votre offre a été publiée !')
      resetStatus()
      navigation.goBack()
    }
  }, [success])

  // ─── GPS ─────────────────────────────────────────────────────────
  const getLocation = async () => {
    setLocLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      console.log("Permission status:", status)  // ← ajoute
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Activez la localisation.')
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      console.log("Coords:", loc.coords)  // ← ajoute
      setLatitude(loc.coords.latitude)
      setLongitude(loc.coords.longitude)
      const geo = await Location.reverseGeocodeAsync(loc.coords)
      console.log("Geo:", geo[0])  // ← ajoute
      if (geo[0]) setCity(geo[0].city || geo[0].region || '')
    } catch(e) {
      console.error("Erreur géoloc:", e)  // ← ajoute
      Alert.alert('Erreur', 'Impossible de récupérer la localisation.')
    } finally {
      setLocLoading(false)
    }
  }

  //verification de la validité des champs avant de publier
  const validate = () => {
    const errs = {}
    if (!title.trim() || title.length < 5)       errs.title       = 'Titre : 5 caractères minimum.'
    if (!description.trim() || description.length < 20) errs.description = 'Description : 20 caractères minimum.'
    if (!category)                                errs.category    = 'Choisissez une catégorie.'
    if (budget && isNaN(Number(budget)) )          errs.budget      = 'Budget invalide.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ─── Soumission ──────────────────────────────────────────────────
  const handlePublish = () => {
    if (!validate()) return
    publishJob({
      title:      title.trim(),
      description:description.trim(),
      category,
      type,
      budget:     budget ? Number(budget) : undefined,
      budgetType,
      city,
      latitude,
      longitude,
    })
  }

  // ─── UI ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Text style={{ color: COLORS.accent, fontSize: 15 }}>← Retour</Text>
        </TouchableOpacity>
        <Text style={{ color: COLORS.cream, fontSize: 24, fontWeight: '700', marginBottom: 24 }}>
          Publier une offre
        </Text>

        {/* Erreur API */}
        {error && (
          <View style={{ backgroundColor: '#e05c5c22', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#e05c5c' }}>{error}</Text>
          </View>
        )}

        {/* Titre */}
        <Text style={label}>Titre du poste</Text>
        <TextInput
          style={[input, fieldErrors.title && inputErr]}
          placeholder="ex: Développeur React Native"
          placeholderTextColor={COLORS.creamMuted}
          value={title}
          onChangeText={(t) => { setTitle(t); setFieldErrors(p => ({...p, title: null})) }}
        />
        {fieldErrors.title && <Text style={errText}>{fieldErrors.title}</Text>}

        {/* Description */}
        <Text style={label}>Description</Text>
        <TextInput
          style={[input, { height: 120, textAlignVertical: 'top' }, fieldErrors.description && inputErr]}
          placeholder="Décrivez la mission, les compétences requises..."
          placeholderTextColor={COLORS.creamMuted}
          value={description}
          onChangeText={(t) => { setDescription(t); setFieldErrors(p => ({...p, description: null})) }}
          multiline
        />
        {fieldErrors.description && <Text style={errText}>{fieldErrors.description}</Text>}

        {/* Catégorie */}
        <Text style={label}>Catégorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => { setCategory(cat); setFieldErrors(p => ({...p, category: null})) }}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8,
                backgroundColor: category === cat ? COLORS.accent : 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ color: category === cat ? COLORS.primary : COLORS.cream, fontWeight: '600' }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {fieldErrors.category && <Text style={errText}>{fieldErrors.category}</Text>}

        {/* Type */}
        <Text style={label}>Type de contrat</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              onPress={() => setType(t.value)}
              style={{
                flex: 1, padding: 10, borderRadius: 10, alignItems: 'center',
                backgroundColor: type === t.value ? COLORS.accent : 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ color: type === t.value ? COLORS.primary : COLORS.cream, fontWeight: '600' }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget */}
        <Text style={label}>Budget (optionnel)</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
          <TextInput
            style={[input, { flex: 1 }, fieldErrors.budget && inputErr]}
            placeholder="ex: 5000"
            placeholderTextColor={COLORS.creamMuted}
            value={budget}
            onChangeText={(t) => { setBudget(t); setFieldErrors(p => ({...p, budget: null})) }}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {BUDGET_TYPES.map((bt) => (
              <TouchableOpacity
                key={bt.value}
                onPress={() => setBudgetType(bt.value)}
                style={{
                  paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
                  backgroundColor: budgetType === bt.value ? COLORS.accent : 'rgba(255,255,255,0.08)',
                }}
              >
                <Text style={{ color: budgetType === bt.value ? COLORS.primary : COLORS.cream, fontSize: 12 }}>
                  {bt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {fieldErrors.budget && <Text style={errText}>{fieldErrors.budget}</Text>}

        {/* Localisation GPS */}
        <Text style={label}>Localisation</Text>
        <TouchableOpacity
          onPress={getLocation}
          disabled={locLoading}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10,
            padding: 12, marginBottom: 8,
          }}
        >
          {locLoading
            ? <ActivityIndicator color={COLORS.accent} size="small" />
            : <Text style={{ fontSize: 18 }}>📍</Text>
          }
          <Text style={{ color: latitude ? COLORS.accent : COLORS.creamMuted }}>
            {latitude ? `${city} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})` : 'Utiliser ma position'}
          </Text>
        </TouchableOpacity>

        {/* Bouton publier */}
        <TouchableOpacity
          onPress={handlePublish}
          disabled={loading}
          style={{
            backgroundColor: COLORS.accent, borderRadius: 12,
            padding: 16, alignItems: 'center', marginTop: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? <ActivityIndicator color={COLORS.primary} />
            : <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: '700' }}>
                Publier l'offre
              </Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles inline réutilisables ──────────────────────────────────────
const label   = { color: '#c9b99a', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 }
const input   = { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 12, color: '#f7e7ce', fontSize: 15 }
const inputErr= { borderWidth: 1, borderColor: '#e05c5c' }
const errText = { color: '#e05c5c', fontSize: 12, marginTop: 4 }