import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LogValue from './value'
import {
  LogKey,
  LogColon,
  ButtonToggle,
  LogValueLength,
  LogValueType,
  ValueWrapper,
} from './log-element'

export default class LogArray extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
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
            {this.props.array.map((value, key) => (
              <li key={key}>
                <LogKey>{key}</LogKey>
                <LogColon>: </LogColon>
                <span>
                  <LogValue value={value} search={this.props.search} />
                </span>
              </li>
            ))}
          </ValueWrapper>
        ) : (
          <LogValueLength>[{this.props.array.length}]</LogValueLength>
        )}
      </span>
    )
  }
}

LogArray.propTypes = {
  search: PropTypes.string,
  logKey: PropTypes.string,
  prefix: PropTypes.string,
  array: PropTypes.arrayOf(PropTypes.any).isRequired,
}
