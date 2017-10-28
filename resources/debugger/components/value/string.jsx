import React from 'react'
import styled from 'react-emotion'
import { LogKey, LogColon, HighLighted } from './log-element'

const LogValue = styled.span`
  user-select: auto;
`

export default function LogString({ logKey, string, search }) {
  return (
    <span>
      {logKey && (
        <span>
          <LogKey>{logKey}</LogKey>
          <LogColon>: </LogColon>
        </span>
      )}
      <LogValue><HighLighted search={search} value={JSON.stringify(string)} /></LogValue>
    </span>
  )
}
