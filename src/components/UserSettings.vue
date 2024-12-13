<template>
  <div class="user-settings">
    <h3>Hello {{ user.firstname + ' ' + user.lastname }}</h3>
    <div v-if="loggedIn">
      <div class="inputstyle">
        <h2>First Name:</h2>
        <div class="withbutton">
          <input v-model="user.firstname" readonly />
          <button class="edit" @click="editField('firstname')">Edit</button>
        </div>
      </div>
      <div class="inputstyle">
        <h2>Last Name:</h2>
        <div class="withbutton">
          <input v-model="user.lastname" readonly />
          <button class="edit" @click="editField('lastname')">Edit</button>
        </div>
      </div>
      <div class="inputstyle">
        <h2>Password:</h2>
        <div class="withbutton">
          <input v-model="user.password" type="password" readonly />
          <button class="edit" @click="editField('password')">Edit</button>
        </div>
      </div>
      <div class="useremail">
        <h2>Email:</h2>
        <div class="withbutton">
          <input v-model="user.email" readonly />
          <button class="edit" @click="editField('email')">Change Email</button>
        </div>
      </div>
      <button class="logout" @click="logout">Log Out</button>
      <EditFieldModal v-if="showEditModal" :field="currentField" :user="user" @close="handleFieldModalClose" @update="fetchUserDetails" />
    </div>
    <div v-else>
      <p>Please log in to access your user settings.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import EditFieldModal from './EditFieldModal.vue';

const user = ref({
  firstname: '',
  lastname: '',
  password: '',
  email: '',
  isVerified: false
});
const loggedIn = ref(false);
const showEditModal = ref(false);
const currentField = ref('');

const editField = (field) => {
  currentField.value = field;
  showEditModal.value = true;
};

const logout = () => {
  localStorage.removeItem('token');
  location.reload(); // Refresh the page to reset the state
};

const handleFieldModalClose = () => {
  showEditModal.value = false;
};

const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/user-details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    user.value = response.data;
    loggedIn.value = true;
  } catch (error) {
    console.error('Error fetching user details:', error);
    loggedIn.value = false;
  }
};

onMounted(() => {
  fetchUserDetails();
});
</script>

<style>
.user-settings {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 9vw;
}

.inputstyle {
  margin: 5vh 0;
}

.withbutton {
  margin: 1vh 0;
  display: flex;
  align-items: center;
}

.withbutton input {
  background-color: antiquewhite;
  letter-spacing: 0.4vw;
  flex: 1;
  padding: 10px;
  margin-right: 10px;
}

.edit, .logout {
  padding: 10px 20px;
  background-color: #fcc38e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
