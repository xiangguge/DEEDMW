<template>
    <div id="matrix-renderer">
        <h2>{{ title }}</h2>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(node, index) in nodes" :key="index">{{ node }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in matrix" :key="i">
                    <th>{{ nodes[i] }}</th>
                    <td v-for="(dist, j) in row" :key="j">{{ dist === Infinity ? '∞' : dist }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    matrix: {
        type: Array,
        required: true
    },
    nodes: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        default: 'Matrix'
    }
});

// 添加调试输出
console.log('Received matrix in MatrixRenderer:', props.matrix);
console.log('Received nodes in MatrixRenderer:', props.nodes);
</script>

<style scoped>
#matrix-renderer table {
    border-collapse: collapse;
    width: 100%;
}

#matrix-renderer th,
#matrix-renderer td {
    border: 1px solid aquamarine;
    padding: 8px;
    text-align: center;
}
</style>
