import cp from "child_process"
import shellEscape from "shell-escape"
import * as vscode from "vscode"

const outputChannel = vscode.window.createOutputChannel("ruby-json")
// outputChannel.show(true)

const log = (message: string, isError: boolean = false) => {
  outputChannel.appendLine(message)
  return isError ? vscode.window.showErrorMessage(message) : vscode.window.showInformationMessage(message)
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("ruby-json.convertToJson", () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return log("Can't find open editor", true)

    const selection = editor.selection.isEmpty ? new vscode.Selection(0, 0, editor.document.lineCount, 0) : editor.selection
    const textToConvert = editor.document.getText(selection)

    const escapedText = shellEscape([textToConvert])
    const command = `echo ${escapedText} | ruby ${__dirname}/converter.rb`
    outputChannel.appendLine(command)
    cp.exec(command, { env: { ...process.env, LC_ALL: "en_US.UTF-8" } }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        // "src/converter.rb:17:in `<main>': Text is not a valid Ruby hash (RuntimeError)"
        const match = error.message.match(/: (.*) \(RuntimeError\)/)
        return log("ruby-json: " + (match?.[1] ? match[1] : error.message), true)
      }
      if (stderr) return log(stderr, true)
      // vscode.window.showInformationMessage("Converted to JSON: " + stdout)

      editor.edit((edit) => edit.replace(selection, stdout))
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
