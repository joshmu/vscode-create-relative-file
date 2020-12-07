import * as path from 'path'

import * as fs from 'fs-extra'
import * as vscode from 'vscode'

export class App {
  async create(
    fullPaths: string[]
  ): Promise<{ filePaths: string[]; folderPaths: string[] }> {
    const { filePaths, folderPaths } = this.parseFileOrFolder(fullPaths)

    const createFilePromises = filePaths.map(this.createFile)
    const createFolderPromises = folderPaths.map(this.createFolder)

    await Promise.all([...createFilePromises, ...createFolderPromises]).catch(
      error => {
        this.showErrorMsg({
          error,
          msg: 'Some files/folders already exist or could not be created.',
        })
      }
    )

    return { filePaths, folderPaths }
  }

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

  parseUserInput(userInputs: string): string[] {
    let files = userInputs.split(/[\s|,]/).map(input => input.trim())
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

  async createFolder(folderPath: string) {
    return fs.ensureDir(folderPath)
  }

  parseFileOrFolder(
    fullPaths: string[]
  ): { filePaths: string[]; folderPaths: string[] } {
    const filePaths: string[] = []
    const folderPaths: string[] = []

    fullPaths.forEach(fullPath => {
      this.checkIsFile(fullPath)
        ? filePaths.push(fullPath)
        : folderPaths.push(fullPath)
    })

    return { filePaths, folderPaths }
  }

  checkIsFile(filePath: string) {
    const hasTrailingForwardSlash = filePath[filePath.length - 1] === '/'
    const hasPeriod = filePath.split('/').slice(-1)[0].includes('.')
    return !hasTrailingForwardSlash && hasPeriod
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
