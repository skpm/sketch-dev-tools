import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import moment from 'moment'
import { Timestamp } from '../list-element'
import { ButtonToggle } from '../value/log-element'
import LogValue from '../value/value'

const Wrapper = styled.li`
  list-style: none;
  background: none white;
  font-size: 13px;
  padding: 0.3rem;
  font-family: Consolas, Menlo, Monaco, 'Lucida Console', monospace;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
`

const Context = styled.div`
  padding-left: 1.2rem;
`

class Action extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  render() {
    return (
      <Wrapper>
        {this.props.showActionTimes && (
          <Timestamp>
            {moment(this.props.action.ts).format('HH:mm:ss.SSS')}
          </Timestamp>
        )}
        <span>
          <ButtonToggle
            onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            className={!this.state.collapsed && 'expanded'}
          >
            &gt;
          </ButtonToggle>
          {this.props.action.name}
          {!this.state.collapsed && (
            <Context>
              <LogValue value={this.props.action.context} />
            </Context>
          )}
        </span>
      </Wrapper>
    )
  }
}

Action.propTypes = {
  showActionTimes: PropTypes.bool.isRequired,
  action: PropTypes.shape({
    ts: PropTypes.number,
    name: PropTypes.string,
    context: PropTypes.any,
  }).isRequired,
}

export default Action
