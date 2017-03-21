import { createStore, Resource } from "../vuex-rest-api/index";

const resource = new Resource("posts", "https://jsonplaceholder.typicode.com", {
  post: null
})
  .addAction({
    action: "listPosts",
    method: "get",
    pathFn: () => `/posts`
  })
  .addAction({
    action: "getPost",
    method: "get",
    pathFn: ({ id }) => `/posts/${id}`,
    mutationSuccessFn(state, payload) {
      // will be set before mutationSuccessFn call:
      // state.pending = false
      // state.error = null

      state.post = payload;
    },
    mutationFailureFn(state, payload) {
      // will be set before mutationFailureFn call:
      // state.pending = false
      // state.error = null

      state.post = null;
    }
  })
  .addAction({
    action: "updatePost",
    method: "put",
    pathFn: ({ id }) => `/posts/${id}`,
  })
  .addAction({
    action: "deletePost",
    method: "delete",
    pathFn: ({ id }) => `/posts/${id}`
  });

const posts = createStore(resource);

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
