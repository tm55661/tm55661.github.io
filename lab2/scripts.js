
class TodoList {
  constructor() {
    this.tasks = [];
    this.term = "";
    this.list = document.getElementById("task-list")
    this.message = document.getElementById("message");
    this.editor = null;

    try{
      this.tasks = JSON.parse(localStorage.getItem("labB")) || [];
    } catch{
      this.message.textContent = "No tasks found.";
    }
    this.draw();

  }

  validate(name, deadline, oldDeadline = "") {
    if (name.trim().length < 3 || name.trim().length > 255) {
      throw new Error("Zadanie musi mieć od 3 do 255 znaków.");
    }
    // Stary termin może już minąć. Sprawdzamy nowy lub zmieniony termin.
    if (deadline && deadline !== oldDeadline &&
      (!Number.isFinite(new Date(deadline).getTime()) || new Date(deadline) <= new Date())) {
      throw new Error("Podaj termin w przyszłości albo zostaw puste pole.");
    }
  }

  add(name, deadline="") {
    this.validate(name, deadline);
    this.tasks.push({ name: name.trim(), deadline: deadline });
    this.save();
    this.draw();
  }

  save() {
    try{
      localStorage.setItem("labB", JSON.stringify(this.tasks));
      this.message.textContent = "";
    } catch {
      this.message.textContent = "Nie można zapisać zadań w pamięci.";
    }

  }

  remove(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();

  }

  edit(index, name, deadline) {
    this.validate(name, deadline, this.tasks[index].deadline);
    this.tasks[index] = { name: name.trim(), deadline: deadline };
    this.save();
    this.draw();
  }

  highlight(element, text) {
    const phrase = this.term.toLowerCase();
    let start = 0;
    let position = text.toLowerCase().indexOf(phrase);

    if(phrase.length < 2){
      element.textContent = text;
      return;
    }
    while (position !== -1){
      element.append(text.slice(start, position));
      const mark = document.createElement("mark");
      mark.textContent = text.slice(position, position + phrase.length);

      element.append(mark);
      start = position + phrase.length;
      position = text.toLowerCase().indexOf(phrase, start);
    }
    element.append(text.slice(start));

  }

  draw(){
    this.list.replaceChildren();
    this.editor = null;

    this.tasks.forEach((task, index) => {
      if (this.term.length >= 2 && !task.name.toLowerCase().includes(this.term.toLowerCase())) {
        return;
      }

      const li = document.createElement("li");
      li.className = "task";
      const content = document.createElement("div");
      content.className = "task-content";
      const name = document.createElement("span");
      this.highlight(name, task.name);
      content.appendChild(name);

      if (task.deadline) {
        const date = document.createElement("time");
        date.dateTime = task.deadline;
        date.textContent = new Date(task.deadline).toLocaleString("pl-PL");
        content.append(date);
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "delete";
      button.textContent = "Usuń";
      button.addEventListener("click", () => this.remove(index));

      content.addEventListener("click", event => {
        event.stopPropagation();
        this.finishEdit();
        if(!this.editor && content.isConnected) this.startEdit(index, content);
      });
      li.append(content, button);
      this.list.append(li);


    });

    const empty = document.getElementById("empty-message");
    empty.hidden = this.list.children.length > 0;
    empty.textContent = this.tasks.length === 0 ? "Brak zadań." : "Brak pasujących zadań.";
  }

  startEdit(index, content) {
    const name = document.createElement("input");
    name.value = this.tasks[index].name;
    name.maxLength = 255;
    name.setAttribute("aria-label", "Treść zadania");
    const date = document.createElement("input");
    date.type = "datetime-local";
    date.value = this.tasks[index].deadline;
    date.setAttribute("aria-label", "Termin zadania");
    const editor = document.createElement("div");
    editor.className = "editor";
    editor.append(name, date);
    content.replaceWith(editor);

    this.editor = { index: index, element: editor, name: name, date: date };

    editor.addEventListener("focusout", event => {
      if (!editor.contains(event.relatedTarget)) {
        setTimeout(() => {
          if (editor.isConnected && this.editor.element === editor) this.finishEdit();
        }, 0);
      }
    });
    name.focus();
  }

  finishEdit(){
    if (!this.editor) return;
    const editor = this.editor;
    try {
      this.edit(editor.index, editor.name.value, editor.date.value);
    } catch (error) {
      this.message.textContent = error.message;
    }
  }

}

document.todo = new TodoList();


document.addEventListener("click", event => {
  const editor = document.todo.editor;
  if (editor && !editor.element.parentElement.contains(event.target)) {
    document.todo.finishEdit();
  }
});

document.getElementById("task-search").addEventListener("input", event => {
  document.todo.finishEdit();
  if (document.todo.editor) return;
  document.todo.term = event.target.value;
  document.todo.draw();
});

document.getElementById("task-form").addEventListener("submit", event => {
  event.preventDefault();
  document.todo.finishEdit();
  if (document.todo.editor) return;
  const name = document.getElementById("task-name");
  const deadline = document.getElementById("task-deadline");
  try {
    document.todo.add(name.value, deadline.value);
    event.target.reset();
  } catch (error) {
    document.todo.message.textContent = error.message;
  }
});
