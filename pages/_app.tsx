import 'styles/tailwind.css'
import 'styles/colors.scss'
import 'styles/globals.scss'
import 'styles/base.scss'
import 'styles/fonts.scss'

import type { AppProps } from 'next/app'
import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'

import { ToastProvider } from 'components/common/Toast'

import { Auth, fromUser } from 'util/fire'
import { init } from 'util/init'
import store, { useAppDispatch } from 'util/store'

import { actions } from 'slices/user'

import { getGeoLocation } from '../slices/geolocation'

init()

const AuthWrapper = ({
  children,
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    onAuthStateChanged(Auth, (updateUser) => {
      dispatch(actions.initiate(updateUser ? fromUser(updateUser) : undefined))
    })
    dispatch(getGeoLocation())
  }, [dispatch])

  return <>{children}</>
}

const theme = extendTheme({
  colors: {
    purple: {
      50: '#DFE0ED',
      100: '#C1C1DA',
      200: '#A2A3CA',
      300: '#8387B8',
      400: '#646BA6',
      500: '#435195',
      600: '#3A447B',
      700: '#2E3660',
      800: '#25294A',
      900: '#1C1E32',
      1000: '#15131C',
    },
    black: {
      50: '#969694',
      100: '#81827F',
      200: '#6C6C6A',
      300: '#565656',
      400: '#424340',
      500: '#2F2D2B',
      600: '#282926',
      700: '#242522',
      800: '#1F201D',
      900: '#1C1C19',
      1000: '#161616',
    },
    white: {
      50: '#FFFFFF',
      100: '#FAFAFA',
      200: '#EBEBEB',
      300: '#D4D4D4',
      400: '#B2B2B2',
      500: '#8E8E8E',
      600: '#757575',
      700: '#515151',
      800: '#343434',
      900: '#191919',
      1000: '#000000',
    },
  },
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ToastProvider>
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        </ToastProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default App
