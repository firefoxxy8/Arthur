"use strict";

const electron = require("electron");
const path = require("path");

const {NODE_ENV} = process.env;

if (NODE_ENV === "development") {
	require("babel-register");
}

const APP_PATH = electron.app.getAppPath();
const SRC_PATH = path.join(
	APP_PATH,
	NODE_ENV === "development" ? "src" : "out"
);

const CONSTANTS = require(path.join(SRC_PATH, "shared", "constants"));
const PLATFORM = (function() {
	switch (process.platform) {
		case "darwin":
			return CONSTANTS.PLATFORM.MACOS;
		case "linux":
			return CONSTANTS.PLATFORM.LINUX;
		case "win32":
			return CONSTANTS.PLATFORM.WINDOWS;
		default:
			return CONSTANTS.PLATFORM.OTHER;
	}
}());

const Application = require(path.join(SRC_PATH, "main", "Application"));
const app = new Application({APP_PATH, NODE_ENV, PLATFORM, SRC_PATH });
electron.app.once("ready", app.start);
