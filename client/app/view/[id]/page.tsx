'use client';

import React, { useEffect, useRef, useState } from 'react'
import { Breadcrumb, Devider, ListItem, List, FileView, FolderView, Properties, Modal, Navbar, Topbar } from '@components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setActionValue, setFolderId, setCurrentSelection, setIsTookAction, setFolders } from '@/app/store/slice';
import Api from 'AxiosInterceptor';
import { useParams, useRouter } from 'next/navigation';
import useClickOutside from '@/app/hooks/useClickOutside';
import Cookies from 'js-cookie';

const View: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentSelection, actionValue, isTookAction, isModalVisible, folders } = useAppSelector(state => state.slice)
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("")
  const [files, setFiles] = useState([]);

  const [startId, setStartId] = useState<number | null>(null);
  const [startName, setStartName] = useState("");
  const [draggedItemType, setDraggedItemType] = useState<Object | null>(null)

  const [downloadLink, setDownloadLink] = useState("")
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const contextMenuRef = useRef(null);
  const folderRef = useRef(null);
  const fileRef = useRef(null);

  useClickOutside(contextMenuRef, () => closeContextMenu());

  useClickOutside(folderRef, () => {
    dispatch(setCurrentSelection({ type: null, id: null }))
  });

  useClickOutside(fileRef, () => {
    dispatch(setCurrentSelection({ type: null, id: null }))
  });

  const onDragStart = (event: React.MouseEvent, index: number, id?: number, name?: string) => {
    if (!id || !name) return;

    setStartIndex(index);
    setStartId(id);
    setStartName(name)
    const draggedItemType = event.currentTarget.getAttribute("data-attr");
    // setting drag type as folder or file
    setDraggedItemType(draggedItemType)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setStartIndex(null);
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>, newIndex: number, data: any, setData: any, item: any) => {
    event.preventDefault();
    if (startIndex) {
      const newData = [...data];
      const prevItem = newData[startIndex];
      newData[startIndex] = newData[newIndex];
      newData[newIndex] = prevItem;
      setData(newData);
    }

    const postData = {
      id: startId,
      name: startName,
      directoryId: +item.id,
      parentId: +item.id
    }
    console.log("dropped")
    console.log(postData)
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
    }

    dispatch(setIsTookAction(!isTookAction));
    setStartIndex(null)
  };

  useEffect(() => {
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const link = (event.target as HTMLDivElement).getAttribute('data-link') as string;

      setDownloadLink(link);
      setContextMenuVisible(true);
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
    };

    //@ts-ignore
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      //@ts-ignore
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [router]);

  const closeContextMenu = () => setContextMenuVisible(false);

  useEffect(() => {
    (async () => {
      const userIdString = Cookies.get('userId') as string;
      const userId = parseInt(userIdString)
      const folderApiUrl = `/get_folder_path?folderId=${params.id}&userId=${userId}`
      const fileApiUrl = `/get_file?directoryId=${params.id}&userId=${userId}`
      const folders = await Api.get(folderApiUrl)
      const files = await Api.get(fileApiUrl)

      let folderList
      if (+params.id === 0) {
        folderList = folders.data
      } else {
        folderList = folders.data[0].children || []
      }
      dispatch(setFolders(folderList));
      setFiles(files.data)
    })()
  }, [params.id, isTookAction, router])

  const downloadMedia = (url: string): any => {
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

  const onElementClick = (e: React.MouseEvent, item: { type: string, id: number, name?: string }) => {
    const currentElement = { type: e.currentTarget.getAttribute('data-attr'), id: item.id };
    const actionElement = { type: e.currentTarget.getAttribute('data-attr'), id: item.id, name: item.name };
    dispatch(setCurrentSelection(currentElement));
    dispatch(setActionValue(actionElement));
  }

  const handleDoubleClick = (item: any) => {
    dispatch(setFolderId(item.id));
    dispatch(setActionValue({ type: item.type, name: item.name, id: item.id }));
    router.push(`${item.id}`)
  }

  const clearSelection = () => {
    dispatch(setCurrentSelection({ type: null, id: null }));
    dispatch(setActionValue({ type: null, id: null }));
  };

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
        clearSelection();
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

      {/* @ts-ignore */}
      <Modal visible={isModalVisible} />
      <div style={{ marginBlock: 30, marginLeft: 280, marginRight: 30 }}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <Breadcrumb />
        </div>
        {/*@ts-ignore*/}
        <Properties removeItem={deleteItem} downloadFile={downloadMedia} clearSelection={clearSelection} />
        <div style={{ fontSize: 14, color: "#333", marginBlock: 20, fontWeight: 500 }}>Folders</div>
        <div
          style={{
            display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
            transition: 'ease-out 0.3s all'
          }}>
          {folders && folders
            ?.filter((item: { name: string, id: number }) => item?.name?.toLowerCase().includes(searchValue?.toLowerCase()))
            ?.map((item: { name: string, id: number }, index: number) => {
              return (
                <div
                  onDoubleClick={() => handleDoubleClick(item)}
                  /* @ts-ignore */
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
                /* @ts-ignore */
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
