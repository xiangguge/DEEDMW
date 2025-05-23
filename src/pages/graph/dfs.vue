<script setup>
import { useTitleStore } from '@/stores/title'
import Dynagraph from './dynagraph/Dynagraph.vue'
const titleStore = useTitleStore()
titleStore.setTitle('深度优先搜索dfs')
</script>
<template>
    <Dynagraph/>
</template>