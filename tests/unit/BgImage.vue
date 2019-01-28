<template>
  <img v-lazy:background-image="src" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>
