<template>
  <nav class="NavbarModal">
    <div class="logo">
      <img src="../images/logo-removebg-preview.png" alt="IceScramble" @click="Menu">
      <RouterLink to="/Menu" class="title-text"><h2>Mary's Ice Scramble and SnackBites</h2></RouterLink>
    </div>
    <div class="menu-btn" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="actualnav" :class="{ 'active': isMenuOpen }">
      <ul>
        <RouterLink to="/Menu" @click="toggleMenu"><li>Menu</li></RouterLink>
        <RouterLink to="/Cart" @click="toggleMenu"><li>Cart</li></RouterLink>
        <RouterLink to="/User" @click="toggleMenu"><li>User</li></RouterLink>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isMenuOpen = ref(false);

const Menu = () => {
  router.push('/')
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<style scoped>
a, a:visited {
  color: inherit;
  text-decoration: none;
}

.NavbarModal {
  background: rgba(252, 237, 240, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  position: fixed;
  z-index: 20;
  width: 100vw;
  height: 13vh  ;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  gap: 27px;
}

.logo img {
  height: 75px;
  width: 75px;
  border-radius: 55px;
  margin-left: 27px;
}

.logo h2 {
  font-size: 19px;
  letter-spacing: 3px;
  margin: 0;
}

.actualnav ul {
  list-style: none;
  display: flex;
  gap: 41px;
  margin-right: 137px;
  font-size: 19px;
  color: brown;
}

.menu-btn {
  display: none;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  width: 41px;
  height: 4px;
  background-color: brown;
  margin: 8px 0;
}

@media (max-width: 768px) {
  .NavbarModal {
    height: 8vh;
  }

  .title-text {
    display: none;
  }

  .logo {
    gap: 0;
  }

  .logo img {
    height: 10vh;
    width: 10vh;
    border-radius: 50%;
    margin: 0;
    object-fit: cover;
  }

  .menu-btn {
    display: block;
    position: relative;
    margin-right: 2vw;
    z-index: 1001;
  }

  .menu-btn span {
    width: 13vw;
    height: 0.5vh;
    margin: 1vh 2vh;
    background-color: brown;
  }

  .actualnav {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: rgba(252, 237, 240, 1);
    z-index: 1000;
  }

  .actualnav.active {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .actualnav ul {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 2vh;
    gap: 10vh;
    height: 100%;
    width: 100%;
  }

  .actualnav ul li {
    font-size: 8vw;
    text-align: center;
    color: brown;
    font-weight: bold;
  }
}
</style>
