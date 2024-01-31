import React from 'react'
import styles from './Button.module.css'
import { ButtonProps } from './Button.types'

const Button: React.FC<ButtonProps> = ({
  title, textColor = "#333333", borderRadius = 20,
  endIcon, width, height }) => {
  return (
    <button className={styles.container} style={{ color: textColor, borderRadius, width, height }}>
      {title}
      {endIcon}
    </button>
  )
}

export default Button
