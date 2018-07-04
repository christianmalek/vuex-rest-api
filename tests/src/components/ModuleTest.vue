<template>
  <div>
    <h1>Module Test</h1>
    <p>Posts: {{ posts.length }}</p>
    <p>Counter: {{ counter }}</p>
    <button @click="increment">increase counter</button>
    <button @click="create">create post</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    // this.getPosts()
    this.getPostsWithHeaderFn({ params: { foo: 123 } })
  },
  computed: mapState({
    posts: state => state.posts.posts,
    counter: state => state.posts.counter
  }),
  methods: {
    create() {
      this.$store.dispatch("createPost", {
        data: {
          title: 'foo',
          body: 'bar',
          userId: 1
        }
      })
    },
    ...mapActions([
      "getPosts",
      "getPostsWithHeaderObject",
      "getPostsWithHeaderFn",
      "createPost",
      "increment"
    ])
  }
}
</script>

