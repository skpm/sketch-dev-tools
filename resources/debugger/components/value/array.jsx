import React, { Component } from 'react'
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
  }

  render() {
    return (
      <span>
        <ButtonToggle
          onClick={() => this.setState({ collapsed: !this.state.collapsed })}
          className={!this.state.collapsed && 'expanded'}
        >
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
                  <LogValue value={value} />
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
