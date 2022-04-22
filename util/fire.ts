/* eslint-disable import/no-duplicates */
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

import { UserType } from 'types/user'

import { firebaseKey, isStaging } from './env'
import log from './log'

const config = isStaging
  ? {
      apiKey: firebaseKey,
      authDomain: 'hatchpath-staging.firebaseapp.com',
      databaseURL: 'https://hatchpath-staging-default-rtdb.firebaseio.com',
      projectId: 'hatchpath-staging',
      storageBucket: 'hatchpath-staging.appspot.com',
      messagingSenderId: '861104487411',
      appId: '1:861104487411:web:fe70fa6fd8dd73c067b086',
      measurementId: 'G-XQTCTPPP6E',
    }
  : {
      apiKey: firebaseKey,
      authDomain: 'hatchpath-prod.firebaseapp.com',
      databaseURL: 'https://hatchpath-prod-default-rtdb.firebaseio.com',
      projectId: 'hatchpath-prod',
      storageBucket: 'hatchpath-prod.appspot.com',
      messagingSenderId: '1003996497713',
      appId: '1:1003996497713:web:e9293d84d4a1ff88c35210',
      measurementId: 'G-VMRS8LGZ6B',
    }

const apps = getApps()

if (apps.length <= 0) {
  log.info('initialized firebase')
  initializeApp(config)
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_REMOTE !== 'true'
  ) {
    log.info('firebase in local mode')

    connectAuthEmulator(getAuth(), 'http://localhost:9099')
    connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
    connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
    connectStorageEmulator(getStorage(), 'localhost', 9199)
  }
}

export const fromUser = (user: {
  uid: string
  email: string | null
  displayName: string | null
  emailVerified: boolean | null
}): UserType => ({
  id: user.uid,
  email: user.email || '',
  name: user.displayName || '',
  isEmailVerified: user.emailVerified || false,
})

export const callFunction = async (
  func: string,
  method: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  const callable = httpsCallable(getFunctions(), func)
  const parameters = { method, body }
  log.info('calling function', parameters)
  const response = await callable(parameters)
  log.info('function response', response)
  return response.data as Record<string, unknown>
}

export const Auth = getAuth()
export const Functions = getFunctions()
export const Firestore = getFirestore()
export const Storage = getStorage()
