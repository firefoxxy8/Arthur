"use strict";
import {app, Menu, shell} from "electron";

import createDefaultMenu from "electron-default-menu";

import {COMMANDS} from "../shared/constants";

const createClickHandler = (type, payload = null) => (menuItem, browserWindow, event) => {
	browserWindow.webContents.send("menu-item-clicked", {
		meta: {
			browserWindow,
			event,
			menuItem,
		},
		payload,
		type,
	});
};

export class ApplicationMenu {
	constructor() {
		this.template = createDefaultMenu(app, shell);
		this.template.unshift({
			label: "&File",
			submenu: [
				{
					label: "Open",
					accelerator: "CmdOrCtrl+o",
					click: createClickHandler(COMMANDS.IMPORT_FILE),
				},
			],
		});
	}

	build() {
		return Menu.buildFromTemplate(this.template);
	}
}
