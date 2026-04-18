import React, { useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'

import { useJob } from '../hooks/useJob'
import { useProfile } from '../hooks/useProfile'
import { styles } from '../styles/profile.styles'
import { COLORS } from '../styles/colors'
import { useApplication } from '../hooks/useApplication'
import { fetchProfileThunk } from '../Redux/profileSlice'

// ─── Toggle disponibilité ─────────────────────────────────────────────
function DispoToggle({ isAvailable, onToggle, loading }) {
  return (
    <TouchableOpacity
      style={styles.dispoToggleWrap}
      onPress={onToggle}
      disabled={loading}
      activeOpacity={0.8}
    >
      <Text style={[styles.dispoLabel, isAvailable ? styles.dispoOn : styles.dispoOff]}>
        {isAvailable ? 'DISPONIBLE' : 'INDISPONIBLE'}
      </Text>
      <View style={[styles.toggle, isAvailable ? styles.toggleOn : styles.toggleOff]}>
        <View style={[styles.toggleThumb, isAvailable ? styles.toggleThumbOn : styles.toggleThumbOff]} />
      </View>
    </TouchableOpacity>
  )
}

// ─── Tab : Compétences ────────────────────────────────────────────────
function SkillsTab({ skills, onEdit }) {
  if (!skills?.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Aucune compétence ajoutée</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: '600', marginTop: 8 }}>
            + Ajouter des compétences
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.skillsWrap}>
      {skills.map((skill, i) => (
        <View key={i} style={styles.skillPill}>
          <Text style={styles.skillPillText}>
            {typeof skill === 'object' ? skill.name : skill}
          </Text>
        </View>
      ))}
    </View>
  )
}

// ─── Tab : Expérience ─────────────────────────────────────────────────
function ExperienceTab({ experiences, onDelete, onAdd }) {
  const dispatch = useDispatch()

  if (!experiences?.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Aucune expérience ajoutée.{'\n'}Complète ton profil pour te démarquer.
        </Text>
        <TouchableOpacity onPress={onAdd}>
          <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: '600', marginTop: 8 }}>
            + Ajouter une expérience
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.timelineWrap}>
      {experiences.map((xp, i) => (
        <View key={xp.id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDot} />
            {i < experiences.length - 1 && <View style={styles.timelineLine} />}
          </View>
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>{xp.title}</Text>
            <Text style={styles.timelineCompany}>{xp.company}</Text>
            <Text style={styles.timelineDate}>
              {xp.startDate} — {xp.endDate ?? 'Présent'}
            </Text>
            {/* Gardé tel quel de ton code */}
            <TouchableOpacity style={styles.timelineDeleteBtn}>
              <Text style={styles.timelineDeleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )
}

// ─── Vue Freelance ────────────────────────────────────────────────────
const FREELANCE_TABS = ['Compétences', 'Expérience']

function FreelanceView({ profile, navigation }) {
  console.log("=== profile.bio :", profile?.bio) 
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <>
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>MODIFIER MON PROFIL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bioCard}>
        <Text style={styles.sectionTitle}>À PROPOS</Text>
        {profile?.bio
          ? <Text style={styles.bioText}>{profile.bio}</Text>
          : <Text style={styles.bioEmpty}>Ajoute une bio pour te présenter aux recruteurs</Text>
        }
      </View>

      <View style={styles.tabBar}>
        {FREELANCE_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === i && styles.tabItemTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 0 && (
        <SkillsTab
          skills={profile?.competences}
          onEdit={() => navigation.navigate('EditProfile', { section: 'skills' })}
        />
      )}
      {activeTab === 1 && (
        <ExperienceTab
          experiences={profile?.experiences}
          onAdd={() => navigation.navigate('EditProfile', { section: 'experience' })}
        />
      )}
    </>
  )
}

const STATUS_CONFIG = {
  active: { color: '#1D9E75', label: 'Active'  },
  draft:  { color: '#E8A838', label: 'Brouillon'},
  closed: { color: '#e05c5c', label: 'Fermée'  },
}
const TYPE_LABELS = {
  freelance: 'Freelance',
  cdi_cdd:   'CDI / CDD',
  stage:     'Stage',
}

function JobCard({ job, onDelete }) {
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.active

  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'offre',
      `Voulez-vous vraiment supprimer "${job.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(job.id) },
      ]
    )
  }

  return (
    <View style={styles.offreCard}>
      <View style={[styles.offreDot, { backgroundColor: cfg.color }]} />
      <View style={styles.offreInfo}>
        <Text style={styles.offreTitle} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.offreDate}>
          {TYPE_LABELS[job.type] ?? job.type}
          {job.city ? `  ·  ${job.city}` : ''}
        </Text>
        {job.budget != null && (
          <Text style={{ fontSize: 12, color: COLORS.accent, fontWeight: '600', marginTop: 2 }}>
            {Number(job.budget).toLocaleString('fr-FR')} €
            {job.budgetType === 'daily' ? '/jour' : job.budgetType === 'monthly' ? '/mois' : ''}
          </Text>
        )}
      </View>
      <View style={[styles.offreBadge, { backgroundColor: `${cfg.color}18` }]}>
        <Text style={[styles.offreBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete} style={{ paddingLeft: 8 }}>
        <Text style={{ fontSize: 16, color: '#e05c5c' }}>🗑</Text>
      </TouchableOpacity>
    </View>
  )
}

function MesOffresTab({ navigation }) {
  const { myJobs, loading, fetchMyJobs, deleteJob } = useJob()

  useEffect(() => {
    console.log("=== fetchMyJobs appelé ===")
    fetchMyJobs()
  }, [])

  console.log("=== myJobs :", myJobs, "loading :", loading)
  if (loading) {
    return <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 30 }} />
  }

  if (!myJobs?.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>📋</Text>
        <Text style={styles.emptyText}>
          Aucune offre publiée.{'\n'}Publie ta première offre pour trouver des talents.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ paddingBottom: 8 }}>
      {myJobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={deleteJob} />
      ))}
    </View>
  )
}

// ─── Vue Recruteur ────────────────────────────────────────────────────
const RECRUITER_TABS = ['Mes offres', 'Candidatures']

// ─── Tab : Candidatures reçues (Recruteur) ────────────────────────────
function CandidaturesRecuesTab() {
  const { receivedApps, loading, fetchReceivedApplications } = useApplication()

  // Déclenche l'appel API au montage de l'onglet
  useEffect(() => {
    fetchReceivedApplications()
  }, [])

  if (loading) {
    return <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 30 }} />
  }

  if (!receivedApps?.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
        <Text style={styles.emptyText}>
          Aucune candidature reçue pour l'instant.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ paddingBottom: 8 }}>
      {receivedApps.map((app) => (
        <View key={app.id} style={styles.offreCard}>
          {/* Point de couleur pour le statut */}
          <View style={[styles.offreDot, { backgroundColor: app.status === 'accepted' ? '#1D9E75' : COLORS.accent }]} />
          
          <View style={styles.offreInfo}>
            <Text style={styles.offreTitle} numberOfLines={1}>
              {app.applicant?.firstName} {app.applicant?.lastName}
            </Text>
            <Text style={styles.offreDate}>
              Candidature pour : {app.job?.title}
            </Text>
            {app.message && (
              <Text style={{ fontSize: 13, color: COLORS.text, marginTop: 4 }} numberOfLines={2}>
                "{app.message}"
              </Text>
            )}
          </View>

          {/* Badge du statut */}
          <View style={[styles.offreBadge, { backgroundColor: 'rgba(38, 166, 154, 0.1)' }]}>
            <Text style={[styles.offreBadgeText, { color: COLORS.accent }]}>
              {app.status}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

function RecruiterView({ navigation }) {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <>
      <View style={styles.ctaWrap}>
         <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PublishJob')}
        >
          <Text style={styles.btnPrimaryText}>PUBLIER UNE OFFRE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnOutlineText}>MODIFIER MON PROFIL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {RECRUITER_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === i && styles.tabItemTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    {activeTab === 0 && <MesOffresTab navigation={navigation} />}
      
      {activeTab === 1 && <CandidaturesRecuesTab />}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════
// ÉCRAN PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
export default function ProfileScreen({ navigation }) {
  const insets   = useSafeAreaInsets()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { data: profile, loading, saving } = useSelector((state) => state.profile)
const { receivedApps,  fetchReceivedApplications} = useApplication()
 const { myJobs } = useJob()
  useEffect(() => {
    dispatch(fetchProfileThunk())  
     
  }, [])
 
  const {  toggleAvailabilityData} = useProfile()
  const isFreelance = user?.role === 'freelance'
  const fullName    = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : 'Mon Profil'
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'NJ'

  const handleToggleDispo = () =>  toggleAvailabilityData()

  const isAvailable = profile?.isAvailable ?? user?.isAvailable ?? false

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.menuWrap}
            onPress={() => navigation.openDrawer()}
          >
            <View style={[styles.menuLine, { width: 22 }]} />
            <View style={[styles.menuLine, { width: 16 }]} />
            <View style={[styles.menuLine, { width: 22 }]} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>Mon profil</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <TouchableOpacity
            style={{ position: 'relative' }}
            onPress={() => navigation.navigate('EditProfile', { section: 'avatar' })}
          >
            <View style={styles.avatarWrap}>
              {profile?.avatar
                ? <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
                : <Text style={styles.avatarInitials}>{initials}</Text>
              }
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.jobTitle}>
            {profile?.category
              ? `${profile.category} · ${isFreelance ? 'Freelance' : 'Recruteur'}`
              : isFreelance ? 'Freelance' : 'Recruteur'
            }
          </Text>

          {profile?.city && (
            <View style={styles.locationRow}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText}>{profile.city}</Text>
            </View>
          )}

          <View style={styles.badgeRow}>
            {isFreelance && (
              <DispoToggle
                isAvailable={isAvailable}
                onToggle={handleToggleDispo}
                loading={saving}
              />
            )}
            {profile?.avgRating > 0 && (
              <View style={styles.ratingRow}>
                <Text>⭐</Text>
                <Text style={styles.ratingText}>{profile.avgRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>

        {loading
          ? <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 30 }} />
          : (
            <>
              <View style={styles.statsCard}>
                {isFreelance ? (
                  <>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{profile?.reviewCount ?? 0}</Text>
                      <Text style={styles.statLabel}>Avis{'\n'}reçus</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {profile?.dailyRate ? `${profile.dailyRate}€` : '—'}
                      </Text>
                      <Text style={styles.statLabel}>Tarif{'\n'}jour</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {profile?.competences?.length ?? 0}
                      </Text>
                      <Text style={styles.statLabel}>Compé-{'\n'}tences</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{myJobs?.length ?? 0}</Text>
                      <Text style={styles.statLabel}>Offres{'\n'}publiées</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                   <Text style={styles.statValue}>{receivedApps?.length ?? 0}</Text>
                      <Text style={styles.statLabel}>Candidatures{'\n'}reçues</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>0</Text>
                      <Text style={styles.statLabel}>Talents{'\n'}contactés</Text>
                    </View>
                  </>
                )}
              </View>

              {isFreelance
                ? <FreelanceView profile={profile} navigation={navigation} />
                : <RecruiterView navigation={navigation} />
              }
            </>
          )
        }
      </ScrollView>
    </View>
  )
}