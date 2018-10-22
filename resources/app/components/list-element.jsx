import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

export const TopBar = styled.div`
  padding-right: 30px;
  height: 30px;
  display: flex;
  background: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.light};
  justify-content: flex-end;
`

export const Filter = styled.div`
  position: relative;
`

export const ButtonFilter = styled(Filter)`
  margin: 5px 0;
  border-left: 1px solid ${props => props.theme.light};
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
  color: ${props => props.theme.lightText};
  text-align: center;
  font-size: 13px;
  margin: 10px 0;
`

export const Timestamp = styled.span`
  opacity: 0.3;
  padding: 0 1.2rem 0 0;
`

export const List = styled.div`
  height: calc(100vh - 30px);
  padding: 0;
  overflow-y: scroll;
  display: flex;
  ${props =>
    props.inverse
      ? 'flex-direction: column-reverse'
      : 'flex-direction: column'};
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
    if (
      this._refs.list &&
      prevProps.items &&
      prevProps.items.length !== this.props.items.length
    ) {
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
        inverse
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
  items: PropTypes.arrayOf(PropTypes.any),
}
