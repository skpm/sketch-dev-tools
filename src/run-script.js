/* globals NSUTF8StringEncoding, NSString, MOPointer, context, NSFileManager, MSPluginScript, MSPluginCommand, AppController, NSApp */
import exec from './exec'

const PATH_TO_BUNDLE = context.plugin
  .urlForResourceNamed('icon.png')
  .path()
  .replace('/icon.png', '')

const SCRIPTS_PATH = `${PATH_TO_BUNDLE}/.scripts`

export function clearScriptsCache() {
  exec(
    `rm -rf "${SCRIPTS_PATH}" && mkdir -r "${SCRIPTS_PATH}" && touch "${
      SCRIPTS_PATH
    }/.gitkeep"`
  )
}

export function runCommand(command) {
  return exec(`cd "${PATH_TO_BUNDLE}" && ${command}`)
}

export function runScript(rawScript) {
  // BCDefaultsSetValueForKey([inputField string], ScriptEditorLastRunKey);
  const errorPointer = MOPointer.alloc().init()

  // use a hash of the script to avoid rebundling every time
  const hash = NSString.stringWithString(rawScript).hash()
  const pathToRawFile = `${SCRIPTS_PATH}/${hash}.js`
  const pathToBundledFile = `${SCRIPTS_PATH}/Contents/Sketch/${hash}.js`

  if (!NSFileManager.defaultManager().fileExistsAtPath(pathToBundledFile)) {
    NSString.stringWithString(
      `${rawScript}\n;export default function () {}`
    ).writeToFile_atomically_encoding_error(
      pathToRawFile,
      true,
      NSUTF8StringEncoding,
      errorPointer
    )
    if (errorPointer.value()) {
      return errorPointer
    }

    const { error } = exec(
      `cd "${PATH_TO_BUNDLE}" && node ./build-script.js ${hash}.js`
    )
    if (error) {
      return error
    }
  }

  const bundledScript = NSString.stringWithContentsOfFile_encoding_error(
    pathToBundledFile,
    NSUTF8StringEncoding,
    errorPointer
  )

  if (errorPointer.value()) {
    return errorPointer
  }

  const pluginScript = MSPluginScript.alloc().initWithString_filename(
    bundledScript,
    'script.js'
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

  NSApp.delegate().refreshCurrentDocument()

  return undefined
}
