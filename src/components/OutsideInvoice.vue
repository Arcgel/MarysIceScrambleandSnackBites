<script setup>
  const date = Date.now().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
</script>

<template>
<div class="recieptbackground">
  <div class="recieptinvoice">
    <h1>{{ date }}</h1>
  </div>
</div>
</template>

<style>
.recieptbackground{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
}
.recieptinvoice{
  width: 40vw;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
