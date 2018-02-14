import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {schema} from "prosemirror-markdown";

import {baseKeymap} from "prosemirror-commands";
import {history, redo, undo} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";

const DEFAULT_PLUGINS = [
	history(),
	keymap({
		"Mod-y": redo,
		"Mod-z": undo,
	}),
	keymap(baseKeymap),
];

export class Editor {
	constructor({ doc, plugins = [] } = {}) {
		this.state = EditorState.create({
			doc,
			schema,
			plugins: [
				...DEFAULT_PLUGINS,
				...plugins,
			],
		});

		this.dom = document.createElement("div");
		this.dom.classList.add("editor-root");

		this.view = new EditorView(this.dom, {
			dispatchTransaction: this.dispatchTransaction.bind(this),
			state: this.state,
		});
	}

	dispatchTransaction(transaction) {
		const newState = this.view.state.apply(transaction);
		this.view.updateState(newState);
	}

	getDOM() {
		return this.dom;
	}
}
