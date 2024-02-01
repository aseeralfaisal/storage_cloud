import React from 'react'
import { MaterialSymbolIconProps } from './MaterialSymbolIcon.types'
import styles from './MaterialSymbolIcon.module.css'

const MaterialSymbolIcon: React.FC<MaterialSymbolIconProps> = ({ title, size = 22, enableHover = false, cursor = 'default' }) => {
  return (
    <span className={enableHover ? `material-symbols-outlined ${styles.icon}` : "material-symbols-outlined"}
      style={{ color: "rgb(60,64,67)", fontSize: size, cursor }}>
      {title}
    </span>
  )
}


export default MaterialSymbolIcon
