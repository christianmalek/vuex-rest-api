import Vapi from "../../../dist"

const posts = new Vapi({
  baseURL: "https://jsonplaceholder.typicode.com",
  state: {
    posts: []
  }
})
  .get({
    action: "getPosts",
    property: "posts",
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
