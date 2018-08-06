import React, { Component } from 'react'
import pluginCall from 'sketch-module-web-view/client'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { LogKey, LogColon, ButtonToggle, ValueWrapper } from './log-element'

const LinkToEditor = styled.span`
  cursor: pointer;
  user-select: auto;
`

export default class LogError extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: !props.opened,
    }
  }

  render() {
    return (
      <span>
        <ButtonToggle
          onClick={() => this.setState({ collapsed: !this.state.collapsed })}
          expanded={!this.state.collapsed}
        >
          &gt;
        </ButtonToggle>
        {this.props.logKey && (
          <span>
            <LogKey>{this.props.logKey}</LogKey>
            <LogColon>: </LogColon>
          </span>
        )}
        <span>
          {this.props.error.name}: {this.props.error.message}
        </span>
        {!this.state.collapsed && (
          <ValueWrapper>
            {this.props.error.stack.map((value, key) => (
              <li key={key}>
                <LinkToEditor
                  onClick={e => {
                    if (e.metaKey) {
                      pluginCall('openFile', value.filePath)
                    }
                  }}
                >
                  {value.fn} {value.file}
                  {value.line ? `:${value.line}:${value.column}` : ''}
                </LinkToEditor>
              </li>
            ))}
          </ValueWrapper>
        )}
      </span>
    )
  }
}

LogError.propTypes = {
  opened: PropTypes.bool,
  logKey: PropTypes.string,
  error: PropTypes.shape({
    name: PropTypes.string,
    message: PropTypes.string,
    stack: PropTypes.arrayOf(
      PropTypes.shape({
        fn: PropTypes.string,
        file: PropTypes.string,
        filePath: PropTypes.string,
        line: PropTypes.string,
        column: PropTypes.string,
      })
    ),
  }).isRequired,
}
