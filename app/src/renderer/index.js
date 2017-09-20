import {baseKeymap} from "prosemirror-commands";
import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {schema} from "prosemirror-schema-basic";

const $host = document.createElement("div");
document.body.appendChild($host);

const state = EditorState.create({
	schema,
	plugins: [
		history(),
		keymap({"Mod-z": undo, "Mod-y": redo}),
		keymap(baseKeymap),
	],
});

const view = new EditorView($host, {state});
