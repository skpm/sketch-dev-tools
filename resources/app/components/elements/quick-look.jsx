import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import {
  fetchLayerMetadata,
  fetchPageMetadata,
} from '../../redux/ducks/elements'
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
  position: fixed;
  right: 0;
  top: 30px;
  padding: 8px 8px 40px 8px;
  background: ${props => props.theme.darkBackground};
  border-left: 1px solid ${props => props.theme.light};
  width: 30%;
  max-width: 95%;
  height: calc(100% - 30px);
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

// const Overlay = styled.div`
//   position: fixed;
//   width: 100vw;
//   height: calc(100vh - 30px);
//   cursor: auto;
//   top: 30px;
//   left: 0;
//   z-index: 8;
// `

class QuickLook extends Component {
  componentDidMount() {
    if (!this.props.element.meta) {
      if (this.props.element.fromPage) {
        this.props.dispatch(
          fetchLayerMetadata(
            this.props.element.id,
            this.props.element.fromPage,
            this.props.element.fromDoc
          )
        )
      } else {
        this.props.dispatch(
          fetchPageMetadata(this.props.element.id, this.props.element.fromDoc)
        )
      }
    }
  }

  render() {
    const { element } = this.props
    return (
      <div>
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
      </div>
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
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(QuickLook)
