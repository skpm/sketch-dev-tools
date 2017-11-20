import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/lint/lint'

import { setScriptValue, runScript } from '../../redux/ducks/playground'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'

const mapStateToProps = state => ({
  currentScript: state.playground.currentScript,
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

const Playground = ({ currentScript, dispatch }) => (
  <Wrapper>
    <TopBar>
      <ButtonFilter
        title="Run Script (cmd + R)"
        onClick={() => dispatch(runScript(currentScript))}
      >
        ▶︎
      </ButtonFilter>
    </TopBar>
    <Codemirror
      value={currentScript}
      options={codeMirrorOptions}
      onChange={text => dispatch(setScriptValue(text))}
    />
  </Wrapper>
)

Playground.propTypes = {
  currentScript: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Playground)
