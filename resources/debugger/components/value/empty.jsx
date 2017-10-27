import React from 'react'
import styled from 'react-emotion'
import { LogKey, LogColon } from './log-element'

const LogValue = styled.span`
  opacity: 0.5;
  color: inherit;
  font-style: italic;
  user-select: auto;
`

export default function LogEmpty({ logKey, value }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue>
        {value === undefined
          ? 'undefined'
          : Number.isNan(value) ? 'NaN' : 'null'}
      </LogValue>
    </span>
  )
}
