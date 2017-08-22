<template>
  <div>
    <h1>Module Test</h1>
    <p>Posts: {{ posts.length }}</p>
    <p>Counter: {{ counter }}</p>
    <button @click="increment">increase counter</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    this.getPosts()
  },
  computed: mapState({
    posts: state => state.posts.posts,
    counter: state => state.posts.counter
  }),
  methods: {
    ...mapActions([
      "getPosts",
      "increment"
    ])
  }
}
</script>

