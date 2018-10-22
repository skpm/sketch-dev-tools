import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'react-emotion'
import LogValue from '../value/value'
import filterLogs from './search'
import {
  ScrollingList,
  ListInner,
  ClearLabel,
  Timestamp,
} from '../list-element'

const mapStateToProps = state => ({
  logs: state.logs.logs,
  selectedLog: state.logs.selectedLog,
  search: state.logs.search,
  types: state.logs.types,
  showLogTimes: state.settings.showTimestamps,
  clearTs: state.logs.clearTs,
})

const Log = styled.li`
  list-style: none;
  background: none ${props => props.theme.light};
  font-size: 13px;
  padding: 0.3rem;
  font-family: Consolas, Menlo, Monaco, 'Lucida Console', monospace;
  flex-direction: row;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  overflow-x: hidden;
  border-top: 0.5px solid ${props => props.theme.light};
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

const Value = styled.li`
  vertical-align: top;

  ${props =>
    props.selected
      ? `
  background: none ${props.theme.lighter};
  `
      : ''} &:hover {
    background: none ${props => props.theme.lighter};
  }
`

const LogList = props => (
  <ScrollingList items={props.logs} className={props.className}>
    <ListInner>
      {props.clearTs && (
        <ClearLabel>
          Logs cleared at {props.clearTs.format('HH:mm:ss')}
        </ClearLabel>
      )}
      {props.logs.filter(filterLogs(props)).map((log, i) => (
        <Log key={i} className={LogTypes[log.type]}>
          {props.showLogTimes && (
            <Timestamp>{log.ts.format('HH:mm:ss.SSS')}</Timestamp>
          )}
          <Values>
            {log.values.map((value, k) => (
              <Value
                selected={props.selectedLog === `${i}-${k}`}
                key={`${i}-${k}`}
              >
                <LogValue value={value} search={props.search} />
              </Value>
            ))}
          </Values>
          <File title={log.stack ? log.stack[0].file : ''}>
            {log.stack ? log.stack[0].file : ''}
          </File>
        </Log>
      ))}
    </ListInner>
  </ScrollingList>
)

LogList.propTypes = {
  clearTs: PropTypes.any,
  showLogTimes: PropTypes.bool.isRequired,
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      ts: PropTypes.any,
      values: PropTypes.arrayOf(PropTypes.any),
    })
  ).isRequired,
  types: PropTypes.objectOf(PropTypes.bool).isRequired, // eslint-disable-line react/no-unused-prop-types
  selectedLog: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  search: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
}

export default connect(mapStateToProps)(LogList)

export const Dumb = LogList
