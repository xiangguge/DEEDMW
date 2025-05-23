<script setup>
import { useTitleStore } from '@/stores/title'
import Dynagraph from './dynagraph/Dynagraph.vue'
const titleStore = useTitleStore()
titleStore.setTitle('图和树')
</script>

<template>
<h2>未来在此处添加对“图和树”部分的简介，尤其是如何在该部分使用DEEDMW。</h2>
<Dynagraph/>
</template>

<style>
</style>