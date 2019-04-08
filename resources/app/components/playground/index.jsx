/* globals document */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { keyframes } from 'react-emotion'
import SplitPanel from 'react-split-pane'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/lint/lint'

import { updatePlaygrounEditorWidth } from '../../redux/ducks/settings'
import {
  setScriptValue,
  runScript,
  runCommand,
} from '../../redux/ducks/playground'
import { Wrapper, TopBar, ButtonFilter } from '../list-element'
import { Dumb as LogList } from '../console/log-list'

const mapStateToProps = state => ({
  updatePlaygrounEditorWidth: state.settings.updatePlaygrounEditorWidth,
  editorWidth: state.settings.playgroundEditorWidth,
  currentScript: state.playground.currentScript,
  loading: state.playground.loading,
  result: state.playground.result,
  runId: state.playground.runId,
  logs: state.playground.timestamp.start
    ? state.logs.logs.filter(
        l =>
          l.ts.isAfter(state.playground.timestamp.start) &&
          (state.playground.timestamp.end
            ? l.ts.isBefore(state.playground.timestamp.end)
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

const LoadingBarContainer = styled.div`
  width: 100%;
  height: 4px;
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
  height: 4px;
  animation: ${loadingBarAnimation} 2s ease-out;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  background: -webkit-linear-gradient(
    left,
    ${props => props.theme.transparentBackground} 0%,
    ${props => props.theme.primary} 70%
  );
`

const EditorWrapper = styled(SplitPanel)`
  height: calc(100% - 30px) !important;

  .Resizer {
    background: ${props => props.theme.heavyText};
    opacity: 0.1;
    z-index: 1;
    box-sizing: border-box;
    -webkit-background-clip: padding;
    background-clip: padding-box;
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid ${props => props.theme.transparentBackground};
    border-right: 5px solid ${props => props.theme.transparentBackground};
    cursor: col-resize;
    transition: all 2s ease;
  }

  .Resizer:hover {
    border-left: 5px solid ${props => props.theme.translucideBackground};
    border-right: 5px solid ${props => props.theme.translucideBackground};
  }

  .CodeMirror-gutters {
    background: ${props => props.theme.background};
    border-right: 0;
  }

  .CodeMirror-linenumber {
    color: ${props => props.theme.lightText};
  }

  .CodeMirror-cursor {
    border-left: 1px solid ${props => props.theme.lightText} !important;
  }

  span.cm-comment {
    color: ${props => props.theme.highlighting.comment};
  }
  span.cm-atom {
    color: ${props => props.theme.highlighting.atom};
  }
  span.cm-number {
    color: ${props => props.theme.highlighting.number};
  }

  span.cm-property {
    color: ${props => props.theme.highlighting.property};
  }
  span.cm-attribute {
    color: ${props => props.theme.highlighting.attribute};
  }
  span.cm-keyword {
    color: ${props => props.theme.highlighting.keyword};
  }
  span.cm-string {
    color: ${props => props.theme.highlighting.string};
  }

  span.cm-variable,
  span.cm-variable-2 {
    color: ${props => props.theme.highlighting.variable};
  }
  span.cm-def {
    color: ${props => props.theme.highlighting.def};
  }
  span.cm-error {
    background: #c66;
    color: #969896;
  }
  span.cm-bracket {
    color: ${props => props.theme.highlighting.bracket};
  }
  span.cm-tag {
    color: ${props => props.theme.highlighting.tag};
  }
  span.cm-link {
    color: ${props => props.theme.highlighting.link};
  }

  .CodeMirror-matchingbracket {
    text-decoration: underline;
  }

  .CodeMirror,
  .ReactCodeMirror {
    height: 100%;
    width: 100%;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    user-select: auto;
  }

  .CodeMirror * {
    -webkit-user-select: auto;
    user-select: auto;
  }
`

const WrappedLogList = styled(LogList)`
  height: calc(100% - 20px);
  position: relative;
`

const Input = styled.input`
  width: 100%;
  border: 0;
  border-top: 1px solid ${props => props.theme.light};
  height: 20px;
  user-select: auto;
  padding-left: 20px;
  outline: none;
  color: ${props => props.theme.text};
  background: ${props => props.theme.background};
`

const BashIcon = styled.span`
  position: absolute;
  bottom: 2px;
  left: 6px;
  color: ${props => props.theme.lightText};
`

class Playground extends React.Component {
  constructor(props) {
    super(props)

    this.onCommandInputKeyDown = this.onCommandInputKeyDown.bind(this)
    this.onRunScript = this.onRunScript.bind(this)
    this.onScriptValueChange = this.onScriptValueChange.bind(this)
    this.commandRListener = this.commandRListener.bind(this)
    this.onEditorWidthChange = this.onEditorWidthChange.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.commandRListener)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.commandRListener)
  }

  onCommandInputKeyDown(e) {
    // enter
    if (e.keyCode === 13) {
      e.preventDefault()
      this.props.dispatch(runCommand(e.currentTarget.value, this.props.runId))
    }
  }

  onRunScript() {
    this.props.dispatch(runScript(this.props.currentScript, this.props.runId))
  }

  onScriptValueChange(editor, data, value) {
    this.props.dispatch(setScriptValue(value))
  }

  onEditorWidthChange(size) {
    this.props.dispatch(updatePlaygrounEditorWidth(size))
  }

  commandRListener(event) {
    if (event.key === 'r' && event.metaKey) {
      this.onRunScript()
    }
  }

  render() {
    const { currentScript, loading, result, logs, editorWidth } = this.props

    return (
      <Wrapper>
        <TopBar>
          <ButtonFilter title="Run Script (cmd + R)" onClick={this.onRunScript}>
            ▶︎
          </ButtonFilter>
        </TopBar>
        <EditorWrapper
          defaultSize={editorWidth}
          onChange={this.onEditorWidthChange}
          primary="second"
        >
          <CodeMirror
            value={currentScript}
            options={codeMirrorOptions}
            onBeforeChange={this.onScriptValueChange}
          />
          <div style={{ height: '100%' }}>
            <WrappedLogList
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
              dispatch={this.props.dispatch}
              types={{
                log: true,
                info: true,
                warn: true,
                error: true,
              }}
            />
            <Input onKeyDown={this.onCommandInputKeyDown} />
            <BashIcon>›</BashIcon>
          </div>
        </EditorWrapper>
        {loading && (
          <LoadingBarContainer>
            <LoadingBar />
          </LoadingBarContainer>
        )}
      </Wrapper>
    )
  }
}

Playground.propTypes = {
  editorWidth: PropTypes.number.isRequired,
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
