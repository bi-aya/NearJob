// src/styles/editProfile.styles.js
import { StyleSheet } from 'react-native'
import { COLORS } from './colors'

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  kvWrap: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },

  // ── Header
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.cream,
    transform: [{ rotate: '45deg' }],
  },
  backText: {
    color: COLORS.cream,
    fontSize: 14,
  },
  headerTitle: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '700',
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
  },
  saveBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },

  // ── Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: COLORS.primary,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.accent,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.accent,
  },
  avatarChangeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  avatarChangeBtnText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  sectionAddBtn: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // ── Field
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },
  textarea: {
    height: 90,
    textAlignVertical: 'top',
  },

  // ── Row
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  rowField: {
    flex: 1,
    marginBottom: 0,
  },

  // ── Date picker button
  datePickerBtn: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 15,
    color: '#222',
  },
  datePickerPlaceholder: {
    fontSize: 15,
    color: '#aaa',
  },
  datePickerIcon: {
    fontSize: 16,
  },

  // ── Skills
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F5F3',
    borderWidth: 1,
    borderColor: 'rgba(16,44,38,0.15)',
    gap: 6,
  },
  skillPillText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  skillRemove: {
    color: '#e05c5c',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  skillInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  skillInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  skillAddBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillAddBtnText: {
    color: COLORS.cream,
    fontWeight: '700',
    fontSize: 22,
  },

  // ── Expérience form
  xpForm: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  xpFormTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  xpSaveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  xpSaveBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
  },
  xpCancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  xpCancelBtnText: {
    color: '#888',
    fontSize: 13,
  },

  // ── Xp item existant
  xpItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  xpItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  xpItemCompany: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  xpItemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
})
