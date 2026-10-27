import AsyncStorage from '@react-native-async-storage/async-storage'
import { ImageSourcePropType } from 'react-native'
import { supabase } from '@/lib/supabase'
import { EXERCISE_LIBRARY, ExerciseTemplate } from '@/services/workout-plan.service'

const SAVED_KEY = '@fitmind/saved-workouts'
const CREATED_KEY = '@fitmind/created-workouts'
const SEEDED_KEY = '@fitmind/saved-workouts-seeded'
const REPORTED_KEY = '@fitmind/reported-workouts'
const BLOCKED_CREATORS_KEY = '@fitmind/blocked-creators'

export type WorkoutVisibility = 'public' | 'private'
export type ReportReason =
  | 'inappropriate'
  | 'spam'
  | 'misleading'
  | 'unsafe'
  | 'other'

export interface WorkoutReport {
  workoutId: string
  creatorId?: string
  reason: ReportReason
  note?: string
  reportedAt: string
  reporterId?: string
}

export interface CustomWorkout {
  id: string
  title: string
  description: string
  categories: string[]
  durationMinutes: number
  difficulty: string
  targetArea: string
  posture: string
  equipment: string
  imageUrl: string
  videoUrl: string
  visibility: WorkoutVisibility
  content: string
  safetyNotes: string
  createdAt: string
  likes: number
  creator: string
  creatorId: string
}

export interface WorkoutListItem {
  key: string
  title: string
  imageUrl: ImageSourcePropType
  durationMinutes: number
  difficulty: string
  tags: string[]
  likes: number
  creator: string
  creatorId?: string
  source: 'library' | 'custom'
}

export const getWorkoutTags = (categories: string[] | string): string[] => {
  const list = Array.isArray(categories) ? categories : [categories]
  return list.filter(Boolean)
}

/** Resolve display name so other accounts never see "Bạn" for someone else's workout */
export const resolveCreatorName = (
  workout: Pick<CustomWorkout, 'creator' | 'creatorId'>,
  currentUserId?: string | null,
): string => {
  const name = workout.creator?.trim()
  const isOwner = !!currentUserId && workout.creatorId === currentUserId

  if (isOwner) {
    if (!name || name === 'Bạn') return 'Bạn'
    return name
  }

  if (!name || name === 'Bạn') return 'Thành viên Fit Mind'
  return name
}

export const libraryToListItem = (item: ExerciseTemplate): WorkoutListItem => ({
  key: item.key,
  title: item.title,
  imageUrl: item.image,
  durationMinutes: item.durationMinutes,
  difficulty: item.difficulty,
  tags: getWorkoutTags(item.category),
  likes: 96,
  creator: 'Rehab Home',
  creatorId: 'fit-mind-ai',
  source: 'library',
})

export const customToListItem = (
  item: CustomWorkout,
  currentUserId?: string | null,
): WorkoutListItem => ({
  key: item.id,
  title: item.title,
  imageUrl: { uri: item.imageUrl },
  durationMinutes: item.durationMinutes,
  difficulty: item.difficulty,
  tags: getWorkoutTags(item.categories),
  likes: item.likes,
  creator: resolveCreatorName(item, currentUserId),
  creatorId: item.creatorId,
  source: 'custom',
})

export const MyWorkoutsService = {
  async getSavedKeys(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(SAVED_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  },

  async isSaved(key: string): Promise<boolean> {
    const keys = await this.getSavedKeys()
    return keys.includes(key)
  },

  async toggleSaved(key: string): Promise<boolean> {
    const keys = await this.getSavedKeys()
    const next = keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next))
    return next.includes(key)
  },

  async saveWorkout(key: string): Promise<void> {
    const keys = await this.getSavedKeys()
    if (keys.includes(key)) return
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...keys, key]))
  },

  async getAllCreatedWorkouts(): Promise<CustomWorkout[]> {
    try {
      const raw = await AsyncStorage.getItem(CREATED_KEY)
      const list = raw ? (JSON.parse(raw) as CustomWorkout[]) : []
      // Normalize legacy items missing creatorId
      return list.map((item) => ({
        ...item,
        creatorId: item.creatorId || '',
        creator: item.creator || 'Thành viên Fit Mind',
        posture: item.posture || 'Ngồi hoặc nằm thoải mái',
        equipment: item.equipment || 'Không cần',
      }))
    } catch {
      return []
    }
  },

  async getCreatedWorkouts(userId?: string | null): Promise<CustomWorkout[]> {
    const list = await this.getAllCreatedWorkouts()
    if (!userId) return list
    return list.filter((item) => item.creatorId === userId)
  },

  async getSavedWorkouts(currentUserId?: string | null): Promise<WorkoutListItem[]> {
    const seeded = await AsyncStorage.getItem(SEEDED_KEY)
    if (!seeded) {
      await AsyncStorage.setItem(
        SAVED_KEY,
        JSON.stringify(EXERCISE_LIBRARY.map((item) => item.key)),
      )
      await AsyncStorage.setItem(SEEDED_KEY, '1')
    }

    const keys = await this.getSavedKeys()
    const libraryItems = EXERCISE_LIBRARY.filter((item) => keys.includes(item.key)).map(
      libraryToListItem,
    )
    const created = await this.getAllCreatedWorkouts()
    const customItems = created
      .filter((item) => keys.includes(item.id))
      .map((item) => customToListItem(item, currentUserId))
    return [...libraryItems, ...customItems]
  },

  async getPublicWorkouts(): Promise<CustomWorkout[]> {
    const list = await this.getAllCreatedWorkouts()
    return list.filter((item) => item.visibility === 'public')
  },

  async getExploreWorkouts(currentUserId?: string | null): Promise<WorkoutListItem[]> {
    const [reportedIds, blockedCreators] = await Promise.all([
      this.getReportedWorkoutIds(),
      this.getBlockedCreatorIds(),
    ])

    const publicCustom = (await this.getPublicWorkouts())
      .filter((item) => !reportedIds.includes(item.id))
      .filter((item) => !item.creatorId || !blockedCreators.includes(item.creatorId))
      .map((item) => customToListItem(item, currentUserId))

    const library = EXERCISE_LIBRARY.map(libraryToListItem)
    return [...publicCustom, ...library]
  },

  async getReportedWorkoutIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(REPORTED_KEY)
      const list = raw ? (JSON.parse(raw) as WorkoutReport[]) : []
      return list.map((item) => item.workoutId)
    } catch {
      return []
    }
  },

  async getBlockedCreatorIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(BLOCKED_CREATORS_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  },

  async isCreatorBlocked(creatorId?: string | null): Promise<boolean> {
    if (!creatorId) return false
    const blocked = await this.getBlockedCreatorIds()
    return blocked.includes(creatorId)
  },

  async reportWorkout(input: {
    workoutId: string
    creatorId?: string
    reason: ReportReason
    note?: string
    reporterId?: string
  }): Promise<void> {
    const raw = await AsyncStorage.getItem(REPORTED_KEY)
    const list: WorkoutReport[] = raw ? (JSON.parse(raw) as WorkoutReport[]) : []
    const next = list.filter((item) => item.workoutId !== input.workoutId)
    next.unshift({
      workoutId: input.workoutId,
      creatorId: input.creatorId,
      reason: input.reason,
      note: input.note,
      reportedAt: new Date().toISOString(),
      reporterId: input.reporterId,
    })
    await AsyncStorage.setItem(REPORTED_KEY, JSON.stringify(next))
  },

  async blockCreator(creatorId: string): Promise<void> {
    if (!creatorId || creatorId === 'fit-mind-ai') return
    const blocked = await this.getBlockedCreatorIds()
    if (blocked.includes(creatorId)) return
    await AsyncStorage.setItem(BLOCKED_CREATORS_KEY, JSON.stringify([creatorId, ...blocked]))
  },

  async getCreatorWorkouts(
    creatorName: string,
    options?: { includePrivate?: boolean; currentUserId?: string | null },
  ): Promise<WorkoutListItem[]> {
    if (creatorName === 'Rehab Home') {
      return EXERCISE_LIBRARY.map(libraryToListItem)
    }
    const [reportedIds, blockedCreators] = await Promise.all([
      this.getReportedWorkoutIds(),
      this.getBlockedCreatorIds(),
    ])
    const list = await this.getAllCreatedWorkouts()
    const currentUserId = options?.currentUserId
    return list
      .filter((item) => {
        const displayName = resolveCreatorName(item, currentUserId)
        return item.creator === creatorName || displayName === creatorName
      })
      .filter((item) => {
        if (options?.includePrivate) return true
        if (currentUserId && item.creatorId === currentUserId) return true
        return item.visibility === 'public'
      })
      .filter((item) => !reportedIds.includes(item.id))
      .filter((item) => !item.creatorId || !blockedCreators.includes(item.creatorId))
      .map((item) => customToListItem(item, currentUserId))
  },

  async getCreatedWorkout(id: string): Promise<CustomWorkout | null> {
    const list = await this.getAllCreatedWorkouts()
    return list.find((item) => item.id === id) || null
  },

  async createWorkout(
    input: Omit<CustomWorkout, 'id' | 'createdAt' | 'likes'> & {
      creator: string
      creatorId: string
    },
  ): Promise<CustomWorkout> {
    if (!input.creatorId) {
      throw new Error('Missing creatorId')
    }
    const workout: CustomWorkout = {
      ...input,
      creator: input.creator.trim() || 'Người dùng',
      creatorId: input.creatorId,
      posture: input.posture?.trim() || 'Ngồi hoặc nằm thoải mái',
      equipment: input.equipment?.trim() || 'Không cần',
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    const list = await this.getAllCreatedWorkouts()
    await AsyncStorage.setItem(CREATED_KEY, JSON.stringify([workout, ...list]))
    await saveExerciseSetup(workout.id, input.creatorId, workout.posture, workout.equipment)
    return workout
  },

  async updateWorkout(
    id: string,
    userId: string,
    updates: Partial<
      Omit<CustomWorkout, 'id' | 'createdAt' | 'likes' | 'creator' | 'creatorId'>
    >,
  ): Promise<CustomWorkout | null> {
    const list = await this.getAllCreatedWorkouts()
    const index = list.findIndex((item) => item.id === id)
    if (index < 0) return null
    if (list[index].creatorId !== userId) {
      throw new Error('Not allowed to edit this workout')
    }
    const next: CustomWorkout = {
      ...list[index],
      ...updates,
      id: list[index].id,
      creatorId: list[index].creatorId,
      creator: list[index].creator,
      createdAt: list[index].createdAt,
      likes: list[index].likes,
    }
    list[index] = next
    await AsyncStorage.setItem(CREATED_KEY, JSON.stringify(list))
    await saveExerciseSetup(next.id, userId, next.posture, next.equipment)
    return next
  },
}

export const extractYoutubeId = (url: string): string | undefined => {
  if (!url.trim()) return undefined
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim()
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  )
  return match?.[1]
}

export const formatRelativeDays = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  if (days === 0) return 'Hôm nay'
  if (days === 1) return '1 ngày trước'
  return `${days} ngày trước`
}

export const fetchExerciseSetup = async (
  key: string,
): Promise<{ posture: string; equipment: string } | null> => {
  const { data, error } = await supabase
    .from('exercise_details')
    .select('posture, equipment')
    .eq('exercise_key', key)
    .maybeSingle()

  if (error || !data) return null
  return {
    posture: data.posture,
    equipment: data.equipment,
  }
}

const saveExerciseSetup = async (
  key: string,
  userId: string,
  posture: string,
  equipment: string,
) => {
  const { error } = await supabase.from('exercise_details').upsert({
    exercise_key: key,
    posture,
    equipment,
    user_id: userId,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error('Error saving exercise setup:', error)
}
