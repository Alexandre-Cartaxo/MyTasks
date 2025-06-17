// js/auth.js
import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  deleteUser
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
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
  hideTaskArea
} from './utils.js';

auth.languageCode = 'pt-BR';

// Submissão do formulário
authForm.onsubmit = function (event) {
  showItem(loading);
  event.preventDefault();

  const email = authForm.email.value;
  const password = authForm.password.value;

  if (authForm.submitAuthForm.innerHTML === 'Acessar') {
    signInWithEmailAndPassword(auth, email, password)
      .catch(error => showError('Falha no acesso: ', error));
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .catch(error => showError('Falha no cadastro: ', error));
  }
};

// Monitoramento do estado de autenticação
onAuthStateChanged(auth, user => {
  hideItem(loading);
  if (user) {
    showUserContent(user);
    showTaskArea(); // 👈 mostra a área de tarefas
  } else {
    showAuth();
    hideTaskArea(); // 👈 esconde a área de tarefas
  }
});

// Logout
window.signOut = function () {
  signOut(auth).catch(error => showError('Falha ao sair da conta: ', error));
};

// Verificação de e-mail
window.sendEmailVerification = function () {
  showItem(loading);
  const user = auth.currentUser;
  sendEmailVerification(user, actionCodeSettings)
    .then(() => alert(`E-mail de verificação enviado para ${user.email}`))
    .catch(error => showError('Falha ao enviar e-mail de verificação: ', error))
    .finally(() => hideItem(loading));
};

// Redefinição de senha
window.sendPasswordResetEmail = function () {
  const email = prompt('Redefinir senha! Informe seu e-mail:', authForm.email.value);
  if (email) {
    showItem(loading);
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => alert(`E-mail de redefinição enviado para ${email}`))
      .catch(error => showError('Falha ao enviar e-mail de redefinição: ', error))
      .finally(() => hideItem(loading));
  } else {
    alert('É preciso preencher o campo de e-mail para redefinir a senha!');
  }
};

// Login com Google
window.signInWithGoogle = function () {
  showItem(loading);
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .catch(error => showError('Falha ao autenticar com o Google: ', error));
};

// Login com GitHub
window.signInWithGitHub = function () {
  showItem(loading);
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .catch(error => showError('Falha ao autenticar com o GitHub: ', error));
};

// Login com Facebook
window.signInWithFacebook = function () {
  showItem(loading);
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .catch(error => showError('Falha ao autenticar com o Facebook: ', error));
};

// Atualização de nome de usuário
window.updateUserName = function () {
  const user = auth.currentUser;
  const novoNome = prompt('Informe um novo nome de usuário:', user.displayName || '');

  if (novoNome && novoNome.trim() !== '') {
    userName.innerHTML = novoNome;
    showItem(loading);
    updateProfile(user, { displayName: novoNome })
      .catch(error => showError('Falha ao atualizar nome: ', error))
      .finally(() => hideItem(loading));
  } else {
    alert('O nome de usuário não pode ser vazio');
  }
};

// Excluir conta
window.deleteUserAccount = function () {
  const confirmar = confirm('Deseja realmente excluir sua conta?');
  if (confirmar) {
    showItem(loading);
    deleteUser(auth.currentUser)
      .then(() => alert('Conta removida com sucesso'))
      .catch(error => showError('Falha ao excluir conta: ', error))
      .finally(() => hideItem(loading));
  }
};

// Expor funções para uso no HTML
window.toggleToRegister = toggleToRegister;
window.toggleToAccess = toggleToAccess;
