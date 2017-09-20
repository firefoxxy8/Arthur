import {app, BrowserWindow} from "electron";
import {join as joinPath} from "path";
import {format as formatURL} from "url";

import {PLATFORM} from "../shared/constants";

export default class Application {
	constructor({APP_PATH, NODE_ENV, PLATFORM, SRC_PATH}) {
		Object.defineProperties(this, {
			APP_PATH: {
				enumerable: true,
				value: APP_PATH,
			},
			NODE_ENV: {
				enumerable: true,
				value: NODE_ENV,
			},
			PLATFORM: {
				enumerable: true,
				value: PLATFORM,
			},
			SRC_PATH: {
				enumerable: true,
				value: SRC_PATH,
			},
			windows: {
				enumerable: true,
				value: new Map(),
			},
		});

		this.onAppActivate = this.onAppActivate.bind(this);
		this.onAllWindowsClosed = this.onAllWindowsClosed.bind(this);
		this.start = this.start.bind(this);
	}

	start() {
		app.on("activate", this.onAppActivate);
		app.on("window-all-closed", this.onAllWindowsClosed);

		this.createMainWindow();
	}

	quit() {
		app.quit();
	}

	createWindow(id, options = {}) {
		if (typeof id !== "string") {
			throw new TypeError("id must be string");
		}

		if (this.windows.has(id)) {
			throw new Error(`Window ${id} already created`);
		}

		const window = new BrowserWindow(options);

		window.once("closed", () => this.windows.delete(id));

		if (options.url) {
			window.loadURL(options.url);
		}

		this.windows.set(id, window);

		return window;
	}

	createMainWindow() {
		const window = this.createWindow("main", {
			show: false,
			title: app.getName(),
			webPreferences: {
				preload: joinPath(this.SRC_PATH, "renderer", "preload.js"),
			},
			url: formatURL({
				pathname: joinPath(this.APP_PATH, "static", "index.html"),
				protocol: "file",
				slashes: true,
				query: {
					SRC_PATH: this.SRC_PATH,
				},
			}),
		});

		window.once("ready-to-show", () => window.show());
	}

	onAllWindowsClosed() {
		if (this.PLATFORM !== PLATFORM.MACOS) {
			this.quit();
		}
	}

	onAppActivate() {
		if (!this.windows.has("main")) {
			this.createMainWindow();
		}
	}
}
