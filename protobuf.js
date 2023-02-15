export class Field {
  constructor(id, type, value) {
    this.id = id;
    this.type = type;
    this.value = value;
  }

  count() {
    return 1;
  }

  toString() {
    let valueStr;
    if (typeof this.value === "boolean") {
      valueStr = +this.value; // cast to int
    } else {
      valueStr = this.value;
    }
    return `${this.id}${this.type}${valueStr}`;
  }
}

export class Message {
  constructor(id, fields) {
    this.id = id;
    this.fields = fields;
  }

  count() {
    return this.fields.reduce((acc, field) => acc + field.count(), 1);
  }

  toString(isParent = false) {
    const fieldsStr = this.fields
      .sort((a, b) => a.id - b.id)
      .map((f) => f.toString())
      .join("!");
    if (isParent) {
      return `!${fieldsStr}`;
    } else {
      const count = this.count();
      return `${this.id}m${count - 1}!${fieldsStr}`;
    }
  }
}
