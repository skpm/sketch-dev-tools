import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import SplitPanel from 'react-split-pane'
import { updateQuickLookWidth } from '../../redux/ducks/settings'
import {
  fetchTree,
  fetchLayerMetadata,
  fetchPageMetadata,
  findLayerWithId,
} from '../../redux/ducks/elements'
import ElementTreeItem from './element-tree-item'
import QuickLook from './quick-look'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'

const mapStateToProps = state => ({
  tree: state.elements.tree,
  loading: state.elements.loading,
  quickLookWidth: state.settings.quickLookWidth,
})

const Loading = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  text-align: center;
  background: ${props => props.theme.translucideBackground};
  text-shadow: 0px 0px 2px ${props => props.theme.lessLight};
  color: #aaa;
  padding-top: 150px;
`

const Empty = styled.p`
  margin-top: 100px;
  text-align: center;
  color: ${props => props.theme.lightText};
`

const ElementTree = styled.div`
  flex: 1;
  font-size: 13px;
  overflow: auto;
  font-family: Consolas, Menlo, Monaco, 'Lucida Console', monospace;
  height: 100%;
`

const ElementTreeWrapper = styled(SplitPanel)`
  height: 100% !important;

  .Resizer {
    background: ${props => props.theme.heavyText};
    opacity: 0.1;
    z-index: 1;
    box-sizing: border-box;
    -webkit-background-clip: padding;
    background-clip: padding-box;
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid ${props => props.theme.transparentBackground};
    border-right: 5px solid ${props => props.theme.transparentBackground};
    cursor: col-resize;
    transition: all 2s ease;
  }

  .Resizer:hover {
    border-left: 5px solid ${props => props.theme.translucideBackground};
    border-right: 5px solid ${props => props.theme.translucideBackground};
  }
`

class Elements extends Component {
  constructor() {
    super()
    this.state = {
      quickLookElement: null,
    }
    this.onSelectElement = this.onSelectElement.bind(this)
    this.onQuickLookWidthChange = this.onQuickLookWidthChange.bind(this)
    this.onFetchMetadata = this.onFetchMetadata.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.quickLookElement) {
      return null
    }
    const { fromDoc, fromPage, id } = state.quickLookElement

    let element = null

    props.tree.forEach(d => {
      if (d.id === fromDoc) {
        d.children.forEach(page => {
          if (page.id === fromPage) {
            if (!page.children) {
              return
            }
            page.children.forEach(
              findLayerWithId.bind(this, id, layer => {
                element = layer
              })
            )
          } else if (page.id === id) {
            element = page
          }
        })
      } else if (d.id === id) {
        element = d
      }
    })

    return { quickLookElement: element }
  }

  componentDidMount() {
    this.props.dispatch(fetchTree())
  }

  onFetchMetadata(element) {
    if (element.fromPage) {
      this.props.dispatch(
        fetchLayerMetadata(element.id, element.fromPage, element.fromDoc)
      )
    } else {
      this.props.dispatch(fetchPageMetadata(element.id, element.fromDoc))
    }
  }

  onSelectElement(quickLookElement) {
    this.setState({ quickLookElement })
  }

  onQuickLookWidthChange(size) {
    this.props.dispatch(updateQuickLookWidth(size))
  }

  render() {
    return (
      <Wrapper>
        <TopBar>
          <ButtonFilter
            style={{ paddingTop: 0 }}
            onClick={() => this.props.dispatch(fetchTree())}
            title="Refresh the state"
          >
            ⟲
          </ButtonFilter>
        </TopBar>
        {this.props.loading && <Loading>Loading...</Loading>}
        {this.props.tree.length > 0 ? (
          <ElementTreeWrapper
            defaultSize={this.props.quickLookWidth}
            onChange={this.onQuickLookWidthChange}
            primary="second"
          >
            <ElementTree>
              {this.props.tree.map((e, i) => (
                <ElementTreeItem
                  key={i}
                  element={e}
                  onShowQuickLook={this.onSelectElement}
                  onFetchMetadata={this.onFetchMetadata}
                />
              ))}
            </ElementTree>
            <QuickLook
              element={this.state.quickLookElement}
              onFetchMetadata={this.onFetchMetadata}
            />
          </ElementTreeWrapper>
        ) : (
          <Empty>No Sketch document found.</Empty>
        )}
      </Wrapper>
    )
  }
}

Elements.propTypes = {
  quickLookWidth: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  tree: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      children: PropTypes.array,
      class: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Elements)
