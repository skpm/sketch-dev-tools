import React from 'react'
import PropTypes from 'prop-types'
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
  width: 25vw;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2px 0.5rem 2px 1rem;
  background: none #fff;
  border-radius: 2px;
  user-select: auto;
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
  left: 14px;
  display: inline-block;
  z-index: 1;
  transform: rotateZ(-30deg);
`

const Console = props => (
  <Wrapper>
    <TopBar>
      <Filter>
        <SearchIcon>⚲</SearchIcon>
        <SearchInput
          placeholder="Filter Console Logs"
          onChange={e => props.dispatch(setSearch(e.target.value))}
          value={props.search}
        />
      </Filter>
      <LogTypesFilter>
        {Object.keys(props.types).map(type => (
          <Type
            key={type}
            onClick={() => {
              props.dispatch(
                setTypes({
                  ...props.types,
                  [type]: !props.types[type],
                })
              )
            }}
            style={
              props.types[type]
                ? { background: '#3D85EE', color: 'white', opacity: 1 }
                : {}
            }
            title={
              props.types[type] ? `Hide ${type} logs` : `Show ${type} logs`
            }
          >
            {type}
          </Type>
        ))}
      </LogTypesFilter>
      <ButtonFilter
        style={
          props.showLogTimes
            ? {
                opacity: 1,
              }
            : { opacity: 0.5 }
        }
        onClick={() => props.dispatch(setShowLogTimes(!props.showLogTimes))}
        title={props.showLogTimes ? 'Hide log timestamp' : 'Show log timestamp'}
      >
        🕙
      </ButtonFilter>
      <ButtonFilter
        onClick={() => props.dispatch(clearLogs())}
        title="Clear console"
      >
        🗑
      </ButtonFilter>
    </TopBar>
    <LogList />
  </Wrapper>
)

Console.propTypes = {
  search: PropTypes.string.isRequired,
  showLogTimes: PropTypes.bool.isRequired,
  types: PropTypes.objectOf(PropTypes.bool).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Console)
