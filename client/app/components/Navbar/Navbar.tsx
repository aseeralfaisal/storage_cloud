import React, { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
import MaterialSymbolIcon from 'MaterialSymbolIcon'
import Api from 'AxiosInterceptor'
import { ContextMenu, Pill, Button } from '@components'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setIsContextMenu } from '@/app/store/slice'

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const contextMenuRef = useRef(null);
  const isContextMenu = useAppSelector(state => state.slice.isContextMenu)

  const [usageSize, setUsageSize] = useState(null)
  useEffect(() => {
    (async () => {
      const resp = await Api.get("/storage_size")
      setUsageSize(resp.data)
    })()
  }, [])

  const openContextMenu = () => {
    dispatch(setIsContextMenu(!isContextMenu))
  }

  const totalSizeMB = (parseInt((usageSize as any)?.totalSizeMB) || 0).toFixed(2);

  return (
    <div className={styles.navbarWrapper}>
      <div style={{ margin: "18px 2px" }} onClick={openContextMenu}>
        <Pill />
      </div>
      <div ref={contextMenuRef}>
        <ContextMenu />
      </div>


      <div className={styles.navItem}>
        <MaterialSymbolIcon title="Home" />
        <span className={styles.navText}>Home</span>
      </div>

      <div className={styles.navItem}>
        <MaterialSymbolIcon title='devices' />
        <span className={styles.navText}>My Drive</span>
      </div>


      <div className={styles.navItem}>
        <MaterialSymbolIcon title='computer' />
        <span className={styles.navText}>Computers</span>
      </div>

      <div className={styles.navItem} style={{ marginTop: 16 }}>
        <MaterialSymbolIcon title='group' />
        <span className={styles.navText}>Shared with me</span>
      </div>

      <div className={styles.navItem}>
        <MaterialSymbolIcon title='schedule' />
        <span className={styles.navText}>Recent</span>
      </div>

      <div className={styles.navItem}>
        <MaterialSymbolIcon title='star' />
        <span className={styles.navText}>Starred</span>
      </div>

      <div className={styles.navItem} style={{ marginTop: 16 }}>
        <MaterialSymbolIcon title='info' />
        <span className={styles.navText}>Spam</span>
      </div>

      <div className={styles.navItem}>
        <MaterialSymbolIcon title='delete' />
        <span className={styles.navText}>Trash</span>
      </div>

      <div className={styles.navItem}>
        <MaterialSymbolIcon title='cloud' />
        <span className={styles.navText}>Storage</span>
      </div>

      <div style={{ display: 'block', margin: "8px 14px" }}>
        <progress value={totalSizeMB} max={1024} style={{ height: 12 }} />
        <div>
          <span style={{ fontSize: 14, color: "#333" }}>{totalSizeMB} MB of 1024 MB used </span>
        </div>
      </div>

      <div style={{ margin: 15 }}>
        <Button title="Get more storage" textColor='#0b57d0' />
      </div>
    </div>
  )
}

export default Navbar
