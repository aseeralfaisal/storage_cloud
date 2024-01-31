import React from 'react'
import styles from './Pill.module.css'

const Pill = () => {
  return (
    <div className={styles.pillWrapper}>
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false">
        <path d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2z"></path></svg>
      <span className={styles.pillText}>New</span>
    </div>
  )
}

export default Pill
