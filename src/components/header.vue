<template>
    <header class="header">
      <div class="menu-container">
        <button @click="toggleMenu" class="menu-btn">☰</button>
        <nav v-show="menuVisible" class="dropdown">
          <ul>
            <li v-for="(item, i) in menu" :key="i">
              <div class="menu-item" @click="handleClick(item)">
                <span v-if="item.path">
                  <router-link :to="item.path" class="link">{{ item.title }}</router-link>
                </span>
                <span v-else>{{ item.title }}</span>
                <span v-if="item.children" class="arrow">{{ item.expanded ? '▼' : '▶' }}</span>
              </div>
              <ul v-if="item.children && item.expanded" class="submenu">
                <li v-for="(child, j) in item.children" :key="j">
                  <router-link :to="child.path" class="link">{{ child.title }}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <h1 class="title"><span v-if="currentTitle">{{ currentTitle }}</span></h1>
    </header>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const menuVisible = ref(false)
  const toggleMenu = () => {
    menuVisible.value = !menuVisible.value
  }
  
  const menu = ref([
    {
        title: '主页',
        path: '/',
        expanded: false
    },
    {
        title: '逻辑',
        path: '/',
        expanded: false
    },
    {
        title: '集合',
        path: '/',
        expanded: false
    },
    {
        title: '关系',
        path: '/',
        expanded: false
    },
    {
        title: '函数',
        path: '/',
        expanded: false
    },
    {
        title: '组合与计数',
        path: '/',
        expanded: false
    },
    {
        title: '图和树',
        path: '/graph',
        expanded: false,
        children: [
        { title: '深度优先搜索', path: '/dfs' },
        { title: '广度优先搜索', path: '/bfs' }
        ]
    },
    {
        title: '代数结构',
        path: '/',
        expanded: false
    },
  ])
  
  const handleClick = (item) => {
    if (item.children) item.expanded = !item.expanded
  }

  import { useTitleStore } from '@/stores/title'
  import { storeToRefs } from 'pinia'

  const titleStore = useTitleStore()
  const { currentTitle } = storeToRefs(titleStore)
</script>


<style scoped>
  .header {
    width: 100%;
    padding: 2rem 0;
    background: linear-gradient(135deg, #0f172a, #1e3a8a);
    backdrop-filter: blur(6px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    text-align: center;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .title {
    font-size: 3rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.9),
                 0 0 20px rgba(59, 130, 246, 0.6),
                 0 0 40px rgba(59, 130, 246, 0.4);
    animation: pulseGlow 3s infinite ease-in-out;
    margin: 0 auto;
  }
  
  @keyframes pulseGlow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(59, 130, 246, 0.9),
                   0 0 20px rgba(59, 130, 246, 0.6),
                   0 0 40px rgba(59, 130, 246, 0.4);
    }
    50% {
      text-shadow: 0 0 20px rgba(59, 130, 246, 1),
                   0 0 30px rgba(59, 130, 246, 0.8),
                   0 0 60px rgba(59, 130, 246, 0.5);
    }
  }
  
  .menu-container {
    position: relative;
    margin-left: 1rem;
  }
  
  .menu-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
  }
  
  .dropdown {
    position: absolute;
    top: 3.5rem;
    left: 0;
    background: #1e293b;
    color: white;
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    min-width: 200px;
    z-index: 100;
  }
  
  .dropdown ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0.4rem 0.5rem;
    border-radius: 4px;
  }
  
  .menu-item:hover {
    background: #334155;
  }
  
  .submenu {
    padding-left: 1rem;
  }
  
  .arrow {
    font-size: 0.8rem;
  }
  
  .link {
    color: #cbd5e1;
    text-decoration: none;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  </style>
  