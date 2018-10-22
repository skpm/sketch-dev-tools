import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { fetchTree } from '../../redux/ducks/elements'
import ElementTreeItem from './element-tree-item'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'

const mapStateToProps = state => ({
  tree: state.elements.tree,
  loading: state.elements.loading,
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

class Elements extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTree())
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
          <ElementTree>
            {this.props.tree.map((e, i) => (
              <ElementTreeItem key={i} element={e} />
            ))}
          </ElementTree>
        ) : (
          <Empty>No Sketch document found.</Empty>
        )}
      </Wrapper>
    )
  }
}

Elements.propTypes = {
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
