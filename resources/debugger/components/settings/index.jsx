import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import {
  Wrapper,
  TopBar,
  List,
} from '../list-element'
import {
  updateTheme,
  updateWithAncestors,
  updateAlwaysOnTop,
  updateShowTimestamps
} from '../../redux/ducks/settings'

const SettingRow = styled.div`
  padding: 16px;
  margin-top: -1px;
  border-top: 1px solid #e1e4e8;
`

const Note = styled.p`
  min-height: 17px;
  margin: 4px 0 2px;
  font-size: 12px;
  color: #586069;
`

const SelectLabel = styled.label`
  margin: 0 0 6px;
  font-weight: 600;
`

const Select = styled.select`
  margin-top: 8px;
  padding: 6px 24px 6px 8px;
  font-weight: 400;
  display: inline-block;
  max-width: 100%;
  min-width: 200px;
  height: 34px;
  line-height: 20px;
  color: #24292e;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-position: right 8px center;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(27,31,35,0.075);
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAMAAACzvE1FAAAADFBMVEUzMzMzMzMzMzMzMzMKAG/3AAAAA3RSTlMAf4C/aSLHAAAAPElEQVR42q3NMQ4AIAgEQTn//2cLdRKppSGzBYwzVXvznNWs8C58CiussPJj8h6NwgorrKRdTvuV9v16Afn0AYFOB7aYAAAAAElFTkSuQmCC") no-repeat right 8px center;
  background-size: 8px 10px;
  -webkit-appearance: none;
  appearance: none;
`

const CheckBoxWrapper = styled.div`
  padding-left: 20px;
  margin: 4px 0 15px 0;
  vertical-align: middle;
  font-weight: 600;
`

const CheckBox = styled.input`
  float: left;
  margin: 5px 0 0 -20px;
  vertical-align: middle;
`

const mapStateToProps = state => ({
  settings: state.settings,
})

const Settings = ({ settings, dispatch }) => (
  <Wrapper>
    <TopBar />
    <List>
      <SettingRow>
        <dl>
          <dt><SelectLabel htmlFor="theme_select">Theme</SelectLabel></dt>
          <dd>
            <Select id="theme_select" name="theme_select" className="form-select" value={settings.theme} onChange={e => dispatch(updateTheme(e.currentTarget.value))}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </dd>
        </dl>
      </SettingRow>
      <SettingRow>
        <Note>When you log a native object, show the methods and properties defined by its ancestors in addition to the ones it defines.</Note>
        <CheckBoxWrapper>
          <label htmlFor="with_ancestors">
            <CheckBox type="checkbox" name="with_ancestors" checked={settings.withAncestors} id="with_ancestors" onChange={e => dispatch(updateWithAncestors(e.currentTarget.checked))} />
            Inspect with ancestors
          </label>
        </CheckBoxWrapper>
      </SettingRow>
      <SettingRow>
        <Note>Always show the devtools on top of Sketch, even when not focused.</Note>
        <CheckBoxWrapper>
          <label htmlFor="always_on_top">
            <CheckBox type="checkbox" name="always_on_top" checked={settings.alwaysOnTop} id="always_on_top" onChange={e => dispatch(updateAlwaysOnTop(e.currentTarget.checked))} />
            Always on top
          </label>
        </CheckBoxWrapper>
      </SettingRow>
      <SettingRow>
        <Note>Show the timestamps of the logs and actions.</Note>
        <CheckBoxWrapper>
          <label htmlFor="always_on_top">
            <CheckBox type="checkbox" name="always_on_top" checked={settings.showTimestamps} id="always_on_top" onChange={e => dispatch(updateShowTimestamps(e.currentTarget.checked))} />
            Show timestamps
          </label>
        </CheckBoxWrapper>
      </SettingRow>
    </List>
  </Wrapper>
)

Settings.propTypes = {
  settings: PropTypes.shape({
    withAncestors: PropTypes.bool,
    alwaysOnTop: PropTypes.bool,
    theme: PropTypes.string,
    showTimestamps: PropTypes.bool,
  }),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(Settings)
