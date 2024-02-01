import React from 'react'
import styles from './Breadcrumb.module.css'
import MaterialSymbolIcon from 'MaterialSymbolIcon'
import { useAppSelector } from '@/app/store/hooks'

const Breadcrumb: React.FC = () => {

  const currentFolder = useAppSelector(state => state.slice.currentBreadcrumbFolder)

  return (
    <div className={styles.container}>
      <span className={styles.bradcrumbTitle}>My Drive</span>
      <MaterialSymbolIcon title='chevron_right' />
      {currentFolder &&
        <>
          <span className={styles.bradcrumbTitle}>{currentFolder}</span>
          <MaterialSymbolIcon title='arrow_drop_down' />
        </>
      }
    </div>
  )
}

export default Breadcrumb
