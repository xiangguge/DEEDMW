<template>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/logic.png" alt="章节封面"/>
        <span class="name">逻辑</span>
    </a>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/set.png" alt="章节封面"/>
        <span class="name">集合</span>
    </a>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/relation.jpg" alt="章节封面"/>
        <span class="name">关系</span>
    </a>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/function.jpg" alt="章节封面"/>
        <span class="name">函数</span>
    </a>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/counting.jpg" alt="章节封面"/>
        <span class="name">组合与计数</span>
    </a>
    <RouterLink to="/graph" class="chapter-link">
        <img class="img" src="./homepage-fig/graph.png" alt="章节封面"/>
        <span class="name">图和树</span>
    </RouterLink>
    <a class="chapter-link">
        <img class="img" src="./homepage-fig/algebra.png" alt="章节封面"/>
        <span class="name">代数结构</span>
    </a>
</template>


<style>
.chapter-link {
    display: inline-flex; /* 关键：让整个容器作为行内块 */
    width: 264px; 
    height: 120px;
    display: inline-flex;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    margin: 30px;
    text-decoration:none;
}

.img {
    display: flex;
    width: 60%; /* 左边占60% */
    justify-content: center;  /* 水平居中 */
    align-items: center;      /* 垂直居中 */
}

.name {
    display: flex;
    width: 40%; /* 右边占40% */
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #f0f9ff;
    justify-content: center;  /* 水平居中 */
    align-items: center;      /* 垂直居中 */
    font-size: x-large;
}
</style>

<script setup>
import { useTitleStore } from '@/stores/title'
const titleStore = useTitleStore()
titleStore.setTitle('DEEDMW')
</script>