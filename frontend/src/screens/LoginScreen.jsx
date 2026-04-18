import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StatusBar, SafeAreaView,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  Keyboard, TouchableWithoutFeedback
} from 'react-native'
import { useAuth } from '../hooks/useAuth'  
import { styles } from '../styles/login.styles'
import { COLORS } from '../styles/colors'

export default function LoginScreen({ navigation }) {
  const { login, loading, error, resetError } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const passwordInputRef = useRef(null)

  const validate = () => {
    Keyboard.dismiss()
    const errs = {}
    const cleanEmail = email.trim()
    if (!cleanEmail) errs.email = "Veuillez renseigner votre e-mail."
    else if (!/\S+@\S+\.\S+/.test(cleanEmail)) errs.email = "Format d'e-mail invalide."
    if (!password) errs.password = "Veuillez saisir votre mot de passe."
    else if (password.length < 6) errs.password = "Le mot de passe nécessite 6 caractères minimum."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    const cleanEmail = email.trim().toLowerCase()
    await login(cleanEmail, password)
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
    resetError()
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <View style={styles.backArrow} />
              </TouchableOpacity>
              <View style={styles.logoWrap}>
                <View style={styles.logoDot} />
                <Text style={styles.logoText}>NearJob</Text>
              </View>
              <Text style={styles.title}>Ravi de vous revoir </Text>
              <Text style={styles.subtitle}>
                Connectez-vous pour découvrir les missions disponibles près de chez vous.
              </Text>
            </View>

            <View style={styles.form}>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <TextInput
                  style={[styles.input, fieldErrors.email && styles.inputError]}
                  placeholder="adresse@email.com"
                  placeholderTextColor={COLORS.creamMuted}
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearFieldError('email') }} // ✅ clearFieldError
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {fieldErrors.email && (
                  <Text style={styles.fieldError}>{fieldErrors.email}</Text>
                )}
              </View>

              {/* Mot de passe */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <TouchableOpacity disabled={loading}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    ref={passwordInputRef}
                    style={[styles.input, styles.inputFlex, fieldErrors.password && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.creamMuted}
                    value={password}
                    onChangeText={(t) => { setPassword(t); clearFieldError('password') }} // ✅ clearFieldError
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPass((v) => !v)}
                    disabled={loading}
                  >
                    <Text style={styles.eyeIcon}>{showPass ? '🔒' : '👁'}</Text>
                  </TouchableOpacity>
                </View>
                {fieldErrors.password && (
                  <Text style={styles.fieldError}>{fieldErrors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.btnPrimary, loading && styles.btnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.primary} />
                  : <Text style={styles.btnPrimaryText}>S'identifier</Text>
                }
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Nouveau sur NearJob ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                  <Text style={styles.registerLink}>Créer un compte</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}