/* globals log, NSPipe, NSTask, NSArray, NSHomeDirectory, NSFileHandleNotificationDataItem, NSUTF8StringEncoding, NSString, NSNotificationCenter, NSSelectorFromString, NSFileHandleReadCompletionNotification, NSDictionary, NSBundle */
import ObjCClass from 'cocoascript-class'

const LogListener = new ObjCClass({
  _listeners: null,
  _fileHandle: null,
  _task: null,

  startListening(onLog, logPath) {
    this._listeners = NSDictionary.dictionaryWithDictionary({
      onLog,
    })
    log('starting to listen') // creates the log file
    const pipe = NSPipe.pipe()

    this._fileHandle = pipe.fileHandleForReading()
    this._fileHandle.readInBackgroundAndNotify()

    this._task = NSTask.alloc().init()
    this._task.setLaunchPath('/bin/bash')
    this._task.setStandardOutput(pipe)
    this._task.setStandardError(pipe)
    this._task.setArguments(
      NSArray.arrayWithArray(['-c', '-l', `tail -F "${logPath}"`])
    )
    this._task.launch()
  },

  'readLine:': function readLine(notification) {
    const data = notification
      .userInfo()
      .objectForKey(NSFileHandleNotificationDataItem)
    if (!data) {
      return
    }
    const text = String(
      NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
    )

    if (this._listeners) {
      try {
        this._listeners.onLog(text)
      } catch (err) {} // eslint-disable-line
    }

    if (this._task) {
      this._fileHandle.readInBackgroundAndNotify()
    }
  },
})

export default function startListening(onLog, logPath) {
  const listener = LogListener.new()
  listener.startListening(
    onLog,
    logPath ||
      `${String(
        NSHomeDirectory()
      )}/Library/Logs/${NSBundle.mainBundle().bundleIdentifier()}/Plugin Output.log`
  )
  NSNotificationCenter.defaultCenter().addObserver_selector_name_object(
    listener,
    NSSelectorFromString('readLine:'),
    NSFileHandleReadCompletionNotification,
    null
  )

  function stopListening() {
    listener._listeners = null
    listener._task = null
    NSNotificationCenter.defaultCenter().removeObserver(listener)
  }

  return stopListening
}
