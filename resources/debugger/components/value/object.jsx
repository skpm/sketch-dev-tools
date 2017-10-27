import React, { Component } from 'react'
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
  constructor() {
    super()
    this.state = {
      collapsed: true,
    }
  }

  render() {
    return (
      <span className={`log-object ${!this.state.collapsed ? 'expanded' : ''}`}>
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
            {Object.keys(this.props.object).map(key => {
              return (
                <li key={key}>
                  <LogValue value={this.props.object[key]} logKey={key} />
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
