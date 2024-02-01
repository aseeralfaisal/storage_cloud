import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button } from '@components';
import MaterialSymbolIcon from 'MaterialSymbolIcon';
import styles from './Properties.module.css';
import { PropertiesProps } from './Properties.type';
import { setIsModal, setModalInputValue, setModalType } from '@/app/store/slice';

const Properties: React.FC<PropertiesProps> = ({ removeItem, downloadMedia, clearSelection }) => {
  const dispatch = useAppDispatch();
  const actionValue = useAppSelector((state) => state.slice.actionValue);

  const openRenameModal = () => {
    dispatch(setModalType('update'))
    dispatch(setModalInputValue(`new ${actionValue.type} name`))
    dispatch(setIsModal(true))
  }

  return (
    <>
      {actionValue.type && actionValue.id ? (
        <div className={styles.selectedContainer}>
          <div className={styles.selectionInfo}>
            <div className={styles.actionBtn} onClick={clearSelection}>
              <MaterialSymbolIcon title="close" />
            </div>
            <span className={styles.selectionInfoText}>1 selected</span>
          </div>
          <div onClick={openRenameModal} className={styles.actionBtn} >
            <MaterialSymbolIcon title='Edit' />
          </div>
          <div className={styles.actionBtn} onClick={downloadMedia}>
            <MaterialSymbolIcon title='download' />
          </div>
          <div className={styles.actionBtn} onClick={removeItem}>
            <MaterialSymbolIcon title='delete' />
          </div>
        </div>
      ) : (
        <div className={styles.propertiesContainer}>
          <div className={styles.buttonsContainer}>
            <Button title="Type" height={30} textColor='#555' borderRadius={8}
              endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
            />
            <Button title="People" height={30} textColor='#555' borderRadius={8}
              endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
            />
            <Button title="Modified" height={30} textColor='#555' borderRadius={8}
              endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <MaterialSymbolIcon title='grid_view' size={22} />
            <MaterialSymbolIcon title='info' size={22} />
          </div>
        </div>
      )}
    </>
  );
};

export default Properties;

