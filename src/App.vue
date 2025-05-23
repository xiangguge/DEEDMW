<script setup>
import TopHeader from './components/header.vue'
import { RouterView, RouterLink } from 'vue-router';

</script>

<template>
    <header>
        <TopHeader />
    </header>

    <main>
        <RouterView></RouterView>
    </main>
</template>
