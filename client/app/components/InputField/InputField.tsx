import React from 'react'
import styles from './InputField.module.css'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'
import { InputFieldProps } from './InputField.type'

const InputField: React.FC<InputFieldProps> = ({ value, setValue }) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <div style={{ display: 'flex', width: "100%" }}>
        <MaterialSymbolIcon title='search' size={24} />
        <input className={styles.input} placeholder='Search in Drive' value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <MaterialSymbolIcon title='tune' size={24} />
    </div>
  )
}

export default InputField
