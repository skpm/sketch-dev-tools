import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { css } from 'emotion'
import styled from 'react-emotion'
import bridgeHandler from '../handler'

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`

const TabBar = styled.div`
  position: fixed ;
  z-index: 1;
  ul {
    /* margin-left: 20px; */ /* bring back this if titlebar is hidden */
    display: flex;
    list-style: none;
  }
`

const Tab = styled(NavLink)`
  height: 30px;
  margin-left: 20px;
  padding-bottom: 4px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: black;
  text-decoration: none;
  font-size: 1.5rem;
  opacity: 0.5;
  transition: all 0.2s;
  font-weight: 900;
  letter-spacing: -0.45px;
  border-bottom: 1px solid transparent;

  &:hover {
    opacity: 1;
  }

  &[disabled],
  &[disabled]:hover {
    opacity: 0.5;
    text-decoration: line-through;
  }
`

const TabContent = styled.div`
  flex: 1;
  background: white;
  overflow: auto;
  display: flex;
  flex-direction: row;
`

const Label = styled.span`
  font-size: 13px;
  text-transform: capitalize;
  font-weight: normal;
  padding-top: 3px;
`

const selectedTab = css`
  opacity: 1 !important;
  border-bottom: 1px solid #3d85ee !important;
`

class App extends Component {
  constructor(props) {
    super(props)
    bridgeHandler(props.dispatch)
  }

  render() {
    return (
      <Container>
        <TabBar>
          <ul>
            <li>
              <Tab to="/console" activeClassName={selectedTab}>
                {/* <span>🗄</span> */}
                <Label>Console</Label>
              </Tab>
            </li>
            <li>
              <Tab to="/elements" activeClassName={selectedTab}>
                {/* <span>💎</span> */}
                <Label>State</Label>
              </Tab>
            </li>
            <li>
              <Tab to="/network" activeClassName={selectedTab}>
                {/* <span>🌐</span> */}
                <Label>Network</Label>
              </Tab>
            </li>
            <li>
              <Tab to="/actions" activeClassName={selectedTab}>
                {/* <span>🛎</span> */}
                <Label>Actions</Label>
              </Tab>
            </li>
          </ul>
        </TabBar>
        <TabContent>{this.props.children}</TabContent>
      </Container>
    )
  }
}

export default withRouter(connect()(App))
