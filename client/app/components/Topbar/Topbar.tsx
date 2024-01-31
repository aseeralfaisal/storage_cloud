import React, { useState } from 'react'
import styles from './Topbar.module.css'
import InputField from '../InputField/InputField'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'
import { TopbarProps } from './Topbar.types'
import UserMenu from '../UserMenu/UserMenu'

const Topbar: React.FC<TopbarProps> = ({ searchValue, setSearchValue }) => {

  const [isMenu, setIsMenu] = useState(false)
  const userMenu = () => {
    setIsMenu(!isMenu)
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'inline-flex', gap: 140, width: 300 }}>
        <div className={styles.dlogo}>
          <img style={{ width: 40, height: 40 }} src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" />
          <label className={styles.driveLabel}>Drive</label>
        </div>
        <div>
          <InputField value={searchValue} setValue={setSearchValue} />
        </div>
      </div>
      <div
        style={{ display: 'flex', gap: 20 }}>
        <MaterialSymbolIcon title='offline_pin' size={26} />
        <MaterialSymbolIcon title='help' size={26} />
        <MaterialSymbolIcon title='settings' size={26} />
        <MaterialSymbolIcon title='apps' size={26} />
        <div onClick={userMenu}>
          <MaterialSymbolIcon title='account_circle' size={26} />
          {isMenu && <UserMenu />}
        </div>
      </div>
    </div>
  )
}

export default Topbar
