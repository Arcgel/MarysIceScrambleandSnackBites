<template>
  <nav class="NavbarModal">
    <div class="logo">
      <img src="../images/logo-removebg-preview.png" alt="IceScramble" @click="Menu">
      <RouterLink to="/Menu/Products"><h2>Mary's Ice Scramble and SnackBites</h2></RouterLink>
    </div>
    <div class="actualnav">
      <ul>
        <li><details>
        <Summary>Cart</Summary>
        <ul>
          <RouterLink to="/"><li>SaveInformation</li></RouterLink>
          <RouterLink to="/"><li>Checkout</li></RouterLink>
        </ul></details></li>
        <RouterLink to="/"><li>Order Now</li></RouterLink>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();

const Menu = () => {
  router.push('/')
}

</script>

<style>

a, a:visited {
  color: inherit; /* This ensures the link takes the same color as the parent */
  text-decoration: none; /* Removes underline styling */
}
.NavbarModal {
  background: rgba(252, 237, 240, 0.808);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5vw;
  position: absolute;
  width: 100%;
  max-width: 100vw;
}

.logo {
  display: flex;
  align-items: center;
  gap: 2vw;
}

.logo img {
  height: 9.74025974025974vh;
  width: 4.418262150220913vw;
  border-radius: 50%;
  margin-left: 2vw;
}

.logo h2 {
  font-size: 1.4vw;
  letter-spacing: 0.2vw;
  margin: 0;
}

.actualnav ul {
  list-style: none;
  display: flex;
  gap: 3vw;
  margin: auto;
  margin-right: 10vw;
  font-size: 1.4vw;
  padding: 0;
  color: brown;
}

.actualnav details {
  cursor: pointer;
  text-wrap: pretty;
}

.actualnav summary {
  list-style: none;
  text-decoration: none;

}

.actualnav details[open] ul {
  display: block;
}

.actualnav details ul {
  display: none;
  position:fixed;
  list-style: none;
  margin: 0;
  padding: 2vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  min-width: 150px;
}

.actualnav details ul li{
  padding: 1.4vh;
}

.RouterLink{
  text-decoration: none
}

.actualnav details ul li a:hover {
  background-color: #e9ecef;
}


</style>
