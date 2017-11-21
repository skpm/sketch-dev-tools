/* globals NSPipe, NSTask, NSArray, NSUTF8StringEncoding, NSString, MOPointer, context, NSFileManager, MSPluginScript, MSPluginCommand, AppController, NSApp */

function exec(command) {
  const task = NSTask.alloc().init()
  const pipe = NSPipe.pipe()
  const errPipe = NSPipe.pipe()

  task.setLaunchPath_('/bin/bash')
  task.setArguments_(NSArray.arrayWithArray_(['-c', '-l', command]))
  task.standardOutput = pipe
  task.standardError = errPipe
  task.launch()

  const errData = errPipe.fileHandleForReading().readDataToEndOfFile()
  const data = pipe.fileHandleForReading().readDataToEndOfFile()

  // eslint-disable-next-line
  if (task.terminationStatus() != 0) {
    let message = 'Unknown error'
    if (errData != null && errData.length()) {
      message = NSString.alloc().initWithData_encoding_(
        errData,
        NSUTF8StringEncoding
      )
    } else if (data != null && data.length()) {
      message = NSString.alloc().initWithData_encoding_(
        data,
        NSUTF8StringEncoding
      )
    }
    return message
  }

  return undefined
}

export default function(rawScript) {
  // BCDefaultsSetValueForKey([inputField string], ScriptEditorLastRunKey);
  const errorPointer = MOPointer.alloc().init()

  const PATH_TO_BUNDLE = context.plugin
    .urlForResourceNamed('icon.png')
    .path()
    .replace('/icon.png', '')

  // use a hash of the script to avoid rebundling every time
  const hash = NSString.stringWithString(rawScript).hash()
  const pathToRawFile = `${PATH_TO_BUNDLE}/.scripts/${hash}.js`
  const pathToBundledFile = `${PATH_TO_BUNDLE}/.scripts/Contents/Sketch/${
    hash
  }.js`

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

    try {
      const error = exec(
        `cd "${PATH_TO_BUNDLE}" && node ./build-script.js ${hash}.js`
      )
      if (error) {
        return error
      }
    } catch (err) {
      return err
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

  const output = AppController.sharedInstance().runPluginCommand_fromMenu_context(
    command,
    true,
    {}
  )

  NSApp.delegate().refreshCurrentDocument()
  return output
}
