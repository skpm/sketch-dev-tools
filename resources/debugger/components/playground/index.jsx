import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { keyframes } from 'emotion'
import styled from 'react-emotion'
import SplitPanel from 'react-split-pane'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/lint/lint'

import { setScriptValue, runScript } from '../../redux/ducks/playground'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'
import { Dumb as LogList } from '../console/log-list'

const mapStateToProps = state => ({
  currentScript: state.playground.currentScript,
  loading: state.playground.loading,
  result: state.playground.result,
  runId: state.playground.runId,
  logs: state.playground.timestamp.start
    ? state.logs.logs.filter(
        l =>
          l.ts >= state.playground.timestamp.start &&
          (state.playground.timestamp.end
            ? l.ts <= state.playground.timestamp.end
            : true)
      )
    : [],
})

const codeMirrorOptions = {
  mode: 'javascript',
  theme: 'base16-tomorrow-light',
  lineNumbers: true,
  styleActiveLine: true,
  // gutters: ['CodeMirror-lint-markers'],
  indentUnit: 2,
  // lint: true,
  extraKeys: {
    Tab: cm => {
      const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
      cm.replaceSelection(spaces)
    },
  },
}

// TODO: catch cmd + R

const LoadingBarContainer = styled.div`
  width: 100%;
  height: 2px;
  position: absolute;
  overflow: hidden;
  z-index: 10;
  bottom: 0;
`

const loadingBarAnimation = keyframes`
0% {
  left: -100%;
}

50% {
  left: 100%;
  transform: rotateY(0deg);
}

51% {
  transform: rotateY(180deg);
}

100% {
  left: -100%;
  transform: rotateY(180deg);
}
`

const LoadingBar = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  animation: ${loadingBarAnimation} 2s ease-out;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  background: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0%,
    #3d85ee 70%
  );
`

const EditorWrapper = styled(SplitPanel)`
  height: calc(100% - 30px) !important;

  .Resizer {
    background: #000;
    opacity: 0.1;
    z-index: 1;
    box-sizing: border-box;
    -webkit-background-clip: padding;
    background-clip: padding-box;
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
    transition: all 2s ease;
  }

  .Resizer:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }

  .CodeMirror,
  .ReactCodeMirror {
    height: 100%;
    width: 100%;
  }
`

const Playground = ({
  currentScript,
  dispatch,
  loading,
  runId,
  result,
  logs,
}) => (
  <Wrapper>
    <TopBar>
      <ButtonFilter
        title="Run Script (cmd + R)"
        onClick={() => dispatch(runScript(currentScript, runId))}
      >
        ▶︎
      </ButtonFilter>
    </TopBar>
    <EditorWrapper defaultSize={300} primary="second">
      <Codemirror
        value={currentScript}
        options={codeMirrorOptions}
        onChange={text => dispatch(setScriptValue(text))}
      />
      <LogList
        logs={
          result
            ? logs.concat({
                ts: Date.now(),
                group: 0,
                plugin: '',
                type: 'log',
                values: [result],
              })
            : logs
        }
        search=""
        showLogTimes={false}
        types={{
          log: true,
          info: true,
          warn: true,
          error: true,
        }}
      />
    </EditorWrapper>
    {loading && (
      <LoadingBarContainer>
        <LoadingBar />
      </LoadingBarContainer>
    )}
  </Wrapper>
)

Playground.propTypes = {
  currentScript: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  runId: PropTypes.number.isRequired,
  result: PropTypes.shape({
    type: PropTypes.string,
    ts: PropTypes.number,
    values: PropTypes.arrayOf(PropTypes.any),
  }),
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      ts: PropTypes.number,
      values: PropTypes.arrayOf(PropTypes.any),
    })
  ).isRequired,
}

export default connect(mapStateToProps)(Playground)
