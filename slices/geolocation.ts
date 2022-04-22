import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Geolocation } from '../types/geolocation'

export const getGeoLocation = createAsyncThunk('geo_location', async () => {
  const response = await fetch('https://cloudflare-quic.com/b/headers')
  const data = await response.json()
  return data.headers['Cf-Ipcountry']
})

export const geoLocationSlice = createSlice({
  name: 'geo_location',
  initialState: {
    country_code: undefined,
  } as Geolocation,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getGeoLocation.fulfilled, (state, { payload }) => {
      return {
        country_code: payload,
      }
    })
  },
})

export const actions = geoLocationSlice.actions
export default geoLocationSlice.reducer
