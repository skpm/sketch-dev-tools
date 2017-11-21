/* globals NSPipe, NSTask, NSArray, NSUTF8StringEncoding, NSString */
export default function exec(command) {
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
