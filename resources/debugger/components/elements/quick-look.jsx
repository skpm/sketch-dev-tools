import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

class QuickLook extends Component {
  componentDidMount() {
    if (!this.props.element.meta) {
      if (this.props.element.fromPage) {
        this.props.dispatch(fetchLayerMetadata(this.props.element.id, this.props.element.fromPage))
      } else {
        this.props.dispatch(fetchPageMetadata(this.props.element.id))
      }
    }
    // TODO: Opening a QuickLook view should dismiss other previously open views.
    // TODO: 👇 Open by default the first toggle of the QuickLook view.
    var quickLook = ReactDOM.findDOMNode(this);
    setTimeout(function () {
      var firstToggle = quickLook.getElementsByTagName('button')[0];
      firstToggle.click();
    }, 10);
  }


  render() {
    return (
      <div>
        <Wrapper onClick={e => e.preventDefault()}>
          <h4>{this.props.element.id}</h4>
          {!this.props.element.meta ? <Loading>Loading...</Loading> : <LogObject object={this.props.element.meta} />}
        </Wrapper>
      </div>
    )
  }
}

export default connect()(QuickLook)
