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
  background-image: url(../images/1089637.png);
  background-size: cover;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;

}
.Entrance {
  width: 724px;
  background: transparent;
  padding: 32px;
  border-radius: 20px;
  text-align: center;

}
.moving{
  width: 164px;
  margin: 38px auto auto auto;
  padding: 11px;
  border-radius: 12px;
  background: rgb(214, 90, 214);
}
@media only screen and (max-width: 768px) {
  .Entrance {
    width: 85vw;
  }

  .Entrance h1 {
    font-size: 1.8rem;
  }

  .Entrance h3 {
    font-size: 1rem;
    line-height: 1.5;
  }

  .moving {
    width: 120px;
    padding: 10px;
  }
}

@media only screen and (max-width: 480px) {
  .Entrance {
    width: 90vw;
    padding: 1rem;
  }

  .Entrance h1 {
    font-size: 1.5rem;
  }

  .moving {
    width: 100px;
  }
}
</style>
