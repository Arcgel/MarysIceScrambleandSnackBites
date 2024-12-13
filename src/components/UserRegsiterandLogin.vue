<template>
  <div class="logsinbg" v-if="!loggedin">
    <div class="LogsinForm" v-if="login">
      <div class="Logheading">
        <h1>LogIn</h1>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="email">
          <h3>Email: </h3>
          <input v-model="email" placeholder="Input Your Email" required>
        </div>
        <div class="password">
          <h3>Password: </h3>
          <input v-model="password" type="password" placeholder="Input Your Password" required>
        </div>
        <div class="submitlogin">
          <button type="submit">LogIn</button>
        </div>
      </form>
      <div class="switch">
        <h4>Don't have an Account? <button @click="logreg">
          <h4>SignUp</h4>
        </button></h4>
      </div>
    </div>
    <div class="LogsinForm" v-else>
      <div class="Logheading">
        <h1>Signup</h1>
      </div>
      <form @submit.prevent="handleSignup">
        <div class="username">
          <h3>First Name: </h3>
          <input v-model="firstname" placeholder="First Name" required>
        </div>
        <div class="username">
          <h3>Last Name: </h3>
          <input v-model="lastname" placeholder="Last Name" required>
        </div>
        <div class="email">
          <h3>Email: </h3>
          <input v-model="email" placeholder="Input Your Email" required>
        </div>
        <div class="password">
          <h3>Password: </h3>
          <input v-model="password" type="password" placeholder="Input Your Password" required>
        </div>
        <div class="passwordconfirm">
          <h3>Confirm Password: </h3>
          <input v-model="confirmpass" type="password" placeholder="Confirm Your Password" required>
        </div>
        <div class="submitlogin">
          <button type="submit">Signup</button>
        </div>
      </form>
      <div class="switch">
        <h4>Have an Account? <button @click="logreg">
          <h4>Login</h4>
        </button></h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['loginStatusChanged']);
const firstname = ref('');
const lastname = ref('');
const login = ref(true);
const email = ref('');
const password = ref('');
const confirmpass = ref('');
const errorMessage = ref('');
const loggedin = ref(false);

const logreg = () => {
  login.value = !login.value;
};

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    errorMessage.value = '';
    loggedin.value = true;
    emit('loginStatusChanged', true);
  } catch (err) {
    errorMessage.value = err.response.data;
  }
};

const handleSignup = async () => {
  if (password.value !== confirmpass.value) {
    errorMessage.value = 'Passwords do not match!';
    return;
  }

  try {
    await axios.post('http://localhost:3000/register', {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value
    });
    errorMessage.value = '';
    logreg(); // Switch to login view after successful signup
  } catch (err) {
    errorMessage.value = err.response.data;
  }
};

watch(loggedin, (newVal) => {
  if (newVal) {
    // Redirect or handle login state change
  }
});
</script>

<style>
.logsinbg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.LogsinForm {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2vw;
}
.LogsinForm input {
  width: 100%;
  background-color: antiquewhite;
  padding: 1vw;
  margin: 1vh 0 3vh;
  border-bottom: 2vw;
  border-radius: 1vh;
}
.Logheading, .switch, .submitlogin {
  margin-bottom: 2vh;
  text-align: center;
}
.submitlogin button {
  background-color: antiquewhite;
  padding: 1vh 5vw;
  border-bottom: 2vw;
  border-radius: 1vh;
  cursor: pointer;
}
.switch button {
  background-color: inherit;
  margin-left: 0.5vh;
  color: aliceblue;
  text-decoration: underline aliceblue;
  border: none;
}
</style>
