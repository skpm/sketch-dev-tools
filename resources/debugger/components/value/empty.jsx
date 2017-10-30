import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { LogKey, LogColon, HighLighted } from './log-element'

const LogValue = styled.span`
  opacity: 0.5;
  color: inherit;
  font-style: italic;
  user-select: auto;
`

export default function LogEmpty({ logKey, value, search }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue>
        <HighLighted search={search} value={value} />
      </LogValue>
    </span>
  )
}

LogEmpty.propTypes = {
  search: PropTypes.string,
  logKey: PropTypes.string,
  value: PropTypes.string,
}
