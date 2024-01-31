import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { Slice } from './slice'

const reducer = combineReducers({
  slice: Slice.reducer,
})

export const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

