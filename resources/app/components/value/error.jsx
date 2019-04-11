/* globals window */

import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { LogKey, LogColon, ButtonToggle, ValueWrapper } from './log-element'

const LinkToEditor = styled.span`
  cursor: pointer;
  user-select: auto;
`

const Selectable = styled.span`
  user-select: auto;
`

class CallSite extends PureComponent {
  constructor(props) {
    super(props)
    this.onLinkToEditor = this.onLinkToEditor.bind(this)
  }

  onLinkToEditor(e) {
    if ((e.metaKey || e.ctrlKey) && this.props.filePath && this.props.filePath !== '[native code]') {
      window.postMessage('openFile', this.props.filePath)
    }
  }

  render() {
    const {fn, file, line, column} = this.props
    return (
      <li>
        <LinkToEditor onClick={this.onLinkToEditor}>
          {typeof fn === 'string' ? fn : ''} {file}{typeof line !== 'undefined' ? `:${line}:${column}` : ''}
        </LinkToEditor>
      </li>
    )
  }
}

CallSite.propTypes = {
  fn: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  file: PropTypes.string,
  filePath: PropTypes.string,
  line: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  column: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

// eslint-disable-next-line react/no-multi-comp
export default class LogError extends Component {
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
    const { collapsed } = this.state
    const { logKey, error } = this.props
    return (
      <span>
        <ButtonToggle onClick={this.onToggle} expanded={!collapsed}>
          &gt;
        </ButtonToggle>
        {logKey && (
          <span>
            <LogKey>{logKey}</LogKey>
            <LogColon>: </LogColon>
          </span>
        )}
        <Selectable>
          {error.name}: {error.message}
        </Selectable>
        {!collapsed && (
          <ValueWrapper>
            {error.stack.map((value, key) => <CallSite {...value} key={key} />)}
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
      PropTypes.shape(CallSite.propTypes)
    ),
  }).isRequired,
}
