import { createSlice } from '@reduxjs/toolkit'

export const Slice = createSlice({
  name: 'slice',
  initialState: {
    isModal: false,
    folderId: 0,
    folders: [],
    isContextMenu: false,
    isTookAction: false,
    currentSelection: { type: null, id: null },
    actionValue: { type: null, id: null, name: null },
    modalType: 'create',
    modalInputValue: "Untitled folder",
    currentBreadcrumbFolder: null,
    userMenuVisible: false,
    profileImgSrc: null,
    breadCrumbList: [""]
  },
  reducers: {
    setIsModal: (state, action) => {
      state.isModal = action.payload
    },
    setFolderId: (state, action) => {
      state.folderId = action.payload;
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
    },
    setFolders: (state, action) => {
      state.folders = action.payload
    },
    setModalType: (state, action) => {
      state.modalType = action.payload
    },
    setModalInputValue: (state, action) => {
      state.modalInputValue = action.payload
    },
    setCurrrentBreadcrumbFolder: (state, action) => {
      state.currentBreadcrumbFolder = action.payload
    },
    toggleUserMenu: (state, action) => {
      state.userMenuVisible = action.payload
    },
    setProfileImgSrc: (state, action) => {
      state.profileImgSrc = action.payload
    },
    setBreadCrumbList: (state, action) => {
      if (action.payload === null) return
      state.breadCrumbList = Array.from(new Set([...state.breadCrumbList, action.payload]));
    }
  }
});

export const {
  setIsModal,
  setFolderId,
  setIsContextMenu,
  setIsTookAction,
  setCurrentSelection,
  setActionValue,
  setBreadCrumbList,
  setCurrrentBreadcrumbFolder,
  setFolders,
  setModalType,
  setModalInputValue,
  toggleUserMenu,
  setProfileImgSrc
} = Slice.actions

