import React from 'react'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'
import { FileViewProps } from './FileView.types'

const FileView: React.FC<FileViewProps> = ({ title, imgSrc = "" }) => {
  return (

    <div data-link={imgSrc} style={{
      backgroundColor: "#f0f4f9", display: 'grid', justifyContent: 'center',
      borderRadius: 16, height: 230, width: 230
    }}>
      <div data-link={imgSrc} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <MaterialSymbolIcon title='description' />
        <span style={{ fontSize: 14 }}>{title?.slice(0, 14)}...</span>
        <MaterialSymbolIcon title='more_vert' />
      </div>
      <img data-link={imgSrc} draggable={false} src={!title.includes("doc") ? imgSrc : "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x256.png"}
        alt='thumbnail' style={{ width: 210, height: 180, objectFit: !title.includes("doc") ? 'cover' : 'contain', borderRadius: 6 }} />
    </div>
  )
}

export default FileView
