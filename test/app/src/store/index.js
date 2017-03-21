import Vuex from 'vuex'
import Vue from 'vue'
import { Resource, createStore } from '../vuex-rest-api'

Vue.use(Vuex)

const resource = new Resource('https://jsonplaceholder.typicode.com')
  .addAction({
    action: 'listPosts',
    method: 'get',
    property: "posts",
    pathFn: () => `/posts`
  })
  .addAction({
    action: 'getPost',
    method: 'get',
    property: "posts",
    pathFn: ({ id }) => `/posts/${id}`
  })
  .addAction({
    action: 'updatePost',
    method: 'put',
    property: "post",
    pathFn: ({ id }) => `/posts/${id}`
  })
  .addAction({
    action: 'deletePost',
    method: 'delete',
    property: "post",
    pathFn: ({ id }) => `/posts/${id}`
  })

const posts = createStore(resource)

/*
  listPosts(); => LIST_POSTS_SUCCEEDED | LIST_POSTS_FAILED
  getPost({id: 5}); => GET_POST_SUCCEEDED | GET_POST_FAILED
  updatePost({id: 12}, { message: "Edited"}); => UPDATE_POST_SUCCEEDED | UPDATE_POST_FAILED
  deletePost({id: 3}); => DELETE_POST_SUCCEEDED | DELETE_POST_FAILED
*/

/*
listPosts, "GET http://api.com/posts", state.posts,
getPost, "GET http://api.com/posts/id", state.post,
createPost, "POST http://api.com/posts", state.posts,
updatePost, "PUT http://api.com/posts/2", state.posts,
deletePost, "DELETE http://api.com/posts/2", state.posts
*/

console.log(posts)

const store = new Vuex.Store({
  ...posts
})
export default store
