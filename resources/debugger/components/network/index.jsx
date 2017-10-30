import React from 'react'
import PropTypes from 'prop-types'
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
    <TopBar />
    <ScrollingList>
      <ListInner>
        <ClearLabel>Coming soon</ClearLabel>
        {requests.length && <pre>{JSON.stringify(requests, null, 2)}</pre>}
      </ListInner>
    </ScrollingList>
  </Wrapper>
)

Network.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default connect(mapStateToProps)(Network)
