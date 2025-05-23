<script setup>
import { useTitleStore } from '@/stores/title'
import Dynagraph from './dynagraph/Dynagraph.vue'
const titleStore = useTitleStore()
titleStore.setTitle('广度优先搜索bfs')
</script>
<template>
    <Dynagraph/>
</template>