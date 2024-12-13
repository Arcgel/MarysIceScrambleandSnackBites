<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Edit {{ field }}</h2>
      <input v-model="fieldValue" :placeholder="placeholder" />
      <div class="buttons">
        <button @click="save">Save</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps(['field', 'user']);
const emit = defineEmits(['close', 'update']);
const fieldValue = ref('');
const placeholder = ref('');

watch(props, () => {
  placeholder.value = props.user[props.field];
  fieldValue.value = props.user[props.field];
});

const save = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/update-user', {
      field: props.field,
      value: fieldValue.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      emit('update');  // Emit update event to notify parent component
      emit('close');
    }
  } catch (error) {
    console.error('Update failed:', error);
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: rgb(283, 147, 83);
  width: 80%;
  height: 20%;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-content input {
  width: 80%;
  padding: 1vw;
  margin-bottom: 1vh;
}
</style>
