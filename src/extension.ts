import * as vscode from 'vscode'

import { App } from './app'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'create-relative-file.create',
    () => {
      let activeDocUsed = true
      const app = new App()

      let directoryPath = app.getCurrentDirectory()

      // no active doc
      if (!directoryPath) {
        activeDocUsed = false
        directoryPath = app.getWorkspacePath()
      }

      // no workspace
      if (!directoryPath) {
        app.showErrorMsg({ msg: 'No active document or workspace folder.' })
        return
      }

      let pathSummary = app.pathSummary({
        directoryPath,
        folderLimit: activeDocUsed ? 2 : 1,
      })

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
            const filePaths = app.getFullPaths(files, directoryPath as string)

            const createFilePromises = filePaths.map(app.createFile)

            await Promise.all(createFilePromises).catch(error => {
              app.showErrorMsg({
                error,
                msg: 'Some files already exist or could not be created.',
              })
            })

            const lastFilePath = filePaths.slice(-1)[0]
            vscode.workspace.openTextDocument(lastFilePath).then(editor => {
              if (!editor) return
              vscode.window.showTextDocument(editor)
            })
          } catch (error) {
            app.showErrorMsg({
              error,
              msg: 'Hmmm something went wrong... Let me know on GitHub',
            })
          }
        })
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
