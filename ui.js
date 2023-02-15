export function createRadioSelector(
  parentId,
  groupId,
  options,
  callback,
  createCustomField = false
) {
  const div = document.createElement("div");
  for (const option of options) {
    const button = document.createElement("input");
    const id = groupId + "-" + option.value;
    button.type = "radio";
    button.id = id; 
    button.name = groupId;
    if (option.checked) {
      button.checked = true;
    }
    button.addEventListener("change", (_) => {
      callback(option.value);
    });
    div.appendChild(button);

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = option.description;
    div.appendChild(label);

    div.appendChild(document.createElement("br"));
  }
  if (createCustomField) {
    const custom = document.createElement("input");
    const id = groupId + "-custom";
    custom.type = "radio";
    custom.id = id;
    custom.name = groupId;
    div.appendChild(custom);

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerText = "Custom: ";
    div.appendChild(label);

    const textBox = document.createElement("input");
    textBox.type = "number";
    textBox.required = true;
    textBox.min = "0";
    textBox.value = options[0].value;
    div.appendChild(textBox);

    custom.addEventListener("change", (_) => {
      if (textBox.value != "") {
        callback(textBox.value);
      }
    });
    textBox.addEventListener("input", (_) => {
      if (custom.checked && textBox.value != "") {
        callback(textBox.value);
      }
    });

    div.appendChild(document.createElement("br"));
  }
  const container = document.getElementById(parentId);
  container.appendChild(div);
}

export function createCheckBox(
  parentId,
  id,
  description,
  checkedInitially,
  callback
) {
  const div = document.createElement("div");
  const chk = document.createElement("input");
  chk.type = "checkbox";
  chk.id = id;
  chk.name = id;
  chk.checked = checkedInitially;
  chk.addEventListener("change", (_) => {
    callback(chk.checked);
  });
  div.appendChild(chk);
  const label = document.createElement("label");
  label.htmlFor = chk.id;
  label.innerText = description;
  div.appendChild(label);
  const container = document.getElementById(parentId);
  container.appendChild(div);
}
