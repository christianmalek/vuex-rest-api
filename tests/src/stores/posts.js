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

export default posts
