import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import LogList from './log-list'
import { Wrapper, TopBar, Filter, ButtonFilter } from '../list-element'
import {
  setSearch,
  setTypes,
  clearLogs,
  setShowLogTimes,
} from '../../redux/ducks/logs'

const mapStateToProps = state => ({
  search: state.logs.search,
  types: state.logs.types,
  showLogTimes: state.logs.showLogTimes,
})

const SearchInput = styled.input`
  margin-top: 5px;
  width: 20rem;
  border: 0 none;
  padding: 0 4rem 0 1rem;
  background: none #fff;
`

const LogTypesFilter = styled(Filter)`
  margin: 5px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 12px;
`

const Type = styled.p`
  display: inline-block;
  text-transform: capitalize;
  margin-left: 5px;
  padding: 2px 8px;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    background: #3d85ee;
    color: white;
    opacity: 0.5;
  }
`

const SearchIcon = styled.span`
  position: relative;
  color: rgba(0, 0, 0, 0.2);
  left: 11px;
  z-index: 1;
  transform: rotateZ(20deg);
`

class Console extends Component {
  constructor() {
    super()
    this._refs = {}
  }

  render() {
    return (
      <Wrapper>
        <TopBar>
          <Filter>
            <SearchIcon>⚲</SearchIcon>

            <SearchInput
              innerRef={c => {
                this._refs.searchInput = c
              }}
              type="search"
              placeholder="Filter Console Log"
              onChange={e => this.props.dispatch(setSearch(e.target.value))}
              value={this.props.search}
            />
          </Filter>
          <LogTypesFilter>
            {['log', 'info', 'warn', 'error'].map(type => (
              <Type
                key={type}
                onClick={() => {
                  this.props.dispatch(
                    setTypes({
                      ...this.props.types,
                      [type]: !this.props.types[type],
                    })
                  )
                }}
                style={
                  this.props.types[type]
                    ? { background: '#3D85EE', color: 'white', opacity: 1 }
                    : {}
                }
              >
                {type}
              </Type>
            ))}
          </LogTypesFilter>
          <ButtonFilter
            style={
              this.props.showLogTimes
                ? {
                    opacity: 1,
                  }
                : { opacity: 0.5 }
            }
            onClick={() =>
              this.props.dispatch(setShowLogTimes(!this.props.showLogTimes))}
            title={
              this.props.showLogTimes
                ? 'Hide log timestamp'
                : 'Show log timestamp'
            }
          >
            🕙
          </ButtonFilter>
          <ButtonFilter
            onClick={() => this.props.dispatch(clearLogs())}
            title="Clear console"
          >
            🗑
          </ButtonFilter>
        </TopBar>
        <LogList />
      </Wrapper>
    )
  }
}

export default connect(mapStateToProps)(Console)
