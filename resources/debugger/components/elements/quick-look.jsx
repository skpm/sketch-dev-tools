import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import {
  fetchLayerMetadata,
  fetchPageMetadata,
} from '../../redux/ducks/elements'
import LogObject from '../value/object'

const Loading = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  color: #aaa;
  padding-top: 150px;
`

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 30px;
  padding: 8px 8px 40px 8px;
  background: #f8f8f8;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  width: 30%;
  max-width: 95%;
  height: calc(100% - 30px);
  overflow: auto;
  color: black;
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
          fetchLayerMetadata(this.props.element.id, this.props.element.fromPage)
        )
      } else {
        this.props.dispatch(fetchPageMetadata(this.props.element.id))
      }
    }
  }

  render() {
    return (
      <div>
        <Wrapper onClick={e => e.preventDefault()}>
          {!this.props.element.meta ? (
            <Loading>Loading...</Loading>
          ) : (
            <LogObject object={this.props.element.meta} opened />
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
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(QuickLook)
