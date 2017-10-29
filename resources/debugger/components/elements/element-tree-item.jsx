import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'react-emotion'
import { css } from 'emotion'
import QuickLook from './quick-look'

const Element = styled.ul`
  padding: 0 0 0 2rem;
  list-style: none;
  margin: 0;
`

const WrapElement = styled.span`
  color: #aaa;
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

const ToggleButton = styled.button`
  position: absolute;
  top: 0.3rem;
  left: -1.5rem;
  text-indent: -999px;
  overflow: hidden;
  color: inherit;
  border: 0 none;
  background: none transparent;
  text-indent: -100rem;
  padding: 0;
  margin: 0.2rem 0 0;
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.2s;

  &:before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.4rem 0 0 -0.3rem;
    width: 0;
    opacity: 0.5;
    height: 0;
    border-style: solid;
    border-width: 0.4rem 0 0.4rem 0.6rem;
    border-color: transparent transparent transparent currentColor;
  }
`

const Info = styled.Button`
  display: inline-block;
  width: 18px;
  height: 18px;
  background: #aaa;
  color: white;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  border: none;
  pointer-events: all;
`

export default class ElementTreeItem extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
      quickLook: false
    }
  }

  renderElementName(close) {
    const { element } = this.props
    return (
      <span>
        <ElementClass>{element.class}</ElementClass>
        {!close &&
          element.name && <ElementName> {element.name}</ElementName>}
      </span>
    )
  }

  renderQuickLook() {
    return this.props.element.id !== '?' && (<Info onClick={(e) =>{
      if (e.isDefaultPrevented()) {
        return
      }
      this.setState({
        quickLook: !this.state.quickLook
      })
    }}>?{this.state.quickLook && (
      <QuickLook element={this.props.element} />
    )}</Info>)
  }

  propagateClick(e) {
    var target = ReactDOM.findDOMNode(e.target);
    if (target.tagName == 'LI') {
      var toggleButton = target.getElementsByTagName('button')[0];
      if (toggleButton) {
        toggleButton.click()
      }
    }
    else if (target.tagName == 'SPAN') {
      target = target.closest('li');
      var toggleButton = target.getElementsByTagName('button')[0];
      if (toggleButton) {
        toggleButton.click()
      }
    }
  }

  renderElement() {
    const { element } = this.props

    if (element.children.length > 0) {
      return (
        <TreeElement
          className={this.state.expanded && expandedTree}
          onClick={(e) => this.propagateClick(e)}
        >
          <ToggleButton
            style={this.state.expanded ? { transform: 'rotate(90deg)' } : {}}
            onClick={() => this.setState({ expanded: !this.state.expanded })}
          >
            &gt;
          </ToggleButton>
          {this.state.expanded ? (
            <span>
              <WrapElement>&lt;{this.renderElementName()}&gt; {this.renderQuickLook()}</WrapElement>
              {element.children.map((e) => (
                <ElementTreeItem key={element.id} element={e} />
              ))}
              <WrapElement>&lt;/{this.renderElementName(true)}&gt;</WrapElement>
            </span>
          ) : (
            <WrapElement>&lt;{this.renderElementName()} /&gt; {this.renderQuickLook()}</WrapElement>
          )}
        </TreeElement>
      )
    }

    return (
      <TreeElement>
        <WrapElement>&lt;{this.renderElementName()} /&gt; {this.renderQuickLook()}</WrapElement>
      </TreeElement>
    )
  }

  render() {
    return <Element>{this.renderElement()}</Element>
  }
}
