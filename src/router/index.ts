import {createRouter, createWebHistory} from 'vue-router'
import Graph from '@/pages/graph/graph.vue'
import Dfs from '@/pages/graph/dfs.vue'
import Bfs from '@/pages/graph/bfs.vue'
import Home from '@/pages/home/home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path:'/graph', component:Graph},
        { path:'/bfs', component:Bfs},
        { path:'/dfs', component:Dfs},
    ]
})

export default router