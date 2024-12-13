<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Verify Your Email</h2>
      <p>Please enter the code sent to your email:</p>
      <input v-model="verificationCode" placeholder="Verification Code" />
      <div class="buttons">
        <button @click="verifyEmail">Verify</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const verificationCode = ref('');

const emit = defineEmits

const verifyEmail = async () => {
  try {
    const response = await axios.post('http://localhost:3000/verify-email', { code: verificationCode.value });
    if (response.status === 200) {
      // Handle successful verification
      emit('close');
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>

