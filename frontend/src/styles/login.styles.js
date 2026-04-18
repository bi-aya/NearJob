import { StyleSheet } from 'react-native'
import { COLORS } from './colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  // Header
  header: {
    paddingTop: 16,
    paddingBottom: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.cream,
    transform: [{ rotate: '45deg' }],
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  logoText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.creamMuted,
    lineHeight: 22,
  },

  // Form
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    color: COLORS.accent,
    fontSize: 13,
  },
  input: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(247,231,206,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.cream,
  },
  inputFlex: {
    flex: 1,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  fieldError: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 2,
  },

  // Error banner
  errorBanner: {
    backgroundColor: 'rgba(224,92,92,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(224,92,92,0.3)',
    borderRadius: 12,
    padding: 12,
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: 13,
    textAlign: 'center',
  },

  // Buttons
  btnPrimary: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  btnPrimaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(247,231,206,0.12)',
  },
  dividerText: {
    color: COLORS.creamMuted,
    fontSize: 13,
  },

  // Register link
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.creamMuted,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
})
