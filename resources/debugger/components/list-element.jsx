import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

export const TopBar = styled.div`
  height: 30px;
  display: flex;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  justify-content: flex-end;
`

export const Filter = styled.div`
  position: relative;
`

export const ButtonFilter = styled(Filter)`
  margin: 5px 0;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 13px;
  padding: 3px 5px;
  cursor: pointer;
`

export const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

export const ListInner = styled.ul`
  list-style: none;
`

export const ClearLabel = styled.li`
  color: #aaa;
  text-align: center;
  font-size: 13px;
  margin-bottom: -100px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  margin-top: -70px;
`

export const Timestamp = styled.span`
  opacity: 0.3;
  padding: 0 1.2rem 0 0;
`

const List = styled.div`
  height: 100vh;
  padding: 0;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
`

export class ScrollingList extends Component {
  constructor() {
    super()
    this.state = {
      autoScroll: true,
      scrollPosition: undefined,
      scrollHeight: undefined,
    }
    this._refs = {}

    this.handleLogScroll = this.handleLogScroll.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this._refs.list && prevProps.items.length !== this.props.items.length) {
      if (this.state.autoScroll) {
        this._refs.list.scrollTop = this._refs.list.scrollHeight
      } else {
        const grow = this._refs.list.scrollHeight - this.state.scrollHeight
        this._refs.list.scrollTop = this.state.scrollPosition - grow
      }
    }
  }

  // TODO: debounce
  handleLogScroll(e) {
    if (e.target.scrollTop === 0) {
      if (!this.state.autoScroll) {
        this.setState({ autoScroll: true })
      }
    } else {
      this.setState({
        autoScroll: false,
        scrollPosition: e.target.scrollTop,
        scrollHeight: e.target.scrollHeight,
      })
    }
  }

  render() {
    return (
      <List
        innerRef={c => {
          this._refs.list = c
        }}
        onScroll={this.handleLogScroll}
        {...this.props}
      />
    )
  }
}

ScrollingList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
