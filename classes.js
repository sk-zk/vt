import { Field, Message } from "./protobuf.js";

export class Layer {
  constructor(id, name, otherFields) {
    this.id = id;
    if (name) {
      this.name = name;
    }
    this.otherFields = otherFields ? otherFields : [];
  }

  toMessage() {
    const message = new Message(2, [
      new Field(1, "e", this.id),
      ...this.otherFields,
    ]);
    if (this.name) {
      message.fields.push(new Field(2, "s", this.name));
    }
    return message;
  }
}

export class Toggle {
  constructor(id, otherFields) {
    this.id = id;
    this.otherFields = otherFields ? otherFields : [];
  }

  toMessage() {
    return new Message(12, [
      new Field(1, "e", this.id),
      ...this.otherFields,
    ]);
  }
}
