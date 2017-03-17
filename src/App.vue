<template>
  <div id="app">
    <img src="./assets/logo.png">
    <p>{{count}}</p>
    <button v-on:click="increment">increment</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: 'app',
  computed: {
    ...mapState(["count"])
  },
  methods: {
    ...mapActions(["increment"])
  }
};

</script>
