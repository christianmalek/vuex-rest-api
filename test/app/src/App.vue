<template>
  <div id="app">
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState(["post", "posts", "error", "pending"])
  },
  methods: {
    ...mapActions(['getPost', 'listPosts'])
  },
  mounted () {
    this.getPost({ id: 5 })
    // this.listPosts()
  }
}
</script>
