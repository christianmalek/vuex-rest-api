<template>
  <div id="app">
    <h1>Vrap Test</h1>
    <code>{{posts}}</code>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "./store/";

export default {
  name: 'app',
  computed: {
    ...mapState([
      "posts"
    ])
  },
  store,
  methods: {
    ...mapActions([
      "get_posts"
    ])
  },
  mounted() {
    this.get_posts();
  }
};

</script>
