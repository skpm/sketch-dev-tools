import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { css } from 'emotion'
import styled from 'react-emotion'
import LogValue from '../value/value'
import filterLogs from './search'
import {
  ScrollingList,
  ListInner,
  ClearLabel,
  Timestamp,
} from '../list-element'
import { selectValue } from '../../redux/ducks/logs'

const mapStateToProps = state => ({
  logs: state.logs.logs,
  selectedLog: state.logs.selectedLog,
  selectedLogValue: state.logs.selectedLogValue,
  search: state.logs.search,
  types: state.logs.types,
  showLogTimes: state.logs.showLogTimes,
  clearTs: state.logs.clearTs,
})

const Log = styled.li`
  list-style: none;
  background: none white;
  font-size: 12px;
  padding: 0.3rem;
  font-family: Consolas, Menlo, Monaco, 'Lucida Console', monospace;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
`

const LogTypes = {
  error: css`
    background: rgba(183, 49, 40, 0.1);
    color: rgba(183, 49, 40, 1);
    border-color: rgba(183, 49, 40, 0.2);
  `,
  warn: css`
    background: rgba(158, 92, 35, 0.1);
    color: rgba(158, 92, 35, 1);
    border-color: rgba(158, 92, 35, 0.2);
  `,
  info: css`
    background: rgba(0, 55, 241, 0.1);
    color: rgba(0, 55, 241, 1);
    border-color: rgba(0, 55, 241, 0.2);
  `,
}

const Values = styled.ul`
  list-style: none;
  flex: 1;
`

const File = styled.span`
  opacity: 0.3;
  padding: 0 0 0 1.2rem;
`

const selectedValue = css`
  background: none rgba(0, 0, 0, 0.05);
`

const Value = styled.li`
  vertical-align: top;

  &:hover {
    ${selectedValue};
  }
`

const LogList = props => (
  <ScrollingList items={props.logs}>
    <ListInner>
      <ClearLabel>
        Logs cleared at {moment(props.clearTs).format('HH:mm:ss')}
      </ClearLabel>
      {props.logs.filter(filterLogs(props)).map((log, i) => (
        <Log key={i} className={LogTypes[log.type]}>
          {props.showLogTimes && (
            <Timestamp>{moment(log.ts).format('HH:mm:ss.SSS')}</Timestamp>
          )}
          <Values>
            {log.values.map((value, k) => (
              <Value
                className={props.selectedLog === `${i}-${k}` && selectedValue}
                key={`${i}-${k}`}
                onClick={() => props.dispatch(selectValue(`${i}-${k}`, value))}
              >
                <LogValue value={value} search={props.search} />
              </Value>
            ))}
          </Values>
          <File>{log.stack && log.stack[0].file}</File>
        </Log>
      ))}
    </ListInner>
  </ScrollingList>
)

LogList.propTypes = {
  clearTs: PropTypes.number.isRequired,
  showLogTimes: PropTypes.bool.isRequired,
  logs: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    ts: PropTypes.number,
    values: PropTypes.arrayOf(PropTypes.any)
  })).isRequired,
}

export default connect(mapStateToProps)(LogList)
