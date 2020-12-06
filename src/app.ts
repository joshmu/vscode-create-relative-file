import * as path from 'path'

import * as fs from 'fs-extra'
import * as vscode from 'vscode'

export class App {
  getCurrentDirectory(): string | void {
    const currentPath = vscode.window.activeTextEditor?.document.uri.fsPath
    if (!currentPath) return
    const currentDirectory = path.parse(currentPath).dir
    return currentDirectory
  }

  getWorkspacePath(): string | void {
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders) return
    const workspaceFolderPath = workspaceFolders[0].uri.path
    return workspaceFolderPath
  }

  parseUserInput(userInput: string): string[] {
    let files = userInput.split(/[\s|\+|,]/).map(e => e.trim())
    return files
  }

  getFullPaths(files: string[], currentDirectory: string): string[] {
    const filePaths = files.map(file => path.join(currentDirectory, file))
    return filePaths
  }

  async createFile(filePath: string) {
    return fs.outputFile(filePath, '', {
      encoding: 'utf8',
      flag: 'wx',
    })
  }

  pathSummary({
    directoryPath,
    folderLimit = 2,
  }: {
    directoryPath: string
    folderLimit?: number
  }): string {
    return (
      '.../' +
      directoryPath.split(/\//g).slice(-folderLimit).join('/') +
      '/<HERE>'
    )
  }

  showInfoMsg({ msg }: { msg: string }) {
    vscode.window.showInformationMessage(msg)
  }

  showErrorMsg({ error, msg }: { error?: Error; msg: string }) {
    if (error) console.error(error)
    vscode.window.showErrorMessage(msg)
  }
}
