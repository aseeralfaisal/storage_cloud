import { createSlice } from '@reduxjs/toolkit'

export const Slice = createSlice({
  name: 'slice',
  initialState: {
    isModal: false,
    currDirectoryId: 0,
    isContextMenu: false,
    isTookAction: false,
    currentSelection: { type: null, id: null },
    actionValue: { type: null, id: null }
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
    },
    setCurrentSelection: (state, action) => {
      state.currentSelection = action.payload
    },
    setActionValue: (state, action) => {
      state.actionValue = action.payload
    }
  }
});

export const { setIsModal, setCurrDirectoryId, setIsContextMenu, setIsTookAction, setCurrentSelection, setActionValue } = Slice.actions

