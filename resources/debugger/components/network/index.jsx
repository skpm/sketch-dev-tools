import React from 'react'
import { connect } from 'react-redux'
import {
  Wrapper,
  TopBar,
  ScrollingList,
  ListInner,
  ClearLabel,
} from '../list-element'

const mapStateToProps = state => ({
  requests: state.network.requests,
})

const Network = ({ requests }) => (
  <Wrapper>
    <TopBar>
    </TopBar>
    <ScrollingList>
      <ListInner>
        <ClearLabel>
          Coming soon
        </ClearLabel>
      </ListInner>
    </ScrollingList>
  </Wrapper>
)

export default connect(mapStateToProps)(Network)
