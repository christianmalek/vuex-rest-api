<template>
  <h1>
    Test component</h1>
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
    (await this.deletePost({ params: { id: 5 }, data: { a: 12, b: 32 } })).data
    this.listPosts()
  }
}
</script>
