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
          prompt: `Create: ${pathSummary}`,
          ignoreFocusOut: true,
          valueSelection: undefined,
        })
        .then(async userInput => {
          if (!userInput) return

          try {
            const paths = app.parseUserInput(userInput)
            const fullPaths = app.getFullPaths(paths, directoryPath as string)

            const { filePaths, folderPaths } = await app.create(fullPaths)

            // if new file created then switch focus to it
            if (filePaths.length) {
              const lastFilePath = filePaths[filePaths.length - 1]
              vscode.workspace.openTextDocument(lastFilePath).then(editor => {
                if (!editor) return
                vscode.window.showTextDocument(editor)
              })
            }
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
