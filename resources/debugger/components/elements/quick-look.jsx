import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { fetchLayerMetadata, fetchPageMetadata } from '../../redux/ducks/elements'
import LogObject from '../value/object'

const Loading = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 0 0 0 50%;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  color: #aaa;
  padding-top: 150px;
`

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 30px;
  background: white;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  width: 400px;
  height: calc(100% - 30px);
  overflow: auto;
  color: black;
  text-align: left;
  cursor: auto;
  z-index: 10;
`

const Overlay = styled.div`
  position: fixed;
  width: calc(100vw - 80px);
  height: 100vh;
  cursor: auto;
  top: 0;
  left: 80px;
  z-index: 8;
`

class QuickLook extends Component {
  componentDidMount() {
    if (!this.props.element.meta) {
      if (this.props.element.fromPage) {
        this.props.dispatch(fetchLayerMetadata(this.props.element.id, this.props.element.fromPage))
      } else {
        this.props.dispatch(fetchPageMetadata(this.props.element.id))
      }
    }
  }

  render() {
    return (
      <div>
        <Overlay />
        <Wrapper onClick={e => e.preventDefault()}>
          {!this.props.element.meta ? <Loading>Loading...</Loading> : <LogObject object={this.props.element.meta} />}
        </Wrapper>
      </div>
    )
  }
}

export default connect()(QuickLook)
