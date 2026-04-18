// src/styles/profile.styles.js
import { StyleSheet, Dimensions } from 'react-native'
import { COLORS } from './colors'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Top bar
  topBar: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuWrap: {
    padding: 4,
    gap: 5,
  },
  menuLine: {
    height: 2,
    backgroundColor: COLORS.cream,
    borderRadius: 2,
  },
  topBarTitle: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '700',
  },
  topBarSpacer: {
    width: 40,
  },

  // ── Hero
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 8,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.accent,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.accent,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 14,
    color: COLORS.creamMuted,
    marginBottom: 10,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  locationText: {
    color: COLORS.creamMuted,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Dispo toggle
  dispoToggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dispoLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  dispoOn:  { color: '#1D9E75' },
  dispoOff: { color: '#e05c5c' },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn:  { backgroundColor: '#1D9E75' },
  toggleOff: { backgroundColor: 'rgba(224,92,92,0.5)' },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleThumbOn:  { alignSelf: 'flex-end' },
  toggleThumbOff: { alignSelf: 'flex-start' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Stats card
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 15,
  },

  // ── CTA
  ctaWrap: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
  },
  btnPrimaryText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnOutline: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  btnOutlineText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
  },
  tabItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  tabItemTextActive: {
    color: COLORS.cream,
  },

  // ── Section title
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 14,
    paddingHorizontal: 20,
  },

  // ── Bio card
  bioCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 1,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  bioEmpty: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ── Skills
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  skillPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(16,44,38,0.15)',
  },
  skillPillText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Timeline
  timelineWrap: {
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(232,168,56,0.3)',
    marginTop: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  timelineCompany: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#888',
  },
  timelineDeleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  timelineDeleteText: {
    fontSize: 12,
    color: '#e05c5c',
  },

  // ── Portfolio
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  portfolioCard: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 8,
    elevation: 1,
  },
  portfolioIcon: { fontSize: 28 },
  portfolioTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  portfolioSub: {
    fontSize: 11,
    color: '#888',
  },

  // ── Offre card
  offreCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offreDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  offreInfo: { flex: 1 },
  offreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 3,
  },
  offreDate: {
    fontSize: 12,
    color: '#888',
  },
  offreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  offreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAction: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
})
