import { ExtensionContext, WorkspaceConfiguration, Uri, workspace, TerminalExitReason, window, commands, TabInputText, TabInputCustom } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import { Coqnitive } from "./extension";
import { CoqLspClient } from "./lsp-client/client";
import { CoqLspClientFactory } from "./lsp-client/clientTypes";


function createBundledPath(context: ExtensionContext): string {
    const binaryExtension = process.platform === "win32" ? ".exe" : "";
    const path = Uri.joinPath(context.extensionUri, "server", `coq-lsp${binaryExtension}`).toString();
    console.log(path);

    if (path.startsWith("file://")) {
        return path.substring("file://".length);
    }
    return path;
}

/**
 * This function is responsible for creating lsp clients with the extended
 * functionality specified in the interface CoqFeatures
 *
 * @param clientOptions the options available for a LanguageClient (see vscode api)
 * @param wsConfig the workspace configuration of coqnitive
 * @returns an LSP client with the added functionality of `CoqFeatures`
 */
const clientFactory: CoqLspClientFactory = (clientOptions: LanguageClientOptions, wsConfig: WorkspaceConfiguration, context: ExtensionContext) => {    
    
    
    // commands.executeCommand("vscode.getEditorLayout").then(console.log);

    // commands.executeCommand("vscode.setEditorLayout", {
    //     orientation: 0, groups: [{size: 0.4 }, {size: 0.6, }] 
    // })
    // console.log(window.tabGroups.all);

    // const path = (wsConfig.path != null) ? wsConfig.path : createBundledPath(context);
    const path = wsConfig.path ?? createBundledPath(context);

    const serverOptions: ServerOptions = {
        command: path,
        args: wsConfig.args,
    };
    return new (CoqLspClient(LanguageClient))(
        "coqnitive",
        "Waterproof Document Checker",
        serverOptions,
        clientOptions,
    );
};


export function activate(context: ExtensionContext): void {
    let extension: Coqnitive = new Coqnitive(context, clientFactory);
    context.subscriptions.push(extension);
    // start the lsp client
    extension.initializeClient();
}

export function deactivate(): void {
    // TODO: stop client
    return;
}
