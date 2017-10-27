import React from 'react'
import styled from 'react-emotion'
import { LogKey, LogColon } from './log-element'

const LogValue = styled.span`
  user-select: auto;
`

export default function LogNumber({ logKey, number }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue>{Number(number)}</LogValue>
    </span>
  )
}
