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
      "posts",
    ])
  },
  store,
  methods: {
    ...mapActions([
      "getPost",
      "listPosts"
    ])
  },
  mounted() {
    this.getPost({ params: { id: 2 } });
    // this.list_posts();
  }
};

</script>
