import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import LogObject from '../value/object'
import { CompleteElementName } from './element-name'

const Loading = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  text-align: center;
  background: ${props => props.theme.translucideBackground};
  text-shadow: 0px 0px 2px ${props => props.theme.lessLight};
  color: ${props => props.theme.lightText};
  padding-top: 150px;
`

const Wrapper = styled.div`
  position: relative;
  padding: 8px 8px 40px 8px;
  background: ${props => props.theme.darkBackground};
  border-left: 1px solid ${props => props.theme.light};
  width: 100%;
  height: 100%;
  overflow: auto;
  color: ${props => props.theme.heavyText};
  text-align: left;
  font-size: 13px;
  cursor: auto;
  z-index: 10;
  resize: horizontal;
  direction: rtl;
  > * {
    direction: ltr;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`

class QuickLook extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !nextProps.element ||
      (nextProps.element && !this.props.element) ||
      nextProps.element.id !== this.props.element.id ||
      nextProps.element.meta !== this.props.element.meta
    )
  }

  componentDidUpdate() {
    if (!this.props.element) {
      return
    }
    if (!this.props.element.meta) {
      this.props.onFetchMetadata(this.props.element)
    }
  }

  render() {
    const { element } = this.props
    if (!element) {
      return <Wrapper onClick={e => e.preventDefault()} />
    }
    return (
      <Wrapper onClick={e => e.preventDefault()}>
        {!element.meta ? (
          <Loading>Loading...</Loading>
        ) : (
          <LogObject
            prefix={<CompleteElementName element={element} />}
            object={element.meta}
            opened
          />
        )}
      </Wrapper>
    )
  }
}

QuickLook.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string,
    children: PropTypes.array,
    class: PropTypes.string,
    name: PropTypes.string,
    meta: PropTypes.objectOf(PropTypes.any),
    fromPage: PropTypes.string,
    fromDoc: PropTypes.string,
  }),
  onFetchMetadata: PropTypes.func.isRequired,
}

export default QuickLook
