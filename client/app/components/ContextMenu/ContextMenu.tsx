import React, { useRef } from 'react'
import List from '../List/List'
import ListItem from '../ListItem/ListItem'
import Devider from '../Devider/Devider'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import useClickOutside from '@/app/hooks/useClickOutside'
import { setIsContextMenu } from '@/app/store/slice'

const ContextMenu = () => {
  const isContextMenu = useAppSelector(state => state.slice.isContextMenu);
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    dispatch(setIsContextMenu(false))
  });

  return (
    <div ref={menuRef}>
      <List isVisible={isContextMenu}>
        <ListItem iconTitle='create_new_folder' text='New folder' type="new_folder" />
        <Devider />
        <ListItem iconTitle='file_upload' text='File Upload' type="file_upload" />
        <ListItem iconTitle='drive_folder_upload' text='Folder Upload' type="folder_upload" />
        <Devider />
        <ListItem isMaterialIcon={false}
          imageSrc="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
          text="Google Docs" />
        <ListItem isMaterialIcon={false}
          imageSrc="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
          text="Google Sheets" />
        <ListItem isMaterialIcon={false}
          imageSrc="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png"
          text="Google Slides" />
        <ListItem isMaterialIcon={false}
          imageSrc="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_form_x16.png"
          text="Google Forms" />
        <ListItem text="More" />
      </List>
    </div>
  )
}

export default ContextMenu
