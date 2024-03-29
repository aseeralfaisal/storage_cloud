
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setIsModal, setIsTookAction, setModalInputValue } from '@/app/store/slice';
import { useParams } from 'next/navigation';
import Api from 'AxiosInterceptor';
import Cookies from 'js-cookie';

const Modal: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isTookAction, isModal, actionValue, modalType, modalInputValue } = useAppSelector(state => state.slice)

  const createFolder = async () => {
    try {
      const userIdString = Cookies.get("userId") as string;
      const userId = parseInt(userIdString);
      const paramsIdString = params.id as string;
      const directoryId = parseInt(paramsIdString)
      const name = modalInputValue
      if (!userId) return;

      if (modalType === 'create') {
        await Api.post("/create_folder", {
          name,
          userId,
          directoryId,
          path: paramsIdString,
          parentId: +params.id === 0 ? null : +params.id
        })
        dispatch(setIsModal(false))
        dispatch(setIsTookAction(!isTookAction))
      } else if (modalType === 'update') {
        if (actionValue.type === 'file') {
          await Api.post("/update_file", {
            id: actionValue.id,
            name,
          })
        } else {
          await Api.post("/update_folder", {
            id: actionValue.id,
            name,
          })
        }
        dispatch(setIsModal(false))
        dispatch(setIsTookAction(!isTookAction))
      }
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
      display: isModal ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
    }} >
      <div style={{
        backgroundColor: "#fff", width: 340, height: 200, boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)", borderRadius: 8,

      }}>
        <div style={{ margin: 25 }}>
          <span style={{ fontSize: 26 }}>New folder</span>
          <input value={modalInputValue} onChange={(e) => dispatch(setModalInputValue(e.target.value))} style={{ marginBlock: 20, padding: "10px 20px", width: '100%', fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginInline: 30 }}>
          <span style={{ color: "#115bd1", fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={() => dispatch(setIsModal(false))}>Cancel</span>
          <span style={{ color: "#115bd1", fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={createFolder}> {modalType === 'update' ? "OK" : "Create"}</span>
        </div>
      </div>
    </div >
  );
}

export default Modal;

