import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { css } from "emotion";
import styled from "react-emotion";
import bridgeHandler from "../handler";

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`;

const TabBar = styled.div`
  position: fixed;
  z-index: 1;
  ul {
    /* margin-left: 20px; */ /* bring back this if titlebar is hidden */
    display: flex;
    list-style: none;
  }
`;

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
`;

const TabContent = styled.div`
  flex: 1;
  background: white;
  overflow: auto;
  display: flex;
  flex-direction: row;
`;

const Label = styled.span`
  font-size: 13px;
  text-transform: capitalize;
  font-weight: normal;
  padding-top: 3px;
`;

const selectedTab = css`
  opacity: 1 !important;
  border-bottom: 1px solid #3d85ee !important;
`;

class App extends Component {
  constructor(props) {
    super(props);
    bridgeHandler(props.dispatch);
  }

  componentDidMount() {
    this.listenForShortcuts();
  }

  navigateToTab(direction) {
    var nextTab;
    var prevTab;
    var tabs = ReactDOM.findDOMNode(this).getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("aria-current") == "true") {
        if (i == 0) {
          nextTab = i + 1;
          prevTab = tabs.length - 1;
        } else if (i == tabs.length - 1) {
          nextTab = 0;
          prevTab = i - 1;
        } else {
          nextTab = i + 1;
          prevTab = i - 1;
        }
        break;
      }
    }
    if (direction == "next") {
      tabs[nextTab].click();
    }
    if (direction == "prev") {
      tabs[prevTab].click();
    }
  }

  listenForShortcuts() {
    var self = this;
    document.addEventListener("keydown", function(event) {
      if (
        event.key == "Tab" &&
        event.ctrlKey == true &&
        event.shiftKey == false
      ) {
        self.navigateToTab("next");
      } else if (
        event.key == "Tab" &&
        event.ctrlKey == true &&
        event.shiftKey == true
      ) {
        self.navigateToTab("prev");
      }
    });
  }

  render() {
    return (
      <Container>
        <TabBar>
          <ul>
            <li>
              <Tab className="tab" to="/console" activeClassName={selectedTab}>
                {/* <span>🗄</span> */}
                <Label>Console</Label>
              </Tab>
            </li>
            <li>
              <Tab className="tab" to="/elements" activeClassName={selectedTab}>
                {/* <span>💎</span> */}
                <Label>State</Label>
              </Tab>
            </li>
            <li>
              <Tab className="tab" to="/network" activeClassName={selectedTab}>
                {/* <span>🌐</span> */}
                <Label>Network</Label>
              </Tab>
            </li>
            <li>
              <Tab className="tab" to="/actions" activeClassName={selectedTab}>
                {/* <span>🛎</span> */}
                <Label>Actions</Label>
              </Tab>
            </li>
          </ul>
        </TabBar>
        <TabContent>{this.props.children}</TabContent>
      </Container>
    );
  }
}

export default withRouter(connect()(App));
