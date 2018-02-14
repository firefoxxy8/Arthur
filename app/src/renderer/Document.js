import {
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from "prosemirror-markdown";

export class Document {
	static deserialize(id, content) {
		return new Document({
			id,
			root: defaultMarkdownParser.parse(content),
		});
	}

	static serialize(doc) {
		return {
			content: defaultMarkdownSerializer.serialize(doc.root),
			id: doc.id,
		};
	}

	constructor({ id, root }) {
		this.id = id;
		this.root = root;
	}
}
