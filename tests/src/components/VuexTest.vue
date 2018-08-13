<template>
  <div>
    <p>
      {{count}}</p>
    <button @click="increment()">increase</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(["count"]),
  methods: {
    increment() {
      this.$store.commit("increment")
    }
  }
}
</script>
