import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Wrapper,
  TopBar,
  ButtonFilter,
  ScrollingList,
  ListInner,
  ClearLabel,
} from '../list-element'
import { setShowActionTimes, clearActions } from '../../redux/ducks/actions'
import Action from './action'

const mapStateToProps = state => ({
  actions: state.actions.actions,
  showActionTimes: state.actions.showActionTimes,
  clearTs: state.actions.clearTs,
})

const Actions = ({ actions, clearTs, showActionTimes, dispatch }) => (
  <Wrapper>
    <TopBar>
      <ButtonFilter
        style={
          showActionTimes
            ? {
                opacity: 1,
              }
            : { opacity: 0.5 }
        }
        onClick={() => dispatch(setShowActionTimes(!showActionTimes))}
        title={
          showActionTimes ? 'Hide action timestamp' : 'Show action timestamp'
        }
      >
        🕙
      </ButtonFilter>
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
          Actions cleared at {moment(clearTs).format('HH:mm:ss')}
        </ClearLabel>
        {actions.map((action, i) => (
          <Action key={i} action={action} showActionTimes={showActionTimes} />
        ))}
      </ListInner>
    </ScrollingList>
  </Wrapper>
)

Actions.propTypes = {
  clearTs: PropTypes.number.isRequired,
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
