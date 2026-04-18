import { StyleSheet, Dimensions } from 'react-native'
import { COLORS } from './colors'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flatList: {
    flex: 1,
  },

  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: COLORS.creamMuted,
    fontSize: 14,
    fontWeight: '500',
  },

  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
    gap: 16,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 36,
    marginTop: 8,
  },
  slideSubtitle: {
    fontSize: 15,
    color: COLORS.creamMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.accentMuted,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    marginTop: 16,
  },
  pillText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: COLORS.accentMuted,
    borderWidth: 1.5,
    borderColor: COLORS.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Location icon pieces
  pinOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  pinTail: {
    width: 2.5,
    height: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginTop: -4,
  },
  wave: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },

  // Briefcase icon pieces
  briefcase: {
    width: 40,
    height: 28,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefcaseHandle: {
    position: 'absolute',
    top: -10,
    width: 18,
    height: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    borderBottomWidth: 0,
  },
  briefcaseLatch: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    opacity: 0.5,
  },

  // Freelance icon pieces
  avatarCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
  },
  connLine1: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: COLORS.accent,
    opacity: 0.6,
    top: 30,
    left: 42,
    transform: [{ rotate: '-30deg' }],
  },
  connLine2: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: COLORS.accent,
    opacity: 0.45,
    top: 44,
    left: 43,
    transform: [{ rotate: '20deg' }],
  },

  // Shield icon pieces
  shieldOuter: {
    width: 38,
    height: 42,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLeft: {
    position: 'absolute',
    width: 2.5,
    height: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }, { translateX: -5 }, { translateY: 3 }],
  },
  checkRight: {
    position: 'absolute',
    width: 2.5,
    height: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }, { translateX: 5 }, { translateY: -1 }],
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(247,231,206,0.25)',
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  // Footer
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 12,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnSecondary: {
    paddingVertical: 8,
  },
  btnSecondaryText: {
    color: COLORS.creamMuted,
    fontSize: 14,
  },
})
