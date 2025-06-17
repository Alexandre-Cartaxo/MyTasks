// js/utils.js

// Elementos da página
const authForm = document.getElementById('authForm');
const authFormTitle = document.getElementById('authFormTitle');
const register = document.getElementById('register');
const access = document.getElementById('access');
const loading = document.getElementById('loading');
const auth = document.getElementById('auth');
const userContent = document.getElementById('userContent');
const userEmail = document.getElementById('userEmail');
const sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv');
const emailVerified = document.getElementById('emailVerified');
const passwordReset = document.getElementById('passwordReset');
const userName = document.getElementById('userName');
const userImg = document.getElementById('userImg');

// Mostrar elemento
const showItem = (element) => {
  element.style.display = 'block';
};

// Esconder elemento
const hideItem = (element) => {
  element.style.display = 'none';
};

// Alternar para formulário de cadastro
const toggleToRegister = () => {
  document.getElementById('submitAuthForm').innerHTML = 'Cadastrar conta';
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar';
  hideItem(register);
  hideItem(passwordReset);
  showItem(access);
};

// Alternar para formulário de acesso
const toggleToAccess = () => {
  document.getElementById('submitAuthForm').innerHTML = 'Acessar';
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar';
  hideItem(access);
  showItem(passwordReset);
  showItem(register);
};

// Mostrar conteúdo do usuário autenticado
const showUserContent = (user) => {
  console.log(user);

  if (user?.providerData?.[0]?.providerId !== 'password') {
    emailVerified.innerHTML = 'Autenticação por provedor confiável, não é necessário verificar e-mail';
    hideItem(sendEmailVerificationDiv);
  } else {
    if (user.emailVerified) {
      emailVerified.innerHTML = 'E-mail verificado';
      hideItem(sendEmailVerificationDiv);
    } else {
      emailVerified.innerHTML = 'E-mail não verificado';
      showItem(sendEmailVerificationDiv);
    }
  }

  userImg.src = user.photoURL ?? 'img/unknownUser.png';
  userName.innerHTML = user.displayName ?? 'Usuário sem nome';
  userEmail.innerHTML = user.email;
  hideItem(auth);
  showItem(userContent);
};

// Mostrar formulário de autenticação
const showAuth = () => {
  authForm.email.value = '';
  authForm.password.value = '';
  hideItem(userContent);
  showItem(auth);
};

// Mensagens de erro customizadas
const errorMessages = {
  'auth/invalid-email': 'E-mail inválido!',
  'auth/wrong-password': 'Senha inválida!',
  'auth/weak-password': 'Senha deve ter ao menos 6 caracteres!',
  'auth/email-already-in-use': 'E-mail já está em uso por outra conta!',
  'auth/popup-closed-by-user': 'O popup de autenticação foi fechado antes da operação ser concluída!',
};

// Exibir erro
const showError = (prefix, error) => {
  console.log(error.code);
  hideItem(loading);
  const message = errorMessages[error.code] || error.message;
  alert(`${prefix} ${message}`);
};

// Configurações de ação para email (verificação e redefinição)
const actionCodeSettings = {
  url: 'http://127.0.0.1:5500/', // Trocar para seu domínio na produção
};

// ✅ ADICIONADO: mostrar e esconder área de tarefas
const showTaskArea = () => {
  showItem(document.getElementById('addTarefa'));
  showItem(document.getElementById('todoList'));
};

const hideTaskArea = () => {
  hideItem(document.getElementById('addTarefa'));
  hideItem(document.getElementById('todoList'));
};

export {
  authForm,
  userName,
  loading,
  showItem,
  hideItem,
  toggleToRegister,
  toggleToAccess,
  showUserContent,
  showAuth,
  showError,
  actionCodeSettings,
  showTaskArea,
  hideTaskArea,
};
