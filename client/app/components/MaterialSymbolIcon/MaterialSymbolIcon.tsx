import React from 'react'
import { MaterialSymbolIconProps } from './MaterialSymbolIcon.types'

const MaterialSymbolIcon: React.FC<MaterialSymbolIconProps> = ({ title, size = 22 }) => {
  return (
    <span className="material-symbols-outlined" style={{ color: "rgb(60,64,67)", fontSize: size, cursor: "default" }}>
      {title}
    </span>
  )
}


export default MaterialSymbolIcon
