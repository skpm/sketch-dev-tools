import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

export const LogKey = styled.span`
  color: #704cea;
  user-select: auto;
`

export const LogColon = styled.span`
  opacity: 0.5;
  font-style: italic;
`

export const LogValueType = styled.span`
  font-style: italic;
  user-select: auto;
`

export const LogValueLength = styled.span`
  font-style: italic;
  opacity: 0.5;
  user-select: auto;
`

export const ValueWrapper = styled.ul`
  padding: 0 0 0 1rem;
  list-style: none;
  margin: 0;

  > li {
    margin-bottom: 4px;
  }
`

export const ButtonToggle = styled.button`
  color: inherit;
  overflow: hidden;
  position: relative;
  border: 0 none;
  background: none transparent;
  text-indent: -100rem;
  padding: 0;
  margin: 0.2rem 0 0;
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
  ${props => (props.expanded ? 'transform: rotate(90deg);' : '')} &:before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.333rem 0 0 -0.25rem;
    width: 0;
    height: 0;
    opacity: 0.5;
    border-style: solid;
    border-width: 0.333rem 0 0.333rem 0.5rem;
    border-color: transparent transparent transparent currentColor;
  }
`

const HighLight = styled.span`
  background: yellow;
  color: black;
  white-space: pre-wrap;
`

const WithLineBreak = styled.span`
  white-space: pre-wrap;
`

export function HighLighted({ value, search }) {
  const stringValue = String(value)
  if (!search) {
    return <WithLineBreak>{stringValue}</WithLineBreak>
  }

  const index = stringValue.toLowerCase().indexOf(search.toLowerCase())

  if (index === -1) {
    return value
  }

  const firstPart = stringValue.slice(0, index)
  const secondPart = stringValue.slice(index, index + search.length)
  const thirdPart = stringValue.slice(
    index + search.length,
    String(value).length
  )

  return (
    <span>
      <WithLineBreak>{firstPart}</WithLineBreak>
      <HighLight>{secondPart}</HighLight>
      <WithLineBreak>{thirdPart}</WithLineBreak>
    </span>
  )
}

HighLighted.propTypes = {
  search: PropTypes.string,
  value: PropTypes.string,
}
