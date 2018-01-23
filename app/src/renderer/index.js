import {ipcRenderer, remote} from "electron";
import {readFile} from "fs";

import {baseKeymap} from "prosemirror-commands";
import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {defaultMarkdownParser, schema} from "prosemirror-markdown";

import {COMMANDS} from "../shared/constants";

const {BrowserWindow, dialog} = remote;

const createEditor = (host, doc = null) => {
	const state = EditorState.create({
		doc,
		schema,
		plugins: [
			history(),
			keymap({"Mod-z": undo, "Mod-y": redo}),
			keymap(baseKeymap),
		],
	});
	const view = new EditorView(host, {state});
	return {state, view};
};

const importFile = async (filePath) => {
	const source = await readFileAsync(filePath, "utf8");
	createEditor($host, defaultMarkdownParser.parse(source));
};

const promptUserForFilePath = () => {
	const options = {
		filters: [
			{name: "Documents", extensions: ["md", "markdown", "txt"]},
			{name: "All Files", extensions: ["*"]},
		],
		properties: [
			"openFile",
		],
	};

	return new Promise((resolve, reject) => {
		const focusedWin = BrowserWindow.getFocusedWindow();
		try {
			const result = dialog.showOpenDialog(focusedWin, options);
			resolve(result[0]);
		} catch (err) {
			reject(err);
		}
	});
};

const readFileAsync = (filePath, options) => {
	return new Promise((resolve, reject) => {
		readFile(filePath, options, (err, contents) => {
			err ? reject(err) : resolve(contents);
		});
	});
};

ipcRenderer.on("menu-item-clicked", (event, command) => {
	switch (command.type) {
		// TODO(bruchmann): Handle potential errors
		case COMMANDS.IMPORT_FILE:
			promptUserForFilePath().then(importFile);
			break;

		default:
			console.warn(`Unhandled command ${command.type}`);
	}
});

const $host = document.createElement("div");
document.body.appendChild($host);
