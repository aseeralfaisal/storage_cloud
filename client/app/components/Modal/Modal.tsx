
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setIsContextMenu, setIsModal, setIsTookAction } from '@/app/store/slice';
import React, { useEffect, useState } from 'react';
import { ModalProps } from './Modal.type';
import { useParams } from 'next/navigation';
import Api from '@/app/service/Api.interceptor';

const Modal: React.FC<ModalProps> = ({ visible }) => {
  const params = useParams();
  const [val, setInput] = useState("Untitled folder");
  const dispatch = useAppDispatch();
  const isTookAction = useAppSelector(state => state.slice.isTookAction)

  useEffect(() => {
    dispatch(setIsContextMenu(false))
  }, [])

  const createFolder = async () => {
    try {
      await Api.post("/create_folder", {
        name: val,
        path: params.id,
        ownerId: 1,
        directoryId: params.id
      })
      dispatch(setIsModal(false))
      dispatch(setIsTookAction(!isTookAction))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{
      backgroundColor: '#00000066',
      position: 'fixed',
      top: 0,
      zIndex: 1000,
      left: 0,
      width: '100%',
      height: '100%',
      display: visible ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
    }} >
      <div style={{
        backgroundColor: "#fff", width: 340, height: 200, boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)", borderRadius: 8,

      }}>
        <div style={{ margin: 25 }}>
          <span style={{ fontSize: 26 }}>New folder</span>
          <input value={val} onChange={(e) => setInput(e.target.value)} style={{ marginBlock: 20, padding: "10px 20px", width: '100%', fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginInline: 30 }}>
          <span style={{ color: "#115bd1", fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={() => dispatch(setIsModal(false))}>Cancel</span>
          <span style={{ color: "#115bd1", fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={createFolder}>Create</span>
        </div>
      </div>
    </div >
  );
}

export default Modal;

