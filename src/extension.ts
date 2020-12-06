import * as vscode from 'vscode'

import { App } from './app'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'create-relative-file.create',
    () => {
      const app = new App()

      const currentDirectory = app.getCurrentDirectory()
      if (!currentDirectory) return

      const pathSummary = app.pathSummary(currentDirectory)

      vscode.window
        .showInputBox({
          value: '',
          prompt: `Create File: ${pathSummary}`,
          ignoreFocusOut: true,
          valueSelection: undefined,
        })
        .then(async userInput => {
          if (!userInput) return

          try {
            const files = app.parseUserInput(userInput)
            const filePaths = app.getFullPaths(files, currentDirectory)

            const createFilePromises = filePaths.map(app.createFile)

            await Promise.all(createFilePromises).catch(error => {
              app.showErrorMsg(
                error,
                'Some files already exist or could not be created.'
              )
            })

            const lastFilePath = filePaths.slice(-1)[0]
            vscode.workspace.openTextDocument(lastFilePath).then(editor => {
              if (!editor) return
              vscode.window.showTextDocument(editor)
            })
          } catch (error) {
            app.showErrorMsg(
              error,
              'Hmmm something went wrong... Let me know on GitHub'
            )
          }
        })
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
