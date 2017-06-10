<template>
  <div>
    <h1>Module Test</h1>
    <p>{{ posts.length }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    this.getPosts()
  },
  computed: mapState({
    posts: state => state.posts.posts
  }),
  methods: {
    ...mapActions([
      "getPosts"
    ])
  }
}
</script>

