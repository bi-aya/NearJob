import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../hooks/useAuth'
import { styles } from '../styles/register.styles'
import { COLORS } from '../styles/colors'

const ROLES = [
  { value: 'freelance', label: 'Freelance', icon: '💼', sub: 'Je cherche des missions' },
  { value: 'recruiter', label: 'Recruteur',  icon: '🏢', sub: 'Je publie des offres'   },
]

function RoleSelector({ selected, onSelect }) {
  return (
    <View>
      <Text style={styles.roleLabel}>Je suis un</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => {
          const active = selected === r.value
          return (
            <TouchableOpacity
              key={r.value}
              style={[styles.roleCard, active && styles.roleCardActive]}
              onPress={() => onSelect(r.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text style={[styles.roleCardText, active && styles.roleCardTextActive]}>
                {r.label}
              </Text>
              <Text style={[styles.roleCardSub, active && styles.roleCardSubActive]}>
                {r.sub}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { register, loading, error, resetError } = useAuth()
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [role,        setRole]        = useState('freelance')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!firstName.trim()) errs.firstName = 'Prénom requis'
    if (!lastName.trim())  errs.lastName  = 'Nom requis'
    if (!email.trim())                    errs.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email invalide'
    if (!password)               errs.password = 'Mot de passe requis'
    else if (password.length < 6) errs.password = 'Minimum 6 caractères'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
    if (resetError) resetError()
  }

  const handleRegister = async () => {
    if (!validate()) return
    await register({ email, password, role, firstName, lastName })
      

  }

  // ─── Retour : canGoBack() évite le crash si pas d'historique ────────
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('Login')
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <View style={styles.header}>
            {/* Bouton Retour corrigé */}
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <View style={styles.backArrow} />
            </TouchableOpacity>

            <View style={styles.logoWrap}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>NearJob</Text>
            </View>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoins des milliers de professionnels près de chez toi.
            </Text>
          </View>

          {/* ── Formulaire ──────────────────────────────────────────── */}
          <View style={styles.form}>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <RoleSelector selected={role} onSelect={setRole} />

            {/* Prénom + Nom */}
            <View style={styles.row}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={[styles.input, fieldErrors.firstName && styles.inputError]}
                  placeholder="Yasmine"
                  placeholderTextColor={COLORS.creamMuted}
                  value={firstName}
                  onChangeText={(t) => { setFirstName(t); clearFieldError('firstName') }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {fieldErrors.firstName && (
                  <Text style={styles.fieldError}>{fieldErrors.firstName}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={[styles.input, fieldErrors.lastName && styles.inputError]}
                  placeholder="Benali"
                  placeholderTextColor={COLORS.creamMuted}
                  value={lastName}
                  onChangeText={(t) => { setLastName(t); clearFieldError('lastName') }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {fieldErrors.lastName && (
                  <Text style={styles.fieldError}>{fieldErrors.lastName}</Text>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, fieldErrors.email && styles.inputError]}
                placeholder="ton@email.com"
                placeholderTextColor={COLORS.creamMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); clearFieldError('email') }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              {fieldErrors.email && (
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              )}
            </View>

            {/* Mot de passe */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex, fieldErrors.password && styles.inputError]}
                  placeholder="6 caractères minimum"
                  placeholderTextColor={COLORS.creamMuted}
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearFieldError('password') }}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass((v) => !v)}>
                  <Text style={styles.eyeIcon}>{showPass ? '🔒' : '👁'}</Text>
                </TouchableOpacity>
              </View>
              {fieldErrors.password && (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              )}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.primary} />
                : <Text style={styles.btnPrimaryText}>Créer mon compte</Text>
              }
            </TouchableOpacity>

            <Text style={styles.termsText}>
              En créant un compte, tu acceptes nos{' '}
              <Text style={styles.termsLink}>conditions d'utilisation</Text>
              {' '}et notre{' '}
              <Text style={styles.termsLink}>politique de confidentialité</Text>.
            </Text>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}