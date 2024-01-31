'use client';

import React, { useEffect, useRef, useState } from 'react'
import { Breadcrumb, Devider, ListItem, List, FileView, FolderView, Properties, Modal, Navbar, Topbar } from '@components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setActionValue, setCurrDirectoryId, setCurrentSelection, setIsTookAction } from '@/app/store/slice';
import Api from 'AxiosInterceptor';
import { useParams, useRouter } from 'next/navigation';
import useClickOutside from '@/app/hooks/useClickOutside';
import MaterialSymbolIcon from 'MaterialSymbolIcon';
import Cookies from 'js-cookie';

const View: React.FC = () => {

  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentSelection, actionValue, isTookAction, isModalVisible } = useAppSelector(state => state.slice)
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("")
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [startId, setStartId] = useState<number | null>(null);
  const [startName, setStartName] = useState("");
  const [draggedItemType, setDraggedItemType] = useState<Object | null>(null)

  const [downloadLink, setDownloadLink] = useState("")
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });


  const onDragStart = (event: React.MouseEvent, index: number, id?: number, name?: string) => {
    if (!id || !name) return;

    setStartIndex(index);
    setStartId(id);
    setStartName(name)
    const draggedType = event.currentTarget.getAttribute("data-attr");
    setDraggedItemType(draggedType)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setStartIndex(null);
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
    setStartIndex(null)
  };

  const handleDoubleClick = (item: any) => {
    dispatch(setCurrDirectoryId(item.id));
    router.push(`${item.id}`)
  }

  useEffect(() => {
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const link = (event.target as HTMLDivElement).getAttribute('data-link') as string;

      setDownloadLink(link);
      setContextMenuVisible(true);
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
    };

    // const handleMenuItemClick = (menuItem) => {
    //   setContextMenuVisible(false);
    //   router.push(menuItem);
    // };

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
      const userIdString = Cookies.get('userId') as string;
      const userId = parseInt(userIdString)
      const folders = await Api.get(`/get_folder?directoryId=${params.id}&userId=${userId}`)
      const files = await Api.get(`/get_file?directoryId=${params.id}&userId=${userId}`)

      setFolders(folders.data)
      setFiles(files.data)
    })()
  }, [params.id, isTookAction])


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


  const folderRef = useRef(null);
  const fileRef = useRef(null);

  useClickOutside(folderRef, () => {
    dispatch(setCurrentSelection({ type: null, id: null }))
  });

  useClickOutside(fileRef, () => {
    dispatch(setCurrentSelection({ type: null, id: null }))
  });

  const onElementClick = (e: React.MouseEvent, item: { type: string, id: number }) => {
    const currentElement = { type: e.currentTarget.getAttribute('data-attr'), id: item.id };
    dispatch(setCurrentSelection(currentElement));
    dispatch(setActionValue(currentElement));
  }

  const deleteItem = async () => {
    try {
      let response;
      const id = actionValue.id
      if (!id) throw Error(`id not found`, id);

      if (actionValue.type === 'folder') {
        response = await Api.post(`/remove_folder`, { id });
      } else {
        response = await Api.post(`/remove_file`, { id })
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

          <List isVisible={contextMenuVisible} >
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
            ?.filter((item: { name: string, id: number }) => item?.name?.toLowerCase().includes(searchValue?.toLowerCase()))
            ?.map((item: { name: string, id: number }, index) => {
              return (
                <div
                  onDoubleClick={() => handleDoubleClick(item)}
                  onClick={(event) => onElementClick(event, item)}
                  key={index}
                  data-attr='folder'
                  data-idx={index}
                  ref={folderRef}
                  draggable
                  style={{
                    width: 243,
                    height: 50,
                    borderRadius: 14,
                    overflow: 'hidden',
                  }}
                  onDragStart={(event) => onDragStart(event, index, item.id, item.name)}
                  onDragOver={(event) => onDragOver(event)}
                  onDrop={(event) => onDrop(event, index, folders, setFolders, item)}
                >
                  {startIndex === index ?
                    <div style={{ opacity: 0.7 }}>
                      <FolderView title={item.name} bgColor={currentSelection.type === 'folder' && currentSelection.id === item.id ? "#c2e7ff" : "#f0f4f9"} />
                    </div>
                    :
                    <div>
                      <FolderView title={item.name} bgColor={currentSelection.type === 'folder' && currentSelection.id === item.id ? "#c2e7ff" : "#f0f4f9"} />
                    </div>
                  }
                </div>
              )
            })}
        </div>
        <div style={{ fontSize: 14, color: "#333", marginBlock: 20, fontWeight: 500 }}>Files</div>
        <div style={{
          display: "flex", gap: 16, flexWrap: 'wrap',
          transition: 'ease-out 0.3s all'
        }}>
          {files && files
            ?.filter((item: { name: string, id: number }) => item.name.toLowerCase().includes(searchValue?.toLowerCase()))
            ?.map((item: { name: string, id: number, path: string }, index: number) => (
              <div
                key={index}
                onClick={(event) => onElementClick(event, item)}
                ref={fileRef}
                draggable
                data-attr='file'
                data-idx={index}
                style={{ height: 230, width: 230 }}
                onDragStart={(event) => onDragStart(event, index, item.id, item.name)}
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrop(event, index, files, setFiles, item)}
              >
                {startIndex === index ?
                  <div style={{ height: '100%', opacity: 0.7 }}>
                    <FileView title={item.name} imgSrc={item.path} bgColor={currentSelection.type === 'file' && currentSelection.id === item.id ? "#c2e7ff" : "#f0f4f9"} />
                  </div>
                  :
                  <div style={{ height: '100%' }} >
                    <FileView title={item.name} imgSrc={item.path} bgColor={currentSelection.type === 'file' && currentSelection.id === item.id ? "#c2e7ff" : "#f0f4f9"} />
                  </div>
                }
              </div>

            ))}
        </div>
      </div >
    </>
  )
}

export default View;
