import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { LogKey, LogColon, HighLighted } from './log-element'

const LogValue = styled.span`
  user-select: auto;
`

export default function LogNumber({ logKey, number, search }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue>
        <HighLighted search={search} value={String(number)} />
      </LogValue>
    </span>
  )
}

LogNumber.propTypes = {
  search: PropTypes.string,
  logKey: PropTypes.string,
  number: PropTypes.number.isRequired,
}
