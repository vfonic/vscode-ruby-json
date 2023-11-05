import cp from "child_process"
import shellEscape from "shell-escape"
import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ruby-json.convertToJson", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return vscode.window.showErrorMessage("Can't find open editor")

    let selection = editor.selection
    let textToConvert = editor.document.getText(selection)
    if (!textToConvert) {
      selection = new vscode.Selection(0, 0, editor.document.lineCount, 0)
      textToConvert = editor.document.getText()
    }

    const escapedText = shellEscape([textToConvert])
    cp.exec(`echo ${escapedText} | ruby ${__dirname}/converter.rb`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        // "src/converter.rb:17:in `<main>': Text is not a valid Ruby hash (RuntimeError)"
        const match = error.message.match(/: (.*) \(RuntimeError\)/)
        return vscode.window.showErrorMessage("ruby-json" + (match?.[1] ? match[1] : error.message))
      }
      if (stderr) return vscode.window.showErrorMessage(stderr)
      // vscode.window.showInformationMessage("Converted to JSON: " + stdout)

      editor.edit((edit) => edit.replace(selection, stdout))
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
