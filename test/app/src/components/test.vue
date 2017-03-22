<template>
  <h1>Test component</h1>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: "Test",
  data () {
    return {

    }
  },
  computed: {
    ...mapState(["post", "posts", "error", "pending"])
  },
  methods: {
    ...mapActions(['getPost', 'listPosts', "updatePost", "deletePost"])
  },
  async mounted () {
    const post = (await this.deletePost({ id: 5 })).data
    console.log(post)
    // this.listPosts()
  }
}
</script>
