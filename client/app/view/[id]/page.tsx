'use client';

import React, { useEffect, useRef, useState } from 'react'
import { Navbar, Topbar } from '@/app/components'
import Modal from '@/app/components/Modal/Modal'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import Properties from '@/app/components/Properties/Properties'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setCurrDirectoryId, setIsTookAction } from '@/app/store/slice';
import FolderView from '@/app/components/FolderView/FolderView';
import FileView from '@/app/components/FileView/FileView';
import Api from '@/app/service/Api.interceptor';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useClickOutside from '@/app/hooks/useClickOutside';
import List from '@/app/components/List/List';
import ListItem from '@/app/components/ListItem/ListItem';
import Devider from '@/app/components/Devider/Devider';
import MaterialSymbolIcon from '@/app/components/MaterialSymbolIcon/MaterialSymbolIcon';

const View: React.FC = () => {

  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isTookAction = useAppSelector(state => state.slice.isTookAction)

  const isModalVisible = useAppSelector((state) => state.slice.isModal)
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("")
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({})

  const [startId, setStartId] = useState(null);
  const [startName, setStartName] = useState("");
  const [draggedItemType, setDraggedItemType] = useState("")

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });


  const onDragStart = (event: EventHandler, index: number, id?: number, name?: string) => {
    setStartIndex(index);
    setStartId(id);
    setStartName(name)
    const draggedType = event.currentTarget.getAttribute("data-attr");
    setDraggedItemType(draggedType)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>, newIndex: number, data: any, setData: any, item: any) => {
    event.preventDefault();
    if (startIndex === null) return;

    const postData = {
      id: startId,
      name: startName,
      directoryId: +item.id
    }
    const dropType = event.currentTarget.getAttribute("data-attr");

    if (dropType === 'folder' && draggedItemType === 'folder') {
      const res = await Api.post("/update_folder", postData)
      if (res.status === 200) {
        console.log(res.data)
      }
    } else if (dropType === 'folder' && draggedItemType === 'file') {
      const res = await Api.post("/update_file", postData)
      if (res.status === 200) {
        console.log(res.data)
      }
    } else {
      const newData = [...data];
      const prevItem = newData[startIndex];
      newData[startIndex] = newData[newIndex];
      newData[newIndex] = prevItem;
      setData(newData);
    }
    dispatch(setIsTookAction(!isTookAction));
  };

  const handleDoubleClick = (item: any) => {
    dispatch(setCurrDirectoryId(item.id));
    router.push(`${item.id}`)
  }

  const [downloadLink, setDownloadLink] = useState("")
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();

      setDownloadLink(e.target.getAttribute('data-link'));
      setContextMenuVisible(true);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMenuItemClick = (menuItem) => {
      setContextMenuVisible(false);
      router.push(menuItem);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [router]);

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };


  useEffect(() => {
    (async () => {
      const folders = await Api.get(`/get_folder?directoryId=${params.id}`)
      const files = await Api.get(`/get_file?directoryId=${params.id}`)

      setFolders(folders.data)
      setFiles(files.data)
    })()
  }, [params.id, isTookAction])

  const onElementClick = (e: any, item: any) => {
    const type = { type: e.currentTarget.getAttribute('data-attr'), id: item.id };
    setCurrentSelection(type)
    console.log(type)
  }

  const contextMenuRef = useRef(null);
  useClickOutside(contextMenuRef, () => closeContextMenu());

  const downloadMedia = (url: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async () => {
    try {
      let response;
      console.log(currentSelection)
      if (currentSelection.type === 'folder') {
        response = await Api.post(`/remove_folder`, {
          id: currentSelection.id
        });
      } else {
        response = await Api.post(`/remove_file`, {
          id: currentSelection.id
        })
      }
      if (response.status === 200) {
        dispatch(setIsTookAction(!isTookAction))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            padding: '5px',
            zIndex: 9999,
          }}
          onClick={closeContextMenu}
        >

          <List isVisible={contextMenuRef}>
            <div onClick={() => downloadMedia(downloadLink)}>
              <ListItem iconTitle='download' text='Download' type="file_upload" />
            </div>
            <Devider />
            <ListItem iconTitle='edit' text='Rename' type="folder_upload" />
            <ListItem iconTitle='info' text='File Information' type="folder_upload" />
            <Devider />

            <div>
              <ListItem iconTitle='delete' text='Move to trash' type="folder_upload" />
            </div>
          </List>
        </div >
      )}
      <Topbar searchValue={searchValue} setSearchValue={setSearchValue} />
      <Navbar />

      <Modal visible={isModalVisible} />
      <div style={{ marginBlock: 30, marginLeft: 280, marginRight: 30 }}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <Breadcrumb />
        </div>
        <Properties />
        <div style={{
          width: '100%', backgroundColor: "#f0f4f9", height: 30, borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 10, padding: 20
        }}>
          <MaterialSymbolIcon title='download' />
          <div onClick={deleteItem}>
            <MaterialSymbolIcon title='delete' />
          </div>
        </div>
        <div style={{ fontSize: 14, color: "#333", marginBlock: 20, fontWeight: 500 }}>Folders</div>
        <div
          style={{
            display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
            transition: 'ease-out 0.3s all'
          }}>
          {folders && folders
            ?.filter(item => item?.name?.toLowerCase().includes(searchValue?.toLowerCase()))
            ?.map((item, index) => {
              return (<div
                onDoubleClick={() => handleDoubleClick(item)}
                onClick={(event) => onElementClick(event, item)}
                key={index}
                data-attr='folder'
                draggable
                onDragStart={(event) => onDragStart(event, index, item?.id, item?.name)}
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrop(event, index, folders, setFolders, item)}
              >
                <FolderView title={item?.name} />
              </div>
              )
            })}
        </div>
        <div style={{ fontSize: 14, color: "#333", marginBlock: 20, fontWeight: 500 }}>Files</div>
        <div style={{
          display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          transition: 'ease-out 0.3s all'
        }}>
          {files && files
            ?.filter(item => item?.name?.toLowerCase().includes(searchValue?.toLowerCase()))
            ?.map((item, index) => (
              <div
                key={index}
                onClick={(event) => onElementClick(event, item)}
                draggable
                data-attr='file'
                onDragStart={(event) => onDragStart(event, index, item?.id, item?.name)}
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrop(event, index, files, setFiles, item)}
              >

                <FileView title={item?.name} imgSrc={item.path} />
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default View;
