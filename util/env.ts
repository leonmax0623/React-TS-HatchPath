export const isDev = process.env.NODE_ENV === 'development'
export const isRemote = !isDev || process.env.NEXT_PUBLIC_USE_REMOTE === 'true'
export const isStaging = process.env.NEXT_PUBLIC_MODE === 'staging'
export const isAdmin = process.env.NEXT_PUBLIC_ADMIN === 'true'

export const firebaseKey = process.env.NEXT_PUBLIC_FIREBASE_API
