<template>
  <div class="UserDash">
    <div class="UserNav">
      <div class="UserProfile" @click="selecttiverendering('user')">
        <div class="usertext">
          <h4>User Settings</h4>
        </div>
      </div>
      <div class="PreviousOrders" @click="selecttiverendering('history')">
        <div class="usertext">
          <h4>Order History</h4>
        </div>
      </div>
      <div class="Favorites" @click="selecttiverendering('fave')">
        <div class="usertext">
          <h4>Your Favorites</h4>
        </div>
      </div>
      <div class="Supportpage" @click="selecttiverendering('support')">
        <div class="usertext">
          <h4>Feedback/Support</h4>
        </div>
      </div>
    </div>
    <div class="UserContent">
      <div v-if="componentrendering == 'user'">
        <div v-if="loggedin"><UserSettings/></div>
        <div v-else><UserComponent/></div>
      </div>
      <PreviousPurchase v-if="componentrendering == 'history'" />
      <FavoriteComponent v-if="componentrendering == 'fave'"  />
      <ContactComponent v-if="componentrendering == 'support'" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import PreviousPurchase from '../components/PreviousPurchase.vue';
import UserComponent from '../components/UserRegsiterandLogin.vue';
import ContactComponent from '../components/ContactComponent.vue';
import FavoriteComponent from '../components/FavoriteComponent.vue';
import UserSettings from '../components/UserSettings.vue';

const componentrendering = ref('user');
const loggedin = ref(false);

const selecttiverendering = (component) => {
  componentrendering.value = component;
};

const CheckStatus = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:3000/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        loggedin.value = true;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      loggedin.value = false;
    }
  }
};

onMounted(() => {
  CheckStatus();
});
</script>

<style>
.UserDash {
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  padding: 5vh;
  gap: 1.3vw;
}

.UserNav {
  display: flex;
  flex-direction: column;
  gap: 3vh;
}

.UserProfile,
.PreviousOrders,
.Favorites,
.Supportpage {
  width: 17vw;
  height: 24vh;
  border-radius: 2vh;
  background-color: rgb(283, 147, 83);
  backdrop-filter: blur(50px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.UserContent {
  width: 80vw;
  border-radius: 2vw;
  background-color: rgb(283, 147, 83);
  backdrop-filter: blur(50px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
