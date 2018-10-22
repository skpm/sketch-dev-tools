/* globals document */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'react-emotion'
import { ThemeProvider } from 'emotion-theming'
import bridgeHandler from '../handler'
import getTheme from '../theme'

const tabs = [
  {
    url: '/console',
    label: 'Console',
  },
  {
    url: '/elements',
    label: 'Elements',
  },
  {
    url: '/playground',
    label: 'Playground',
  },
  {
    url: '/network',
    label: 'Network',
  },
  {
    url: '/actions',
    label: 'Actions',
  },
]

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  color: ${props => props.theme.text};
`

const TabBar = styled.div`
  position: fixed;
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
  color: ${props => props.theme.heavyText};
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

const Setting = styled(NavLink)`
  position: absolute;
  right: 0;
  margin: 5px 0;
  border-left: 1px solid ${props => props.theme.light};
  font-size: 13px;
  padding: 3px 5px;
  cursor: pointer;
  z-index: 1;
  text-decoration: none;
`

const TabContent = styled.div`
  flex: 1;
  background: ${props => props.theme.background};
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

const selectedTab = theme => css`
  opacity: 1 !important;
  border-bottom: 1px solid ${theme.primary} !important;
`

class App extends Component {
  constructor(props) {
    super(props)
    bridgeHandler(props.dispatch)
    this.navigateToTab = this.navigateToTab.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab' && event.ctrlKey) {
        this.navigateToTab(event.shiftKey ? 'prev' : 'next')
      }
    })
  }

  navigateToTab(direction) {
    const currentTabIndex = tabs.findIndex(
      t => t.url === this.props.location.pathname
    )
    this.props.history.push(
      tabs[
        Math.max(
          Math.min(
            currentTabIndex + (direction === 'next' ? 1 : -1),
            tabs.length - 1
          ),
          0
        )
      ].url
    )
  }

  render() {
    const theme = getTheme(this.props.theme)
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Setting to="settings">⚙️</Setting>
          <TabBar>
            <ul>
              {tabs.map(t => (
                <li key={t.url}>
                  <Tab to={t.url} activeClassName={selectedTab(theme)}>
                    <Label>{t.label}</Label>
                  </Tab>
                </li>
              ))}
            </ul>
          </TabBar>
          <TabContent>{this.props.children}</TabContent>
        </Container>
      </ThemeProvider>
    )
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  theme: PropTypes.string,
}

export default withRouter(
  connect(state => ({
    theme: state.settings.theme,
  }))(App)
)
