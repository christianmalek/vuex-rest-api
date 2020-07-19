import Vapi from "vuex-rest-api"

const posts = new Vapi({
  baseURL: "https://jsonplaceholder.typicode.com",
  state: {
    posts: []
  }
})
  .get({
    action: "getPostsWithHeaderFn",
    property: "posts",
    path: "/posts",
    headers: ({ foo }) => ({ "foo": foo })
  })
  .get({
    action: "getOptimisticPosts",
    beforeRequest: (state, { params, data }) => {
      state.posts = [1, 2, 3, 4, 5]
      console.log(params, data)
    },
    property: "posts",
    path: "/posts"
  })
  .get({
    action: "getPostsWithHeaderObject",
    property: "posts",
    path: "/posts",
    headers: { foo: 123 }
  })
  .get({
    action: "getPost",
    property: "post",
    path: ({ id }) => `/posts/${id}`,
    onSuccess(state, payload, axios, actionParams) {
      state.post = payload.data
      console.log(actionParams)
    },
    onError(state, error, axios, actionParams) {
      console.log(actionParams, error)
    }
  })
  .get({
    action: "getPosts",
    property: "posts",
    path: "/posts"
  })
  .post({
    action: "createPost",
    property: "post",
    path: "/posts"
  })
  .getStore()

// add other properties to store
posts.state.counter = 0
posts.mutations.increment = state => {
  state.counter++
}
posts.actions.increment = context => {
  context.commit("increment")
}

export default posts
