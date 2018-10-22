import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { Timestamp } from '../list-element'
import { ButtonToggle } from '../value/log-element'
import LogValue from '../value/value'

const Wrapper = styled.li`
  list-style: none;
  background: none ${props => props.theme.background};
  font-size: 13px;
  padding: 0.3rem;
  font-family: Consolas, Menlo, Monaco, 'Lucida Console', monospace;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  border-top: 0.5px solid ${props => props.theme.light};
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
          <Timestamp>{this.props.action.ts.format('HH:mm:ss.SSS')}</Timestamp>
        )}
        <span>
          <ButtonToggle
            onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            expanded={!this.state.collapsed}
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
    ts: PropTypes.any,
    name: PropTypes.string,
    context: PropTypes.any,
  }).isRequired,
}

export default Action
