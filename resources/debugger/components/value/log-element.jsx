import styled from 'react-emotion'

export const LogKey = styled.span`
  color: #704cea;
  padding: 0 0 0 1.2rem;
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
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.2s;

  &:before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.4rem 0 0 -0.3rem;
    width: 0;
    height: 0;
    opacity: 0.5;
    border-style: solid;
    border-width: 0.4rem 0 0.4rem 0.6rem;
    border-color: transparent transparent transparent currentColor;
  }

  &.expanded {
    transform: rotate(90deg);
  }
`
