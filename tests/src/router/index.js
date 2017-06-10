import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import VuexTest from "@/components/VuexTest"
import ModuleTest from "@/components/ModuleTest"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: "/vuex",
      component: VuexTest
    },
    {
      path: "/module",
      component: ModuleTest
    }
  ]
})
