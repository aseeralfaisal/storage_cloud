import { createSlice } from '@reduxjs/toolkit'

export const Slice = createSlice({
  name: 'slice',
  initialState: {
    isModal: false,
    currDirectoryId: 1,
    isContextMenu: false,
    isTookAction: false
  },
  reducers: {
    setIsModal: (state, action) => {
      state.isModal = action.payload
    },
    setCurrDirectoryId: (state, action) => {
      state.currDirectoryId = action.payload;
    },
    setIsContextMenu: (state, action) => {
      state.isContextMenu = action.payload;
    },
    setIsTookAction: (state, action) => {
      state.isTookAction = action.payload
    }
  },
})

export const { setIsModal, setCurrDirectoryId, setIsContextMenu, setIsTookAction } = Slice.actions

