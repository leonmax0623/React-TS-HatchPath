import { getAdditionalUserInfo, User } from '@firebase/auth'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  applyActionCode,
  confirmPasswordReset,
  setPersistence,
  inMemoryPersistence,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'

import { isDev } from 'util/env'
import { Auth, callFunction, fromUser } from 'util/fire'
import { AppDispatch } from 'util/store'

import { ErrorType } from 'types/common'
import { ProfileType } from 'types/profile'
import { UserType } from 'types/user'

import { getProfile } from './profile'

type UserErrorType =
  | 'UNKNOWN'
  | 'WRONG_AUTH'
  | 'EMAIL_IN_USE'
  | 'USER_DISABLED'
  | 'TOO_MANY_REQUESTS'
  | 'NOT_AUTHENTICATED'
  | 'EXPIRED'
  | 'ALREADY_VERIFIED'
  | 'INVALID_COUNTRY_CODE'
  | undefined

export const login = createAsyncThunk<
  { user: UserType; profile: ProfileType | undefined },
  {
    email?: string
    password?: string
    social?: 'facebook' | 'google'
    validCountryCode?: boolean
  },
  { rejectValue: UserErrorType; dispatch: AppDispatch }
>(
  'user/login',
  async (
    { email, password, social, validCountryCode },
    { rejectWithValue, dispatch },
  ) => {
    try {
      let fireUser = undefined
      if (social && validCountryCode !== undefined) {
        const auth = getAuth()
        const provider =
          social == 'google'
            ? new GoogleAuthProvider()
            : new FacebookAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        const additionalUserInfo = await getAdditionalUserInfo(userCredential)
        // Check if user is new and is creating an account from an invalid country
        if (additionalUserInfo?.isNewUser && !validCountryCode) {
          // Delete newly created user and reject request
          auth.currentUser?.delete()
          return rejectWithValue('INVALID_COUNTRY_CODE')
        }
        fireUser = userCredential.user
      } else if (email && password) {
        const { user: emailUser } = await signInWithEmailAndPassword(
          Auth,
          email,
          password,
        )
        fireUser = emailUser
      } else {
        return rejectWithValue('UNKNOWN')
      }
      const user = fromUser(fireUser)
      const response = await dispatch(getProfile(user.id))
      if (getProfile.fulfilled.match(response)) {
        const profile = response.payload
        return {
          user,
          profile,
        }
      } else {
        return {
          user,
          profile: undefined,
        }
      }
    } catch (err) {
      const errCode = (err as { code?: string })?.code
      if (errCode === 'auth/user-disabled') {
        return rejectWithValue('USER_DISABLED')
      } else if (errCode) {
        return rejectWithValue('WRONG_AUTH')
      } else {
        return rejectWithValue('UNKNOWN')
      }
    }
  },
)

export const adminLogin = createAsyncThunk<
  UserType,
  { email: string; password: string },
  { rejectValue: UserErrorType }
>('user/adminLogin', async ({ email, password }, { rejectWithValue }) => {
  try {
    if (!isDev) {
      await setPersistence(Auth, inMemoryPersistence)
    }
    const { user: fireUser } = await signInWithEmailAndPassword(
      Auth,
      email,
      password,
    )
    const response = await callFunction('admin', 'authenticate', {})
    if (response.valid) {
      return fromUser(fireUser)
    } else {
      await signOut(Auth)
      return rejectWithValue('WRONG_AUTH')
    }
  } catch (err) {
    const errCode = (err as { code?: string })?.code
    if (errCode) {
      return rejectWithValue('WRONG_AUTH')
    } else {
      return rejectWithValue('UNKNOWN')
    }
  }
})

export const register = createAsyncThunk<
  UserType,
  { email?: string; password?: string; socialUser?: User },
  { rejectValue: UserErrorType }
>(
  'user/register',
  async ({ email, password, socialUser }, { rejectWithValue }) => {
    try {
      let fireUser = undefined
      if (socialUser) {
        // Check if user has logged in with social
        fireUser = socialUser
      } else if (email && password) {
        // Check if user has logged-in with email password
        const { user } = await createUserWithEmailAndPassword(
          Auth,
          email,
          password,
        )
        fireUser = user
      } else {
        return rejectWithValue('WRONG_AUTH')
      }
      return fromUser({ ...fireUser })
    } catch (err) {
      const errCode = (err as ErrorType)?.code
      if (errCode === 'auth/email-already-in-use') {
        return rejectWithValue('EMAIL_IN_USE')
      } else {
        return rejectWithValue('UNKNOWN')
      }
    }
  },
)

export const sendResetPassword = createAsyncThunk<
  void,
  string,
  { rejectValue: UserErrorType }
>('user/sendResetPassword', async (email, { rejectWithValue }) => {
  try {
    await callFunction('account', 'send-reset-password', { email })
  } catch (err) {
    return rejectWithValue('UNKNOWN')
  }
})

export const resetPassword = createAsyncThunk<
  void,
  { code: string; password: string },
  { rejectValue: UserErrorType }
>('user/resetPassword', async ({ code, password }, { rejectWithValue }) => {
  try {
    await confirmPasswordReset(Auth, code, password)
  } catch (err) {
    const errCode = (err as ErrorType)?.code
    if (
      errCode === 'auth/expired-action-code' ||
      errCode === 'auth/invalid-action-code'
    ) {
      return rejectWithValue('EXPIRED')
    } else {
      return rejectWithValue('UNKNOWN')
    }
  }
})

export const sendEmailVerify = createAsyncThunk<
  void,
  void,
  { rejectValue: UserErrorType }
>('user/sendEmailVerify', async (_, { rejectWithValue }) => {
  try {
    if (Auth.currentUser) {
      await callFunction('account', 'send-verify-email', {})
    } else {
      return rejectWithValue('NOT_AUTHENTICATED')
    }
  } catch (err) {
    const errCode = (err as ErrorType)?.code
    if (errCode === 'already-exists') {
      return rejectWithValue('ALREADY_VERIFIED')
    } else {
      return rejectWithValue('UNKNOWN')
    }
  }
})

export const verifyEmail = createAsyncThunk<
  void,
  string,
  { rejectValue: UserErrorType }
>('user/verifyEmail', async (code, { rejectWithValue }) => {
  try {
    await applyActionCode(Auth, code)
  } catch (err) {
    const errCode = (err as ErrorType)?.code
    if (
      errCode === 'auth/expired-action-code' ||
      errCode === 'auth/invalid-action-code'
    ) {
      return rejectWithValue('EXPIRED')
    } else {
      return rejectWithValue('UNKNOWN')
    }
  }
})

export const updateName = createAsyncThunk<
  UserType,
  { name: string },
  { rejectValue: UserErrorType }
>('user/updateName', async ({ name }, { rejectWithValue }) => {
  try {
    const fireUser = Auth.currentUser
    if (fireUser) {
      await updateProfile(fireUser, { displayName: name })
      return fromUser({ ...fireUser, displayName: name })
    } else {
      return rejectWithValue('NOT_AUTHENTICATED')
    }
  } catch (err) {
    const errCode = (err as ErrorType)?.code
    if (errCode === 'auth/too-many-requests') {
      return rejectWithValue('TOO_MANY_REQUESTS')
    } else {
      return rejectWithValue('UNKNOWN')
    }
  }
})

export const logout = createAsyncThunk<void, void>('user/logout', async () => {
  await signOut(Auth)
})

type UserSliceType = {
  initiated: boolean
  user?: UserType
}
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    initiated: false,
    user: undefined,
  } as UserSliceType,
  reducers: {
    initiate: (_, { payload }: PayloadAction<UserType | undefined>) => ({
      initiated: true,
      user: payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          user: payload.user,
        }
      })
      .addCase(adminLogin.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          user: payload,
        }
      })
      .addCase(register.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          user: payload,
        }
      })
      .addCase(updateName.fulfilled, (_, { payload }) => {
        return {
          initiated: true,
          user: payload,
        }
      })
      .addCase(logout.fulfilled, () => {
        return {
          initiated: true,
          user: undefined,
        }
      })
  },
})

export const actions = userSlice.actions
export default userSlice.reducer
