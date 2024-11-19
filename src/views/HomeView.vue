<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const Menu = () => {
  router.push('/Menu')
}

</script>

<template>
    <main class="EntMain">
      <div class="Entrance">
      <h1>Mary Ice Scramble & SnackBites</h1>
      <h3>Satisfy your Taste Bud in the smoldering Summer Heat.
          The Continous Pop of Popcorn as Ice Shaved soothes the hot spots inside.
      </h3>
      <button class="moving" @click="Menu">Menu</button>
    </div>
    </main>
</template>

<style>
.EntMain{
  width: 100%;
  height: 100vh;
  background-image: url(../images/1089637.png) ;
  background-size: cover;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;

}
.Entrance {
  width: 53vw;
  background: transparent;
  padding: 2rem;
  border-radius: 1.25rem;
  text-align: center;

}
.moving{
  width: 12vw;
  margin: 0 auto;
  padding: 1.4vh;
  border-radius: 1.6vh;
  background: rgb(214, 90, 214);
}
</style>
