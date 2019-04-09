import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LogValue from './value'
import {
  LogKey,
  LogColon,
  ButtonToggle,
  LogValueType,
  LogValueLength,
  ValueWrapper,
} from './log-element'

export default class LogObject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: !props.opened,
    }
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle() {
    this.setState(state => ({ collapsed: !state.collapsed }))
  }

  render() {
    return (
      <span>
        <ButtonToggle onClick={this.onToggle} expanded={!this.state.collapsed}>
          &gt;
        </ButtonToggle>
        {this.props.logKey && (
          <span>
            <LogKey>{this.props.logKey}</LogKey>
            <LogColon>: </LogColon>
          </span>
        )}
        <LogValueType>{this.props.prefix}</LogValueType>
        {!this.state.collapsed ? (
          <ValueWrapper>
            {Object.keys(this.props.object).map(key => {
              return (
                <li key={key}>
                  <LogValue
                    value={this.props.object[key]}
                    logKey={key}
                    search={this.props.search}
                  />
                </li>
              )
            })}
          </ValueWrapper>
        ) : (
          <LogValueLength>
            {'{'}
            {Object.keys(this.props.object).length}
            {'}'}
          </LogValueLength>
        )}
      </span>
    )
  }
}

LogObject.propTypes = {
  opened: PropTypes.bool,
  search: PropTypes.string,
  logKey: PropTypes.string,
  prefix: PropTypes.node,
  object: PropTypes.objectOf(PropTypes.any).isRequired,
}
