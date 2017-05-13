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
    ...mapActions(['getPost', 'listPosts', "updatePost"])
  },
  async mounted () {
    let post = (await this.getPost({ params: { id: 5 } })).data
    console.log(post)
    this.listPosts()
    this.getPost()
  }
}
</script>
