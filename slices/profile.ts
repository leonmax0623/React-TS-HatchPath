import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

import { Firestore, Storage } from 'util/fire'
import { getProfileIndex } from 'util/search'
import { RootState } from 'util/store'
import { getDefaultAvailability } from 'util/time'

import { ClientType, CoachType, ProfileType } from 'types/profile'

import { logout } from './user'

export const PROFILE_COLLECTION = 'profiles'
export type ProfileErrorType = 'UNKNOWN' | 'UNAUTHENTICATED' | undefined

export const getProfile = createAsyncThunk<ProfileType | undefined, string>(
  'profile/get',
  async (profileId) => {
    const docRef = doc(Firestore, PROFILE_COLLECTION, profileId)
    const document = await getDoc(docRef)
    if (document.exists()) {
      const profile = document.data() as ProfileType
      return profile
    } else {
      return undefined
    }
  },
)

export const createProfile = createAsyncThunk<ProfileType, ProfileType>(
  'profile/create',
  async (profile) => {
    const profileImage = profile.profileImage
    if (profileImage && profileImage.data) {
      const filePath = `profiles/${profile.id}/${profileImage.id}`
      const fileRef = ref(Storage, filePath)
      await uploadBytes(fileRef, profileImage.data, {
        contentType: profileImage.format,
      })
      const url = await getDownloadURL(fileRef)
      profileImage.url = url
      profileImage.data = null
      profile.profileImage = profileImage
    }

    const docRef = doc(Firestore, PROFILE_COLLECTION, profile.id)
    await setDoc(docRef, profile)
    return profile
  },
)

export const updateProfile = createAsyncThunk<
  ProfileType,
  Partial<Omit<ProfileType, 'client' | 'coach'>> & {
    id: string
    client?: Partial<ClientType> | null
    coach?: Partial<CoachType> | null
  },
  { rejectValue: ProfileErrorType }
>('profile/update', async (profile, { rejectWithValue }) => {
  const docRef = doc(Firestore, PROFILE_COLLECTION, profile.id)
  const document = await getDoc(docRef)
  if (document.exists()) {
    const currProfile = document.data() as ProfileType
    const combined = {
      ...currProfile,
      ...profile,
      client:
        currProfile.client || profile.client
          ? {
              ...currProfile.client,
              ...profile.client,
            }
          : null,
      coach:
        currProfile.coach || profile.coach
          ? {
              ...currProfile.coach,
              ...profile.coach,
            }
          : null,
    }
    const nextProfile: ProfileType = {
      ...combined,
      id: currProfile.id, // just in case
      client: combined.client
        ? {
            createdTime: combined.client.createdTime!,
            tags: combined.client.tags!,
            description: combined.client.description!,
            notifications: combined.client.notifications! || {},
          }
        : null,
      coach: combined.coach
        ? {
            createdTime: combined.coach.createdTime!,
            decisionTime: combined.coach.decisionTime || null,
            decision: combined.coach.decision || null,
            searchIndex: getProfileIndex(
              combined.firstName,
              combined.lastName,
              combined.coach.tags!,
              combined.coach.businessName,
            ),
            businessName: combined.coach.businessName!,
            description: combined.coach.description!,
            links: combined.coach.links!,
            tags: combined.coach.tags!,
            numPreviousClients: combined.coach.numPreviousClients!,
            education: combined.coach.education!,
            certifications: combined.coach.certifications!,
            experience: combined.coach.experience!,
            availability:
              combined.coach.availability || getDefaultAvailability(),
            notifications: combined.coach.notifications! || {},
          }
        : null,
    }

    const currProfileImage = currProfile.profileImage
    const nextProfileImage = nextProfile.profileImage
    if (
      nextProfileImage &&
      (!currProfileImage || nextProfileImage.id !== currProfileImage?.id) &&
      !!nextProfileImage.data
    ) {
      if (currProfileImage) {
        const currFilePath = `profiles/${currProfile.id}/${currProfileImage.id}`
        const currRef = ref(Storage, currFilePath)
        await deleteObject(currRef)
      }

      const nextFilePath = `profiles/${nextProfile.id}/${nextProfileImage.id}`
      const nextRef = ref(Storage, nextFilePath)
      await uploadBytes(nextRef, nextProfileImage.data, {
        contentType: nextProfileImage.format,
      })
      const url = await getDownloadURL(nextRef)
      nextProfileImage.url = url
      nextProfileImage.data = null
      nextProfile.profileImage = nextProfileImage
    } else if (currProfileImage && !nextProfileImage) {
      const currFilePath = `profiles/${currProfile.id}/${currProfileImage.id}`
      const currRef = ref(Storage, currFilePath)
      await deleteObject(currRef)
      nextProfile.profileImage = null
    }

    await updateDoc(docRef, nextProfile)
    return nextProfile
  } else {
    return rejectWithValue('UNKNOWN')
  }
})

export const updateProfileMode = createAsyncThunk<
  ProfileType,
  'client' | 'coach',
  { rejectValue: ProfileErrorType; state: RootState }
>('profile/updateMode', async (mode, { rejectWithValue, getState }) => {
  const {
    profile: { profile },
  } = getState()

  if (profile) {
    const nextProfile = {
      ...profile,
      mode,
    }
    const docRef = doc(Firestore, PROFILE_COLLECTION, nextProfile.id)
    await setDoc(docRef, nextProfile, { merge: true })
    return nextProfile
  } else {
    return rejectWithValue('UNAUTHENTICATED')
  }
})

export const updateTimezone = createAsyncThunk<
  ProfileType,
  string,
  { rejectValue: ProfileErrorType; state: RootState }
>('profile/updateTimezone', async (timezone, { rejectWithValue, getState }) => {
  const {
    profile: { profile },
  } = getState()

  if (profile?.coach) {
    const nextProfile = {
      ...profile,
      coach: {
        ...profile.coach,
        timezone,
      },
    }
    const docRef = doc(Firestore, PROFILE_COLLECTION, nextProfile.id)
    await setDoc(docRef, nextProfile, { merge: true })
    return nextProfile
  } else {
    return rejectWithValue('UNAUTHENTICATED')
  }
})

export const removeNotification = createAsyncThunk<
  ProfileType,
  { id: string; type: 'client' | 'coach' },
  { rejectValue: ProfileErrorType; state: RootState }
>(
  'profile/removeNotification',
  async ({ id, type }, { rejectWithValue, getState }) => {
    const {
      profile: { profile },
    } = getState()
    if (profile) {
      const nextProfile = { ...profile }
      if (type === 'client' && nextProfile.client) {
        const notifications = { ...nextProfile.client.notifications }
        delete notifications[id]
        nextProfile.client = {
          ...nextProfile.client,
          notifications,
        }
      } else if (nextProfile.coach) {
        const notifications = { ...nextProfile.coach.notifications }
        delete notifications[id]
        nextProfile.coach = {
          ...nextProfile.coach,
          notifications,
        }
      }
      const docRef = doc(Firestore, PROFILE_COLLECTION, nextProfile.id)
      await setDoc(docRef, nextProfile, { merge: true })
      return nextProfile
    } else {
      return rejectWithValue('UNAUTHENTICATED')
    }
  },
)

type ProfileSliceType = {
  initiated: boolean
  profile?: ProfileType
}
export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    initiated: false,
    profile: undefined,
  } as ProfileSliceType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(createProfile.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(updateProfile.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(updateProfileMode.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(updateTimezone.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(removeNotification.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          profile: payload,
        }
      })
      .addCase(logout.fulfilled, () => {
        return {
          initiated: true,
          profile: undefined,
        }
      })
  },
})

export const actions = profileSlice.actions
export default profileSlice.reducer
