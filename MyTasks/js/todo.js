// todo.js
import { database } from './firebase.js';
import {
  ref,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { showError } from './utils.js';

const auth = getAuth();

const todoForm = document.getElementById('todoForm');
const ulTodoList = document.getElementById('ulTodoList');
const todoCount = document.getElementById('todoCount');
const buscas = document.getElementById('buscas');
const searchInput = document.getElementById('search');

let allTasksSnapshot = null; // Armazena snapshot completo para busca local

todoForm.onsubmit = function(event) {
  event.preventDefault();

  const user = auth.currentUser;
  if (!user) return showError('Usuário não autenticado!');

  const name = todoForm.name.value.trim();
  if (name !== '') {
    const data = {
      name,
      nameLowerCase: name.toLowerCase()
    };

    const userTodosRef = ref(database, 'users/' + user.uid);

    push(userTodosRef, data)
      .then(() => {
        console.log(`Tarefa "${data.name}" adicionada com sucesso`);
        todoForm.name.value = '';
      })
      .catch(error => {
        showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error);
      });
  } else {
    alert('O nome da tarefa não pode ser em branco para criar a tarefa!');
  }
};

// Filtro de tarefas por nome (sem acessar o banco novamente)
searchInput.addEventListener('input', () => {
  if (allTasksSnapshot) {
    const termo = searchInput.value.trim().toLowerCase();
    const resultados = filterTasksByTerm(allTasksSnapshot, termo);
    fillTodoList(resultados);
  }
});

function filterTasksByTerm(snapshot, termo) {
  const filtrado = [];
  snapshot.forEach(item => {
    const value = item.val();
    if (value.nameLowerCase?.includes(termo)) {
      filtrado.push({ key: item.key, value });
    }
  });
  return filtrado;
}

// Preenche a lista com base em um array ou snapshot
function fillTodoList(data) {
  ulTodoList.innerHTML = '';

  let tarefas = [];
  if (Array.isArray(data)) {
    tarefas = data;
  } else {
    tarefas = [];
    data.forEach(item => tarefas.push({ key: item.key, value: item.val() }));
  }

  const num = tarefas.length;
  todoCount.innerHTML = num > 0 ? `${num} ${num > 1 ? 'tarefas' : 'tarefa'}:` : 'Nenhuma tarefa cadastrada';
  buscas.style.display = num === 0 ? 'none' : 'block';

  tarefas.forEach(({ key, value }) => {
    const li = document.createElement('li');

    // span com data-key ao invés de id
    const spanLi = document.createElement('span');
    spanLi.textContent = value.name;
    spanLi.setAttribute('data-key', key);
    li.appendChild(spanLi);

    const liRemoveBtn = document.createElement('button');
    liRemoveBtn.textContent = 'Excluir';
    liRemoveBtn.className = 'danger todoBtn';
    liRemoveBtn.title = 'Excluir tarefa';
    liRemoveBtn.onclick = () => removeTodo(key);
    li.appendChild(liRemoveBtn);

    const liUpdateBtn = document.createElement('button');
    liUpdateBtn.textContent = 'Editar';
    liUpdateBtn.className = 'alternative todoBtn';
    liUpdateBtn.title = 'Editar tarefa';
    liUpdateBtn.onclick = () => updateTodo(key);
    li.appendChild(liUpdateBtn);

    ulTodoList.appendChild(li);
  });
}

function removeTodo(key) {
  // busca o span pelo data-key
  const selectedItem = ulTodoList.querySelector(`span[data-key="${key}"]`);
  const confirmation = confirm(`Realmente deseja remover a tarefa "${selectedItem?.innerHTML}"?`);
  if (!confirmation) return;

  const user = auth.currentUser;
  if (!user) return showError('Usuário não autenticado!');

  const todoRef = ref(database, `users/${user.uid}/${key}`);
  remove(todoRef)
    .then(() => {
      console.log(`Tarefa "${selectedItem?.innerHTML}" removida com sucesso`);
    })
    .catch(error => {
      showError('Falha ao remover tarefa: ', error);
    });
}

function updateTodo(key) {
  // busca o span pelo data-key
  const selectedItem = ulTodoList.querySelector(`span[data-key="${key}"]`);
  const newTodoName = prompt(`Escolha um novo nome para a tarefa "${selectedItem?.innerHTML}".`, selectedItem?.innerHTML);
  if (!newTodoName || newTodoName.trim() === '') {
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa');
    return;
  }

  const user = auth.currentUser;
  if (!user) return showError('Usuário não autenticado!');

  const data = {
    name: newTodoName.trim(),
    nameLowerCase: newTodoName.trim().toLowerCase()
  };

  const todoRef = ref(database, `users/${user.uid}/${key}`);
  update(todoRef, data)
    .then(() => {
      console.log(`Tarefa "${data.name}" atualizada com sucesso`);
    })
    .catch(error => {
      showError('Falha ao atualizar tarefa: ', error);
    });
}

// Escuta mudanças no banco e atualiza lista
auth.onAuthStateChanged(user => {
  if (user) {
    const userTodosRef = ref(database, 'users/' + user.uid);
    onValue(userTodosRef, snapshot => {
      allTasksSnapshot = snapshot; // Salva snapshot para busca local
      fillTodoList(snapshot);
    });
  } else {
    ulTodoList.innerHTML = '';
    todoCount.innerHTML = '';
    buscas.style.display = 'none';
    allTasksSnapshot = null;
  }
});
