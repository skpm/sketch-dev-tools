import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { keyframes, css } from 'emotion'
import styled from 'react-emotion'

import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/lint/lint'

import { setScriptValue, runScript } from '../../redux/ducks/playground'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'

const mapStateToProps = state => ({
  currentScript: state.playground.currentScript,
  loading: state.playground.loading,
  result: state.playground.result,
  runId: state.playground.runId,
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

const editor = css`
  height: calc(100% - 30px);
`

const Playground = ({ currentScript, dispatch, loading, runId }) => (
  <Wrapper>
    <TopBar>
      <ButtonFilter
        title="Run Script (cmd + R)"
        onClick={() => dispatch(runScript(currentScript, runId))}
      >
        ▶︎
      </ButtonFilter>
    </TopBar>
    <Codemirror
      className={editor}
      value={currentScript}
      options={codeMirrorOptions}
      onChange={text => dispatch(setScriptValue(text))}
    />
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
}

export default connect(mapStateToProps)(Playground)
