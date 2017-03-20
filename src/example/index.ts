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
    name: "post"
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
console.log(posts);


/*
listPosts, "GET http://api.com/posts", state.posts,
getPost, "GET http://api.com/posts/id", state.post,
createPost, "POST http://api.com/posts", state.posts,
updatePost, "PUT http://api.com/posts/2", state.posts,
deletePost, "DELETE http://api.com/posts/2", state.posts
*/
