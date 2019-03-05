import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Wrapper,
  TopBar,
  ButtonFilter,
  ScrollingList,
  ListInner,
  ClearLabel,
} from '../list-element'
import { clearActions, listenToActions } from '../../redux/ducks/actions'
import Action from './action'

const mapStateToProps = state => ({
  actions: state.actions.actions,
  showActionTimes: state.settings.showTimestamps,
  clearTs: state.actions.clearTs,
})

class Actions extends React.Component {
  componentDidMount() {
    this.props.dispatch(listenToActions({ enabled: true }))
  }

  componentWillUnmount() {
    this.props.dispatch(listenToActions({ enabled: false }))
  }

  render() {
    const { actions, clearTs, showActionTimes, dispatch } = this.props
    return (
      <Wrapper>
        <TopBar>
          <ButtonFilter
            onClick={() => dispatch(clearActions())}
            title="Clear actions"
          >
            🗑
          </ButtonFilter>
        </TopBar>
        <ScrollingList items={actions}>
          <ListInner>
            <ClearLabel>
              Actions cleared at {clearTs.format('HH:mm:ss')}
            </ClearLabel>
            {actions.map((action, i) => (
              <Action
                key={i}
                action={action}
                showActionTimes={showActionTimes}
              />
            ))}
          </ListInner>
        </ScrollingList>
      </Wrapper>
    )
  }
}

Actions.propTypes = {
  clearTs: PropTypes.any.isRequired,
  showActionTimes: PropTypes.bool.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      ts: PropTypes.number,
      name: PropTypes.string,
      context: PropTypes.any,
    })
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Actions)
