import React from 'react'
import styled from 'react-emotion'
import { LogKey, LogColon } from './log-element'

const LogValue = styled.span`
  user-select: auto;
`

export default function LogString({ logKey, string }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue>{JSON.stringify(string)}</LogValue>
    </span>
  )
}
