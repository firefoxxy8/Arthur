(function() {
	"use strict";

	const path = require("path");
	const url = require("url");

	const {query} = url.parse(window.location.href, true);

	if (process.env.NODE_ENV === "development") {
		require("babel-register");
	}

	const init = () => {
		window.removeEventListener("DOMContentLoaded", init);
		require(path.join(query.SRC_PATH, "renderer", "index.js"));
	};

	window.addEventListener("DOMContentLoaded", init);
}());
