import Vue from 'vue'
import Router from 'vue-router'
import VuexTest from "@/components/VuexTest"
import ModuleTest from "@/components/ModuleTest"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/vuex",
      component: VuexTest
    },
    {
      path: "/module",
      component: ModuleTest
    },
    {
      path: "*",
      redirect: "/module"
    }
  ]
})

export default router
