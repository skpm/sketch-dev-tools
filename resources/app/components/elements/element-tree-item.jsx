import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import QuickLook from './quick-look'
import { ButtonToggle } from '../value/log-element'
import { CompleteElementName } from './element-name'

const Element = styled.ul`
  padding: 0 0 0 2rem;
  list-style: none;
  margin: 0;
`

const WrapElement = styled.span`
  color: ${props => props.theme.lightText};

  ${props =>
    props.hasInfo
      ? `
    cursor: pointer;
  `
      : ''} &:hover {
    backgroundcolor: ${props =>
      props.hasInfo ? props.theme.lightText : 'transparent'};
  }
`

const TreeElement = styled.li`
  position: relative;
  padding: 0.5rem 0;
  ${props =>
    props.expanded
      ? `

  &:before {
    content: ' ';
    position: absolute;
    top: 2rem;
    bottom: 1rem;
    left: -1rem;
    width: 2px;
    background: ${props.theme.text};
  }
`
      : ''};
`

const OffsetButtonToggle = styled(ButtonToggle)`
  position: absolute;
  left: -1.5rem;
  top: 0.3rem;
`

export default class ElementTreeItem extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
      quickLook: false,
    }
  }

  renderQuickLook(expanded) {
    return (
      <WrapElement
        onClick={e => {
          if (e.isDefaultPrevented() || this.props.element.id === '?') {
            return
          }
          this.setState({
            quickLook: !this.state.quickLook,
            expanded: true,
          })
        }}
        hasInfo={this.props.element.id !== '?'}
      >
        &lt;
        <CompleteElementName element={this.props.element} />
        {expanded ? '>' : ' />'}{' '}
        {this.state.quickLook && <QuickLook element={this.props.element} />}
      </WrapElement>
    )
  }

  renderElement() {
    const { element } = this.props

    if (element && element.children && element.children.length > 0) {
      return (
        <TreeElement expanded={this.state.expanded}>
          <OffsetButtonToggle
            expanded={this.state.expanded}
            onClick={() => this.setState({ expanded: !this.state.expanded })}
          >
            &gt;
          </OffsetButtonToggle>
          {this.state.expanded ? (
            <span>
              {this.renderQuickLook(true)}
              {element.children.map((e, i) => (
                <ElementTreeItem key={element.id + i} element={e} />
              ))}
              <WrapElement>
                &lt;/
                <CompleteElementName element={this.props.element} hideName />
                &gt;
              </WrapElement>
            </span>
          ) : (
            this.renderQuickLook(false)
          )}
        </TreeElement>
      )
    }

    return <TreeElement>{this.renderQuickLook(false)}</TreeElement>
  }

  render() {
    return <Element>{this.renderElement()}</Element>
  }
}

ElementTreeItem.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string,
    children: PropTypes.array,
    class: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
}
