const clearButton = document.querySelector('#clear-button')
const activeFilterButton = document.querySelector('#active')
const completedFilterButton = document.querySelector('#completed')
const showAllButton = document.querySelector('#all')

const todos = document.querySelector('.todos')
const input = document.querySelector('#input')
const theme = document.querySelector('.theme-icon')

const todoCount = document.querySelector('#todo-count')

theme.addEventListener('click', (e) => {
  document.body.classList.toggle('dark')
  if (e.target.src.includes('/images/icon-moon.svg')) e.target.src = '/images/icon-sun.svg'
  else e.target.src = '/images/icon-moon.svg'
  console.log(e.target.src)
})

let todoList = JSON.parse(localStorage.getItem('todos')) || [
  /*{
    text: 'Complete online javascript course',
    isChecked: true,
  },
  {
    text: 'Jog around the park 3x',
    isChecked: false,
  },
  {
    text: '10 minutes meditarian',
    isChecked: false,
  },
  {
    text: 'Read for 1 hour',
    isChecked: false,
  },
  {
    text: 'Pick up groceries',
    isChecked: false,
  },
  {
    text: 'Complete Todo app of frontendmentor',
    isChecked: false,
  },*/
]

showExistingTodos(todoList, 'all')

input.addEventListener('keydown', (e) => {
  if(e.key == 'Enter') {
    let todoText = e.target.value
    // clear input
    e.target.value = ''
    todoList.push({
      text: todoText,
      isChecked: false
    })
    updateStorage()
    todoCount.textContent = todoList.filter(i => i.isChecked == false).length

    // create todo
    createTodo(todoText)
  }
})

clearButton.addEventListener('click', () => {
  // convert to an array since you can't apply foreach on an html collection
  Array.from(todos.children).forEach(todo => {
    if (todo.classList.contains('checked')) deleteTodo(todo, true)
  })
})

showAllButton.addEventListener('click', () => {
  deleteAllTodos()
  showExistingTodos(todoList, 'all')
})
activeFilterButton.addEventListener('click', () => {
  deleteAllTodos()
  showExistingTodos(todoList, 'active')
})
completedFilterButton.addEventListener('click', () => {
  deleteAllTodos()
  showExistingTodos(todoList, 'completed')
})


function toggleTodo(el) {
  el.classList.toggle('checked')
}

function deleteTodo(el, isPermanent) {
  /*if (isPermanent) todoList.splice(Array.from(todos.children).findIndex(el), 1)*/
  if (isPermanent) {
    let text = el.querySelector('p').textContent
    todoList = todoList.filter(cur => cur.text != text)
    updateStorage()
    todoCount.textContent = todoList.filter(i => i.isChecked == false).length
  }
  /*if (isPermanent) {
    for (let val in todoList) {
      console.log(val, todoList[val])
      todoList.
    }
  }*/

  el.remove()
}

function deleteAllTodos() {
  // convert to an array since you can't apply foreach on an html collection
  Array.from(todos.children).forEach(todo => {
    deleteTodo(todo)
  })
}

function createTodo(todoText, isChecked) {
  const todoContainer = document.createElement('div')
  isChecked ? todoContainer.classList.add('todo', 'box', 'checked') : todoContainer.classList.add('todo', 'box')
  
  const text = document.createElement('p')
  text.textContent = todoText

  const circle = document.createElement('div')
  circle.classList.add('circle')
  circle.addEventListener('click', e => { 
    toggleTodo(e.target.parentElement)
    let index = todoList.findIndex(i => i.text == todoText)
    todoList[index].isChecked = !todoList[index].isChecked
    todoCount.textContent = todoList.filter(i => i.isChecked == false).length
    updateStorage()
  })

  const checkImage = document.createElement('img')
  checkImage.src = "./images/icon-check.svg"

  const crossImage = document.createElement('img')
  crossImage.src = "./images/icon-cross.svg"
  crossImage.classList.add('cross')
  crossImage.addEventListener('click', e => deleteTodo(e.target.parentElement, true))

  circle.appendChild(checkImage)
  todoContainer.appendChild(circle)
  todoContainer.appendChild(text)
  todoContainer.appendChild(crossImage)

  todos.appendChild(todoContainer)
}

function showExistingTodos(list, filter) {
  for (let { text, isChecked } of list) {
    if (filter == 'active' && !isChecked) createTodo(text, isChecked)
    else if (filter == 'completed' && isChecked) createTodo(text, isChecked)
    else if (filter == 'all') createTodo(text, isChecked)
  }
}

function updateStorage() {
  localStorage.setItem('todos', JSON.stringify(todoList))
}
