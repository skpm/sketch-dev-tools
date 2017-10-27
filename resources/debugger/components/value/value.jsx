import React from 'react'

import LogObject from './object'
import LogArray from './array'
import LogString from './string'
import LogNumber from './number'
import LogEmpty from './empty'

export default ({ value, logKey }) => {
  switch (value.primitive) {
    case 'Array':
      return (
        <LogArray array={value.value} logKey={logKey} prefix={value.type} />
      )

    case 'Number':
      return <LogNumber number={value.value} logKey={logKey} />

    case 'Empty':
      return <LogEmpty number={value.value} logKey={logKey} />

    case 'String':
      return <LogString string={String(value.value)} logKey={logKey} />

    case 'Mocha':
    case 'Object':
      return (
        <LogObject object={value.value} logKey={logKey} prefix={value.type} />
      )

    case 'Unknown':
    default:
      console.log(value.primitive || value)
      return (
        <LogString string={String(value.value)} logKey={logKey} />
      )
  }
}
