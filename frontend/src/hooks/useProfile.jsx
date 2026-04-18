import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProfileThunk, 
  updateProfileThunk, 
  updateSkillsThunk, 
  addExperienceThunk, 
  toggleAvailabilityThunk ,
  updateLocationThunk
} from '../Redux/profileSlice'
import api from '../apis/authApi'

export const useProfile = () => {
  const [allCompetences, setAllCompetences] = useState([])
  const dispatch = useDispatch()
  const { data: profile, saving, loading } = useSelector((state) => state.profile)

  // ─── Actions Redux pour les écrans ──────────────────────────────────
  const fetchProfile = () => dispatch(fetchProfileThunk())
  const toggleAvailabilityData = () => dispatch(toggleAvailabilityThunk())
  
  const updateProfileData = (data)   => dispatch(updateProfileThunk(data))
  const updateSkillsData  = (skills) => dispatch(updateSkillsThunk(skills))
  const addExperienceData = (xp)     => dispatch(addExperienceThunk(xp))
  const updateLocationData = (latitude, longitude) => 
  dispatch(updateLocationThunk({ latitude, longitude }))

  // ─── Chargement des compétences disponibles ─────────────────────────
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const response = await api.get('/skills') 
        setAllCompetences(response.data)
      } catch (e) {
        console.error("Erreur récupération skills", e)
      }
    }
    fetchAllSkills()
  }, [])

  return {
    profile, saving, loading, allCompetences,
    fetchProfile, toggleAvailabilityData,
    updateProfileData, updateSkillsData, addExperienceData,
    updateLocationData,  
  }
}