import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'

import geo_location from 'slices/geolocation'
import profile from 'slices/profile'
import user from 'slices/user'

import { adminApi } from 'services/admin'
import { mainApi } from 'services/main'

import { isDev } from './env'

const logger = createLogger({})

const rootReducer = combineReducers({
  user,
  profile,
  geo_location,
  [mainApi.reducerPath]: mainApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
})
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = [mainApi.middleware, adminApi.middleware]
    if (isDev) {
      middlewares.push(logger)
    }
    return getDefaultMiddleware().concat(middlewares)
  },
  devTools: isDev,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
