/* globals NSString, context, MSPluginScript, MSPluginCommand, AppController, NSApp */
import { spawn, exec, execSync } from '@skpm/child_process'
import * as fs from '@skpm/fs'

const PATH_TO_BUNDLE = `${context.plugin.url().path()}/Contents/Resources`
const SCRIPTS_PATH = `${PATH_TO_BUNDLE}/.scripts`

export function clearScriptsCache() {
  const child = spawn('rm', ['-rf', SCRIPTS_PATH])
  child.on('close', () => {
    spawn('mkdir', ['-r', SCRIPTS_PATH])
  })
}

export function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: PATH_TO_BUNDLE }, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      if (stderr) {
        return reject(stderr)
      }
      return resolve(stdout)
    })
  })
}

function executeScript(script) {
  const pluginScript = MSPluginScript.alloc().initWithString_filename(
    script,
    `test.js`
  )

  const command = MSPluginCommand.alloc().initWithScript_identifier_name_runHandler_scope(
    pluginScript,
    'com.bohemiancoding.sketch.runscriptidentifier',
    'test',
    'onRun',
    'document'
  )

  AppController.sharedInstance().runPluginCommand_fromMenu_context(
    command,
    true,
    {}
  )
}

export function runScript(rawScript, compile) {
  // BCDefaultsSetValueForKey([inputField string], ScriptEditorLastRunKey);
  let script
  try {
    if (compile) {
      // use a hash of the script to avoid rebundling every time
      const hash = NSString.stringWithString(rawScript).hash()
      const pathToRawFile = `${SCRIPTS_PATH}/${hash}.js`
      const pathToBundledFile = `${SCRIPTS_PATH}/Contents/Sketch/${hash}.js`

      if (!fs.existsSync(pathToBundledFile)) {
        fs.writeFileSync(
          pathToRawFile,
          `const sketch = require('sketch')\n\nexport default function (context) {\n${rawScript}\n}\n`,
          'utf8'
        )
        execSync(`node ./build-script.js ${hash}.js`, { cwd: PATH_TO_BUNDLE })
      }

      script = fs.readFileSync(pathToBundledFile, 'utf8')
    } else {
      script = `const sketch = require('sketch')\n\nvar onRun = function (context) {\n${rawScript}\n}\n`
    }

    executeScript(script)
  } catch (err) {
    return err
  }

  NSApp.delegate().refreshCurrentDocument()

  return undefined
}
