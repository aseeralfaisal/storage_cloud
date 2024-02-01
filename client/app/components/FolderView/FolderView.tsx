import React from 'react'
import { FolderViewProps } from './FolderView.types'
import styles from './FolderView.module.css'
import Icon from 'MaterialSymbolIcon'

const FolderView: React.FC<FolderViewProps> = ({ title, bgColor }) => {
  return (
    <div className={styles.container} style={{ backgroundColor: bgColor }} draggable={false}>
      <div draggable={false} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', gap: 10 }}>
        <svg focusable="false" viewBox="0 0 24 24" height="24px" width="24px" fill="#5f6368" className="a-s-fa-Ha-pa"><g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g></svg>
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          {title}
        </span>
      </div>
      <Icon title="more_vert" />
    </div>
  )
}

export default FolderView
