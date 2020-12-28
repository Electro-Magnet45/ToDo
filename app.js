//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const showDiv = document.getElementById("showDiv");
const Div = document.getElementById("overlay");
const cancelButton = document.getElementById("cancelButton");
const nameInput = document.getElementById("nameInput");
const nameSubmit = document.getElementById("nameSubmit");
const nameChangeImage = document.getElementById("changeNameImage");
const datePicker = document.getElementById("datePicker");
const timePicker = document.getElementById("timePicker");
const showDater = document.getElementById("date");

//VARIABLES
var todayDate = new Date().toISOString().slice(0, 10);
const notyf = new Notyf({
  types: [
    {
      type: "added",
      background: "blue",
      duration: 3000,
      icon: false,
    },
    {
      type: "addedWithTime",
      background: "blue",
      duration: 3000,
      icon: false,
    },
    {
      type: "invalid",
      background: "red",
      duration: 3000,
      icon: false,
    },
    {
      type: "delete",
      background: "green",
      duration: 3000,
      icon: false,
    },
    {
      type: "complete",
      background: "mediumspringgreen",
      duration: 3000,
      icon: false,
    },
    {
      type: "name",
      background: "palegreen",
      duration: 3000,
      icon: false,
    },
  ],
});

//Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  getTodos();
  focusInput();
  if (localStorage.getItem("name")) {
    firstImpact();
  }
  secondImpact();

  setTimeout(function () {
    nameChangeImage.style.display = "none";
  }, 3000);

  //GENERATE USERID
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";

  //DISABLE F12
  document.addEventListener(
    "keydown",
    function (e) {
      if (uid !== "450100646453736870428088537363720128024") {
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          disabledEvent(e);
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          disabledEvent(e);
        }
        if (
          e.keyCode == 83 &&
          (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
        ) {
          disabledEvent(e);
        }
        if (e.ctrlKey && e.keyCode == 85) {
          disabledEvent(e);
        }
        if (event.keyCode == 123) {
          disabledEvent(e);
        }
      }
    },
    false
  );
});
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
showDiv.addEventListener("click", showsDiv);
cancelButton.addEventListener("click", showsDiv);
nameSubmit.addEventListener("click", submitName);
document.addEventListener("contextmenu", (event) => event.preventDefault());
showDater.addEventListener("click", showDate);
//Functions

function addTodo(event) {
  //Prevents Form From Submitting
  event.preventDefault();
  if (todoInput.value.length > 0) {
    if (datePicker.value && timePicker.value) {
      let message = todoInput.value;
      let date1 = datePicker.value;
      let time = timePicker.value;
      sendWithDate(date1, time, message);
      datePicker.value = "";
      timePicker.value = "";
      datePicker.style.display = "none";
      timePicker.style.display = "none";

      //To do DIV
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      //Create LI
      const newTodo = document.createElement("li");
      newTodo.innerText = todoInput.value;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);
      //ADD TODO TO LOCAL STORAGE
      saveLocalTodos(todoInput.value);
      //CHECK MARK BUTTON
      const completedButton = document.createElement("button");
      completedButton.innerHTML = '<i class= "fas fa-check"> </i>';
      completedButton.classList.add("complete-btn");
      todoDiv.appendChild(completedButton);
      //CHECK TRASH BUTTON
      const trashButton = document.createElement("button");
      trashButton.innerHTML = '<i class= "fas fa-trash"> </i>';
      trashButton.classList.add("trash-btn");
      todoDiv.appendChild(trashButton);
      //APPEND TO LIST
      todoList.appendChild(todoDiv);
      //CLEAR TODO INPUT VALUE
      todoInput.value = "";
    } else {
      //TOAST NOTIFICAIOTN
      notyf.open({
        type: "added",
        message: "A new To-Do <b>'" + todoInput.value + "'</b> added !",
      });
      //To do DIV
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      //Create LI
      const newTodo = document.createElement("li");
      newTodo.innerText = todoInput.value;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);
      //ADD TODO TO LOCAL STORAGE
      saveLocalTodos(todoInput.value);
      //CHECK MARK BUTTON
      const completedButton = document.createElement("button");
      completedButton.innerHTML = '<i class= "fas fa-check"> </i>';
      completedButton.classList.add("complete-btn");
      todoDiv.appendChild(completedButton);
      //CHECK TRASH BUTTON
      const trashButton = document.createElement("button");
      trashButton.innerHTML = '<i class= "fas fa-trash"> </i>';
      trashButton.classList.add("trash-btn");
      todoDiv.appendChild(trashButton);
      //APPEND TO LIST
      todoList.appendChild(todoDiv);
      //CLEAR TODO INPUT VALUE
      todoInput.value = "";
    }
  } else {
    //TOAST NOTIFICAIOTN
    notyf.open({
      type: "invalid",
      message: "Your To-Do's value should be greater than <b>1</b> letter!",
    });
  }
}

function deleteCheck(e) {
  const item = e.target;
  //DELETE TODO
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    var deletedText = todo.innerText;
    //ANIMATION
    todo.classList.add("fall");
    removeLocalTodos(todo);
    notyf.open({
      type: "delete",
      message: "Your To-Do : <b>'" + deletedText + "'</b> is deleted !",
    });
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //CHECK MARK
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    var completedText = todo.innerText;
    notyf.open({
      type: "complete",
      message: "You (Un)Complete(d) : <b>'" + completedText + "'</b> !",
    });
    todo.classList.toggle("completed");
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveLocalTodos(todo) {
  //CHECK IF THERE IS ANYTHING
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class= "fas fa-check"> </i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //CHECK TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class= "fas fa-trash"> </i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //APPEND TO LIST
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function focusInput() {
  todoInput.focus();
}

function showsDiv() {
  if (Div.style.display === "none") {
    Div.style.display = "block";
    nameInput.focus();
    if (localStorage.getItem("name")) {
      nameInput.placeHolder = localStorage.getItem("name");
    }
  } else {
    Div.style.display = "none";
  }
}

function submitName(event) {
  //Prevents Form From Submitting
  event.preventDefault();
  let toName = nameInput.value;
  var r = confirm(
    "You are going to change your name to '" + nameInput.value + "'"
  );
  if (r == true) {
    localStorage.setItem("name", nameInput.value);
    Div.style.display = "none";
    notyf.open({
      type: "name",
      message: "You have change your name to <b>'" + toName + "'</b> !",
    });
    firstImpact();
  }
}

function disabledEvent(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else if (window.event) {
    window.event.cancelBubble = true;
  }
  e.preventDefault();
  return false;
}

function sendWithDate(date1, time, message) {
  notyf.open({
    type: "addedWithTime",
    message:
      "A new To-Do <b>'" +
      todoInput.value +
      "'</b> added with reminder on " +
      date1 +
      " " +
      time,
  });
  //PUSH NOTIFICATION
  var send = [];
  var toSend = localStorage.getItem("userId");
  send.push(toSend);
  console.log(send);
  $.post("https://onesignal.com/api/v1/notifications", {
    app_id: "d57602c8-437b-4d51-bfbe-8548a2e1c108",
    include_player_ids: send,
    send_after: date1 + " " + time + " GMT+0530",
    data: { foo: "bar" },
    contents: { en: "Your Reminder for " + message },
  });
}

function showDate() {
  if (datePicker.style.display === "none") {
    datePicker.style.display = "block";
    timePicker.style.display = "block";
  } else {
    datePicker.style.display = "none";
    timePicker.style.display = "none";
  }
}

function firstImpact() {
  let name = localStorage.getItem("name");
  showDiv.innerText = name + "'s To Do List";
  todoInput.placeholder = "Hey " + name + ", what brings you here?";
}

function secondImpact() {
  if (localStorage.getItem("isPushNotificationsEnabled")) {
    if (localStorage.getItem("isPushNotificationsEnabled") === "false") {
      showDater.style.display = "none";
    }
  }
}
