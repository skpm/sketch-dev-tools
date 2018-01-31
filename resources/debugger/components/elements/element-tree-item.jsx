import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { css } from 'emotion'
import QuickLook from './quick-look'
import { selectElement } from '../../redux/ducks/elements'
import { ButtonToggle } from '../value/log-element'

const mapStateToProps = state => ({
  selectedElement: state.elements.selectedElement,
})

const Element = styled.ul`
  padding: 0 0 0 2rem;
  list-style: none;
  margin: 0;
`

const WrapElement = styled.span`
  color: #aaa;

  ${props => props.hasInfo ? `
    cursor: pointer;
  ` : ''}

  &:hover {
    backgroundColor: ${props => props.hasInfo ? '#aaa' : 'transparent'};
  }
`

const ElementClass = styled.span`
  color: #e55b33;
  padding: 0 0.2rem;
`

const ElementName = styled.span`
  font-style: italic;
  color: #aaa;
`

const expandedTree = css`
  &:before {
    content: ' ';
    position: absolute;
    top: 2rem;
    bottom: 1rem;
    left: -1rem;
    width: 2px;
    background: #e6e6e6;
  }
`

const TreeElement = styled.li`
  position: relative;
  padding: 0.5rem 0;
`

const OffsetButtonToggle = styled(ButtonToggle)`
  position: absolute;
  left: -1.5rem;
  top: 0.3rem;
`

class ElementTreeItem extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

  renderElementName(close) {
    const { element } = this.props
    return (
      <span>
        <ElementClass>{element.class}</ElementClass>
        {!close && element.name && <ElementName> {element.name}</ElementName>}
      </span>
    )
  }

  renderQuickLook(expanded) {
    return (
      <WrapElement
        onClick={e => {
          if (e.isDefaultPrevented() || this.props.element.id === '?') {
            return
          }
          this.props.dispatch(selectElement(this.props.element.id))
        }}
        hasInfo={this.props.element.id !== '?'}
      >
        &lt;{this.renderElementName()}{expanded ? '>' : ' />'} {this.props.selectedElement === this.props.element.id && <QuickLook element={this.props.element} />}
      </WrapElement>
    )
  }

  renderElement() {
    const { element } = this.props

    if (element.children.length > 0) {
      return (
        <TreeElement className={this.state.expanded && expandedTree}>
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
                <ElementTreeItemWrapper key={element.id + i} element={e} />
              ))}
              <WrapElement>&lt;/{this.renderElementName(true)}&gt;</WrapElement>
            </span>
          ) : (
            this.renderQuickLook(false)
          )}
        </TreeElement>
      )
    }

    return (
      <TreeElement>
        {this.renderQuickLook(false)}
      </TreeElement>
    )
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
  selectedElement: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
}

const ElementTreeItemWrapper = connect(mapStateToProps)(ElementTreeItem)
export default ElementTreeItemWrapper