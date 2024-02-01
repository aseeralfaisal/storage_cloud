import styles from './Topbar.module.css'
import MaterialSymbolIcon from 'MaterialSymbolIcon'
import { TopbarProps } from './Topbar.types'
import { InputField, UserMenu } from '@components'
import { toggleUserMenu } from '@/app/store/slice'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'

const Topbar: React.FC<TopbarProps> = ({ searchValue, setSearchValue }) => {
  const dispatch = useAppDispatch()
  const profileImgSrc = useAppSelector(state => state.slice.profileImgSrc)
  const toggleUserMenuEvent = () => dispatch(toggleUserMenu(true))

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
        style={{ display: 'flex', gap: 5, userSelect: 'none' }}>
        <MaterialSymbolIcon enableHover cursor='pointer' title='offline_pin' size={26} />
        <MaterialSymbolIcon enableHover cursor='pointer' title='help' size={26} />
        <MaterialSymbolIcon enableHover cursor='pointer' title='settings' size={26} />
        <MaterialSymbolIcon enableHover cursor='pointer' title='apps' size={26} />
        <div onClick={toggleUserMenuEvent}>
          {
            profileImgSrc ?
              <div className={styles.profilePictureContainer}>
                <img src={profileImgSrc} style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: '50% ' }} />
              </div>
              :
              <>
                <MaterialSymbolIcon enableHover cursor='pointer' title='account_circle' size={26} />
              </>
          }
          <UserMenu />
        </div>
      </div>
    </div>
  )
}

export default Topbar
