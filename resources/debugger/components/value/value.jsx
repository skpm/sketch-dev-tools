import React from 'react'

import LogObject from './object'
import LogArray from './array'
import LogString from './string'
import LogNumber from './number'
import LogEmpty from './empty'

export default ({ value, logKey, search }) => {
  switch (value.primitive) {
    case 'Array':
      return (
        <LogArray
          array={value.value}
          logKey={logKey}
          prefix={value.type}
          search={search}
        />
      )

    case 'Number':
      return <LogNumber number={value.value} logKey={logKey} search={search} />

    case 'Empty':
      return <LogEmpty number={value.value} logKey={logKey} search={search} />

    case 'String':
      return (
        <LogString
          string={String(value.value)}
          logKey={logKey}
          search={search}
        />
      )

    case 'Mocha':
    case 'Object':
      return (
        <LogObject
          object={value.value}
          logKey={logKey}
          prefix={value.type}
          search={search}
        />
      )

    case 'Unknown':
    default:
      console.log(value.primitive || value)
      return (
        <LogString
          string={String(value.value)}
          logKey={logKey}
          search={search}
        />
      )
  }
}
