// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ruby-json.convertToJson", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return vscode.window.showErrorMessage("Can't find open editor")

    // get the selected text
    let selection = editor.selection
    let textToConvert = editor.document.getText(selection)
    if (!textToConvert) {
      selection = new vscode.Selection(0, 0, editor.document.lineCount, 0)
      textToConvert = editor.document.getText()
    }

    editor.edit((edit) => edit.replace(selection, textToConvert + "ads"))
  })

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
