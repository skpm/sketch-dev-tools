import React from 'react'
import styled from 'react-emotion'
import { LogKey, LogColon, HighLighted } from './log-element'

const LogValue = styled.span`
  opacity: 0.5;
  color: inherit;
  font-style: italic;
  user-select: auto;
`

export function emptyAsString(value) {
  return value === undefined
    ? 'undefined'
    : Number.isNan(value) ? 'NaN' : 'null'
}

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
        <HighLighted search={search} value={emptyAsString(value)} />
      </LogValue>
    </span>
  )
}
