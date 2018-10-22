import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { Wrapper, TopBar, List } from '../list-element'
import {
  updateWithAncestors,
  updateAlwaysOnTop,
  updateShowTimestamps,
  updateSourcemaps,
} from '../../redux/ducks/settings'

const SettingRow = styled.div`
  padding: 16px;
  margin-top: -1px;
  border-top: 1px solid ${props => props.theme.light};
`

const Note = styled.p`
  min-height: 17px;
  margin: 4px 0 2px;
  font-size: 12px;
  color: ${props => props.theme.lightText};
`

// const SelectLabel = styled.label`
//   margin: 0 0 6px;
//   font-weight: 600;
// `
//
// const Select = styled.select`
//   margin-top: 8px;
//   padding: 6px 24px 6px 8px;
//   font-weight: 400;
//   display: inline-block;
//   max-width: 100%;
//   min-width: 200px;
//   height: 34px;
//   line-height: 20px;
//   color: #24292e;
//   vertical-align: middle;
//   background-repeat: no-repeat;
//   background-position: right 8px center;
//   border: 1px solid #d1d5da;
//   border-radius: 3px;
//   outline: none;
//   box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
//   background: #fff
//     url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAMAAACzvE1FAAAADFBMVEUzMzMzMzMzMzMzMzMKAG/3AAAAA3RSTlMAf4C/aSLHAAAAPElEQVR42q3NMQ4AIAgEQTn//2cLdRKppSGzBYwzVXvznNWs8C58CiussPJj8h6NwgorrKRdTvuV9v16Afn0AYFOB7aYAAAAAElFTkSuQmCC')
//     no-repeat right 8px center;
//   background-size: 8px 10px;
//   -webkit-appearance: none;
//   appearance: none;
// `

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
        <Note>
          When you log a native object, show the methods and properties defined
          by its ancestors in addition to the ones it defines.
        </Note>
        <CheckBoxWrapper>
          <label htmlFor="with_ancestors">
            <CheckBox
              type="checkbox"
              name="with_ancestors"
              checked={settings.withAncestors}
              id="with_ancestors"
              onChange={e =>
                dispatch(updateWithAncestors(e.currentTarget.checked))
              }
            />
            Inspect With Ancestors
          </label>
        </CheckBoxWrapper>
      </SettingRow>
      <SettingRow>
        <Note>
          Always show the devtools on top of Sketch, even when not focused.
        </Note>
        <CheckBoxWrapper>
          <label htmlFor="always_on_top">
            <CheckBox
              type="checkbox"
              name="always_on_top"
              checked={settings.alwaysOnTop}
              id="always_on_top"
              onChange={e =>
                dispatch(updateAlwaysOnTop(e.currentTarget.checked))
              }
            />
            Always On Top
          </label>
        </CheckBoxWrapper>
      </SettingRow>
      <SettingRow>
        <Note>Show the timestamps of the logs and actions.</Note>
        <CheckBoxWrapper>
          <label htmlFor="show_timestamps">
            <CheckBox
              type="checkbox"
              name="show_timestamps"
              checked={settings.showTimestamps}
              id="show_timestamps"
              onChange={e =>
                dispatch(updateShowTimestamps(e.currentTarget.checked))
              }
            />
            Show Timestamps
          </label>
        </CheckBoxWrapper>
      </SettingRow>
      <SettingRow>
        <Note>
          Handle source maps in the stack traces of Errors (might slow logging).
        </Note>
        <CheckBoxWrapper>
          <label htmlFor="sourcemaps">
            <CheckBox
              type="checkbox"
              name="sourcemaps"
              checked={settings.sourcemaps}
              id="sourcemaps"
              onChange={e =>
                dispatch(updateSourcemaps(e.currentTarget.checked))
              }
            />
            Handle Source Maps
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
  dispatch: PropTypes.func,
}

export default connect(mapStateToProps)(Settings)
