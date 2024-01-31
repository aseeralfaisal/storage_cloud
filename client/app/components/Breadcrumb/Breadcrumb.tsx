import React from 'react'
import styles from './Breadcrumb.module.css'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'

const Breadcrumb = () => {
  return (
    <div className={styles.container}>
      <span className={styles.bradcrumbTitle}>My Drive</span>
      <MaterialSymbolIcon title='arrow_drop_down' />
    </div>
  )
}

export default Breadcrumb
