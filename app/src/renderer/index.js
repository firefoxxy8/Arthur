import {ipcRenderer, remote} from "electron";
import {readFile} from "fs";

import {COMMANDS} from "../shared/constants";
import {Document} from "./Document";
import {Editor} from "./Editor";

const {BrowserWindow, dialog} = remote;

const importFile = async (filePath) => {
	const source = await readFileAsync(filePath, "utf8");
	const doc = Document.deserialize(filePath, source);
	const editor = new Editor({ doc });
	$host.appendChild(editor.getDOM());
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
			err ? reject(err) : resolve(contents); });
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
