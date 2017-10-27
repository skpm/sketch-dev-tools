import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  requests: state.network.requests,
})

const Network = ({ requests }) => <div>Coming soon</div>

export default connect(mapStateToProps)(Network)
