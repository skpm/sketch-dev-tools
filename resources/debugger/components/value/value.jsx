import React from 'react'
import PropTypes from 'prop-types'

import LogObject from './object'
import LogArray from './array'
import LogString from './string'
import LogNumber from './number'
import LogEmpty from './empty'
import LogError from './error'

export default function Value({ value, logKey, search }) {
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
      return <LogEmpty value={value.value} logKey={logKey} search={search} />

    case 'Date':
    case 'RegExp':
    case 'Function':
    case 'Buffer':
    case 'Symbol':
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
      if (value.type === 'NSException') {
        return <LogError error={value.value} logKey={logKey} search={search} />
      }
      return (
        <LogObject
          object={value.value}
          logKey={logKey}
          prefix={value.type}
          search={search}
        />
      )

    case 'Error':
      return <LogError error={value.value} logKey={logKey} search={search} />

    case 'Unknown':
    default:
      console.log('unknown value: ', value)
      return (
        <LogString
          string={JSON.stringify(String(value.value))}
          logKey={logKey}
          search={search}
        />
      )
  }
}

Value.propTypes = {
  search: PropTypes.string,
  logKey: PropTypes.string,
  value: PropTypes.shape({
    primitive: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
}
