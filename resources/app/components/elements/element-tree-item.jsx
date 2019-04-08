import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
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
    }
    this.onSelectElement = this.onSelectElement.bind(this)
    this.onToggle = this.onToggle.bind(this)
  }

  onSelectElement(e) {
    if (e.isDefaultPrevented() || this.props.element.id === '?') {
      return
    }
    if (!this.state.expanded) {
      this.setState({
        expanded: true,
      })
    }

    this.props.onShowQuickLook(this.props.element)
  }

  onToggle() {
    if (!this.props.element.children) {
      this.props.onFetchMetadata(this.props.element)
    }
    this.setState(state => ({ expanded: !state.expanded }))
  }

  renderElementName(expanded) {
    return (
      <WrapElement
        onClick={this.onSelectElement}
        hasInfo={this.props.element.id !== '?'}
      >
        &lt;
        <CompleteElementName element={this.props.element} />
        {expanded ? '>' : ' />'}{' '}
      </WrapElement>
    )
  }

  renderElement() {
    const { element, onShowQuickLook, onFetchMetadata } = this.props

    if (element && element.hasChildren) {
      return (
        <TreeElement expanded={this.state.expanded}>
          <OffsetButtonToggle
            expanded={this.state.expanded}
            onClick={this.onToggle}
          >
            &gt;
          </OffsetButtonToggle>
          {this.state.expanded ? (
            <span>
              {this.renderElementName(true)}
              {(element.children || []).map((e, i) => (
                <ElementTreeItem
                  key={element.id + i}
                  element={e}
                  onShowQuickLook={onShowQuickLook}
                  onFetchMetadata={onFetchMetadata}
                />
              ))}
              <WrapElement>
                &lt;/
                <CompleteElementName element={this.props.element} hideName />
                &gt;
              </WrapElement>
            </span>
          ) : (
            this.renderElementName(false)
          )}
        </TreeElement>
      )
    }

    return <TreeElement>{this.renderElementName(false)}</TreeElement>
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
  onShowQuickLook: PropTypes.func.isRequired,
  onFetchMetadata: PropTypes.func.isRequired,
}
