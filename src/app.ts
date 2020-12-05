import * as path from 'path'

import * as vscode from 'vscode'

export class App {
  getRelativePath(targetUri?: vscode.Uri): string {
    let thePath: vscode.Uri = null!
    const activeUri: vscode.Uri | undefined =
      vscode.window.activeTextEditor?.document?.uri

    if (activeUri) {
      thePath = activeUri
    }

    // if relative is undefined then let's default to root
    if (activeUri === undefined) {
      vscode.window.showErrorMessage(
        "Can't find relative path, using root path instead."
      )
      const workspaceFolders = vscode.workspace.workspaceFolders
      if (workspaceFolders === undefined) {
        vscode.window.showErrorMessage('No workspace available, aborting.')
        return ''
      }

      const projectRoot = workspaceFolders[0].uri
      thePath = projectRoot
    }

    const activeDir = path.parse(thePath.fsPath).dir
    // console.log(activeDir)
    return activeDir

    // const targetPath = targetUri.fsPath
    // const relativePath = path.relative(activeDir, targetPath)
    // return relativePath
  }
}
