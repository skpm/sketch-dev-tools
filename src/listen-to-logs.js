/* globals NSBundle */
import { spawn } from '@skpm/child_process'
import * as os from '@skpm/os'

export default function startListening(
  onLog,
  logPath = `${os.homedir()}/Library/Logs/${NSBundle.mainBundle().bundleIdentifier()}/Plugin Output.log`
) {
  const child = spawn(`tail -F "${logPath}"`, { shell: true })

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', onLog)

  return child.kill
}
