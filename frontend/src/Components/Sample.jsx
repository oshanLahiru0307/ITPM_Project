import React from 'react'
import {Button, message} from 'antd'

const Sample = () => {

    const handlClick = ()=> {
        message.success("Hello World!!!")
    }
  return (
    <div>
        <Button type='primary' onClick={handlClick}>Click here</Button>
    </div>
  )
}

export default Sample
