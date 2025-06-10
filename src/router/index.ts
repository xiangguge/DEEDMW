import {createRouter, createWebHashHistory} from 'vue-router'
import Graph from '@/pages/graph/graph.vue'
import DFS_BFS from '@/pages/graph/DFS+BFS.vue'
import Home from '@/pages/home/home.vue'
import FloydPage from "@/pages/graph/FloydPage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/graph", component: Graph },
    { path: "/dfs+dfs", component: DFS_BFS },
    {
      path: "/floyd",
      name: "Floyd",
      component: FloydPage,
    },
  ],
})

export default router