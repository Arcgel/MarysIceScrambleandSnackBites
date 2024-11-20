<script setup>
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavbarModal from './components/NavbarModal.vue';

const route = useRoute()

const shownav = computed(() => route.path !== '/')
</script>

<template>
  <div class="app-container">
    <div class="nav" v-if="shownav">
      <NavbarModal/>
    </div>
      <main :class="{'nonav': shownav}">
        <RouterView/>
      </main>

  </div>
</template>

<style>
.nonav{
  padding-top: 15vh;
}
</style>

