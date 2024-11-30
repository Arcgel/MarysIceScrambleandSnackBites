<template>
  <div class="floatingvalues" @click.self="closeModal">
    <form @submit.prevent="CartSubmit">
      <div class="contentvalues">
        <h1>{{ props.data.title }}</h1>
        <div class="ModalStyling">
          <select v-model="SelectedConfig" name="Config" id="Configuration" required>
            <option v-for="config in props.data.Setting" :key="config.setting" :value="config" >
              {{ config.setting }}
            </option>
          </select>
          <select v-model="SelectedSize" name="Sizes" id="NormalLarge" required>
            <option v-for="size in props.data.Sizez" :key="size.size" :value="size" >
              {{ size.size }}
            </option>
          </select>
          <input class="orderquantity" type="number" v-model="quantity" min="1" max="10" placeholder="quantity" required>
        </div>
        <div class="productdesc">
          <h4>{{ props.data.Description }}</h4>
        </div>
        <h3>Total Price: ₱ {{ totalPrice }}</h3>
        <button type="submit" class="movingcart">Add to Cart</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { defineEmits} from 'vue'
import { ref, computed } from 'vue';

const emit = defineEmits(['close', 'add-to-cart'])

const SelectedConfig = ref({})
const SelectedSize = ref({})
const quantity = ref(1)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const closeModal = () => {
  emit('close')
}

const CartSubmit = () => {
  const orderedProduct = {
    title: props.data.title,
    config: SelectedConfig.value.setting,
    configprice: SelectedConfig.value.price,
    size: SelectedSize.value.size,
    configsize: SelectedSize.value.price,
    quantity: quantity.value,
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || []
  const existingProduct = cart.find(cartItem =>
    cartItem.title === orderedProduct.title &&
    cartItem.config === orderedProduct.config &&
    cartItem.size === orderedProduct.size
  )

  if (existingProduct) {
    existingProduct.quantity += orderedProduct.quantity
  } else {
    cart.push(orderedProduct)
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  emit('add-to-cart', orderedProduct)
  closeModal()
}

const totalPrice = computed(() => {
  return (Number(SelectedSize.value.price || 0) + Number(SelectedConfig.value.price || 0)) * quantity.value
})
</script>

<style>
.floatingvalues {
  background: rgba(252, 237, 240, 0.3);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
}

.contentvalues {
  height: 80vh;
  width: 30vw;
  border-radius: 3vw;
  background-color: rgb(283, 147, 83);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ModalStyling {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1vw;
}

.ModalStyling #Configuration,
#NormalLarge {
  padding: 0.8vw;
  font-weight: bolder;
  color: chocolate;
  background-color: #fcc38e;
  border-radius: 0.5vw;
}

.movingcart {
  width: 12vw;
  text-align: center;
  margin: 1vh;
  padding: 1.4vh;
  border-radius: 1.6vh;
  background: #fcc38e;
}

.orderquantity {
  width: 3vw;
  padding: 0.8vw;
  text-align: center;
  border-radius: 0.5vw;
  background: #fcc38e;
  color: chocolate;
}

.productdesc {
  padding: 2vw 5vw;
  text-align: center;
}

@media (max-width: 768px) {
  .contentvalues {
    width: 90vw;
    height: 70vh;
    border-radius: 5vw;
  }

  .ModalStyling {
    align-items: center;
    flex-wrap: wrap;
    padding: 0 4vw;
  }

  .ModalStyling #Configuration,
  #NormalLarge {
    min-width: 20%;
    padding: 2vh;
    font-size: 4vw;
    border-radius: 2vw;
  }

  .orderquantity {
    width: 10vw;
    padding: 2vh;
    font-size: 4vw;
    border-radius: 2vw;
  }

  .movingcart {
    width: 50vw;
    padding: 2vh;
    margin: 2vh;
    font-size: 4vw;
    border-radius: 2vw;
  }

  .productdesc {
    padding: 4vh 6vw;
  }

  .productdesc h4 {
    font-size: 5vw;
  }

  .contentvalues h1 {
    font-size: 6vw;
    margin-bottom: 3vh;
  }

  .contentvalues h3 {
    font-size: 5vw;
    margin: 2vh 0;
  }
}
</style>
