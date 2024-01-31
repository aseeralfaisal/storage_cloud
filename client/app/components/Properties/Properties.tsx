import React from 'react'
import Button from '../Button/Button'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'

const Properties = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBlock: 20 }}>
        <Button title="Type" height={30} textColor='#555' borderRadius={8}
          endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
        />
        <Button title="People" height={30} textColor='#555' borderRadius={8}
          endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
        />

        <Button title="Modified" height={30} textColor='#555' borderRadius={8}
          endIcon={<MaterialSymbolIcon title='arrow_drop_down' />}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <MaterialSymbolIcon title='grid_view' size={22} />
        <MaterialSymbolIcon title='info' size={22} />
      </div>
    </div>
  )
}

export default Properties
