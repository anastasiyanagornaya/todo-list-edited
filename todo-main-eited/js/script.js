"use strict";
let fullTaskList = [];
let taskTemplate = document.querySelector('#task-template').content;
var newItemTemplate = taskTemplate.querySelector('.todo-list-item');
let changeTaskTemplate = document.querySelector('#change-task-template').content;
let changeTask = changeTaskTemplate.querySelector('.inplaceeditor');

let list = document.querySelector('.todo');
let items = list.children;
let emptyListMessage = document.querySelector('.empty-list'); 
let newItem = document.querySelector('.create-new-item');
let newItemTitle = newItem.querySelector('.create-new-item-input');

let delAll = document.querySelector('.delete-done-items-panel');

let doneList = document.querySelector('.done-list');
let doneItems = doneList.children;
let emptyDoneListMessage = document.querySelector('.empty'); 
let done_prbar = document.querySelector('.done-progress');
let todo_prbar = document.querySelector('.todo-progress');

/******************* create task while initialization ******************/
function CreateTodoTask(taskName, taskDate) {
  let task = newItemTemplate.cloneNode(true);
  let taskDescription = task.querySelector('span');
  task.setAttribute("title", taskDate);
  taskDescription.textContent = taskName; // +" " + "//Date:" + `${taskDate}`
  list.appendChild(task);
}

function CreateDoneTask(taskName, taskDate) {
  let task = newItemTemplate.cloneNode(true);
  let taskDescription = task.querySelector('span');
  task.setAttribute("title", taskDate);
  taskDescription.textContent = taskName; //+`${taskDate}`
  doneList.appendChild(task);
}

/******************** rebuild lists on insert *****************************/
function CreateTodoList() {
  list.innerHTML='';
  for (let i = 0; i < fullTaskList.length; i++){
    if (fullTaskList[i].done == false) {
        CreateTodoTask(fullTaskList[i].text, fullTaskList[i].date);
      }
    }  
  for (let i = 0; i < items.length; i++) {
    taskChange(items[i]);
    addCheckHandler(items[i]);
  }
  TodoDelHandler();
}

function CreateDoneList() {
  doneList.innerHTML='';
  for (let i = 0; i < fullTaskList.length; i++){
    if (fullTaskList[i].done == true)  {
        CreateDoneTask(fullTaskList[i].text, fullTaskList[i].date);
      }
    }  
  for (let i = 0; i < doneItems.length; i++) {
    addCheckHandler(doneItems[i]);
    taskChange(doneItems[i]);
    let taskCheckBox = doneItems[i].querySelector('input');
    taskCheckBox.checked = true;
  }  
  DoneDelHandler();
}

/****************** progress bar ******************/
function changeProgressBar() {
  let progress = (doneItems.length / (items.length + doneItems.length))*100;
  done_prbar.setAttribute("style", "width:" + progress + "%;"); 
  todo_prbar.setAttribute("style", "width:" + progress + "%;"); 
}

/****************** show message ******************/
let toggleEmptyListMessage = function() {
    if (items.length === 0) {
        emptyListMessage.classList.remove('hidden');
    }
    else {
        emptyListMessage.classList.add('hidden');
    }
};

let toggleEmptyDoneListMessage = function() {
  if (doneItems.length === 0) {
    emptyDoneListMessage.classList.remove('hidden');
  }
  else {
    emptyDoneListMessage.classList.add('hidden');
  }
};

/********************* change list **********************/
//sort the array of the tasks objects
function sortByDate(arr){
  arr.sort((a, b) => a.date > b.date ? 1 : -1); 
}

let addCheckHandler = function(item) {
    let checkbox = item.querySelector('.checkbox');
    checkbox.addEventListener('change', function() {
      if (checkbox.parentElement.parentElement.className == 'todo')
      {
        doneList.append(item);
        for (let i = 0; i<fullTaskList.length; i++) {
          if ((fullTaskList[i].text == checkbox.parentElement.querySelector('span').textContent) && (fullTaskList[i].date == item.getAttribute('title'))) {
            fullTaskList[i].done = true;
          }
        };
        CreateDoneList();
      }
      else
      {
        list.append(item);
        for (let i = 0; i<fullTaskList.length; i++) {
          if ((fullTaskList[i].text == checkbox.parentElement.querySelector('span').textContent) && (fullTaskList[i].date == item.getAttribute('title'))) {
            fullTaskList[i].done = false;
            }
          };
        CreateTodoList();  
      }
      newItemTitle.focus();
      toggleEmptyListMessage();
      toggleEmptyDoneListMessage();
      changeProgressBar(); 
      sortByDate(fullTaskList);
      localStorage.setItem('elems', JSON.stringify(fullTaskList));
    });
};

/*******************  initialization ******************/
let temp = JSON.parse(localStorage.getItem('elems'));
if (temp === null){
  let tasksArray = [
                    {text: "Howdy. Let's get you up and running.", done: false}, 
                    {text: "All changes are saved locally, automatically.", done: false},
                    {text: "Drag this item onto another list (on the right) to transfer it.", done: false}, 
                    {text: "Drag this item up or down to re-order it.", done: false}, 
                    {text: "Drag the list, Example template, over this lists title above.", done: false},
                    {text: "The list, Important Info, is worth a quick look.", done: false},
                    {text: "All done. Tick all the items off then hit the trash icon below.", done: false}];
  for (let i=0; i<tasksArray.length; i++) {
    let taskMadeDate = new Date();
    let parsedDate = Date.parse(taskMadeDate.toString());
    tasksArray[i].date = parsedDate + (+[i]);
    CreateTodoTask(tasksArray[i].text, tasksArray[i].date);
  }
  fullTaskList = tasksArray;
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyDoneListMessage();
}
else{
  fullTaskList = temp;
  for (let i = 0; i < fullTaskList.length; i++){
    if (fullTaskList[i].done == false) {
      CreateTodoTask(fullTaskList[i].text, fullTaskList[i].date);
      }
      else {
      CreateDoneTask(fullTaskList[i].text, fullTaskList[i].date);
      }
    }
    toggleEmptyListMessage();  
  toggleEmptyDoneListMessage();
  }

let dels = list.querySelectorAll('.delete-item');
let dels_done = doneList.querySelectorAll('.delete-item');

/********************* change task on db click **************************/
function taskChange(item) {
  item.addEventListener('dblclick', function() {
  let changeTaskDescription = item.querySelector('span').textContent;//получение старого текста задачи и сохранение в переменную
  let newTask = item.querySelector('span');// получем спан
  let changedItem = changeTask.cloneNode(true); //замена новым шаблоном
  let inputChanged = changedItem.querySelector(".input-new-task");  //получаем инпут, куда запишем новую задачу
  inputChanged.value = changeTaskDescription;//запись в строку ввода нового шаблона текста из старого
  item.replaceWith(changedItem);//
  inputChanged.select();

  let elementForm = changedItem.querySelector('.form'); //получаем форму нового шаблона
  let saveButton = elementForm.querySelector('.save');// получаем кнопку сохранения изменений
  let canselButton = elementForm.querySelector('.cansel');//кнопка отмены изменений

  /********************* save changes **************************/
  function saveItem() {
    let taskDescription;  //= inputChanged.value;//записываем новое имя задач
    for (let i = 0; i<fullTaskList.length; i++) {
      if (fullTaskList[i].text == changeTaskDescription) {
        taskDescription = inputChanged.value;
        fullTaskList[i].text = inputChanged.value;
      }
    }
    changedItem.replaceWith(item);
    newTask.textContent = taskDescription;
    newItemTitle.focus();
    localStorage.setItem('elems', JSON.stringify(fullTaskList));
  }

  saveButton.addEventListener ('click', function(evt) { //сохраняем изменения по кнопке save
    evt.preventDefault();
    saveItem();
  });

  item.addEventListener('keydown', function(evt) {//сохраняем изменения по нажатию  enter
    if (evt.keyCode == 13) {
      evt.preventDefault();
      saveItem();
    }
  });

  /********************* cancel changes **************************/
  canselButton.addEventListener('click', function() {//отменяем изменения по нажатию кнопки cansel
    let taskDescription = changeTaskDescription; // записываем в переменную старое описание задачи
    changedItem.replaceWith(item);
    let newTask = item.querySelector('span');
    newItemTitle.focus();
    newTask.textContent = taskDescription; //перезаписываем имя задачи на старое
    });
  }); 
}

for (let i = 0; i < items.length; i++) {
  taskChange(items[i]);
  addCheckHandler(items[i]);
}

for (let i = 0; i < doneItems.length; i++) {
  addCheckHandler(doneItems[i]);
  taskChange(doneItems[i]);
  let taskCheckBox = doneItems[i].querySelector('input');
  taskCheckBox.checked = true;
}

changeProgressBar(); 

/********************* create new task **************************/
newItem.addEventListener('keydown', function(evt) {
  if (evt.keyCode === 13) {
    if (newItemTitle.value == "") {
      alert("Did you forget to type your item?");
    }
    else {
      let obj = {};
      let taskMadeDate = new Date();
      let parsedDate = Date.parse(taskMadeDate.toString());
      let taskText = newItemTitle.value;
      let task = newItemTemplate.cloneNode(true);
      let taskDescription = task.querySelector('span');
      taskDescription.textContent = taskText; //+" " + "//Date:" + `${parsedDate}`
      addCheckHandler(task);
      list.appendChild(task);//insert new item
      newItemTitle.value = '';
      changeProgressBar(); 
      let delH = task.querySelector('.delete-item');
      DelHandler(delH);
      taskChange(task);
      obj.text = taskText;
      obj.done = false;
      obj.date = parsedDate + fullTaskList.length;
      task.setAttribute("title", obj.date);
      fullTaskList.push(obj);
      localStorage.setItem('elems', JSON.stringify(fullTaskList));
      toggleEmptyListMessage();  
    }
  }
});
/********************* delete one task **************************/
let DelHandler = function(del) {
  del.addEventListener('click', function() {
  for (let i = 0; i<fullTaskList.length; i++) {
    if (fullTaskList[i].text == del.parentNode.querySelector('span').textContent) {
      fullTaskList.splice(i,1);
    }
  }  
  del.parentNode.remove();
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyListMessage();
  toggleEmptyDoneListMessage();
  changeProgressBar(); 
  });
};

function TodoDelHandler(){
  dels = list.querySelectorAll('.delete-item');
  for (let i = 0; i < dels.length; i++) {
    DelHandler(dels[i]);
  } 
}

function DoneDelHandler(){
  dels_done = doneList.querySelectorAll('.delete-item');
  for (let i = 0; i < dels_done.length; i++) {
    DelHandler(dels_done[i]);
  }   
}

TodoDelHandler();
DoneDelHandler();

/********************* delete all tasks **************************/
delAll.onclick = function() {
  doneList.innerHTML='';
  for (let i = fullTaskList.length-1; i>=0; i--) {
    if (fullTaskList[i].done == true) {
      fullTaskList.splice(i,1);
    }
  }
  newItemTitle.focus();
  localStorage.setItem('elems', JSON.stringify(fullTaskList));
  toggleEmptyDoneListMessage();
} 