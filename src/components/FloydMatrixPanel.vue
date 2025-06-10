<script setup>
import { computed, watch, toRefs, onMounted } from 'vue';

const props = defineProps({
    animator: {
        type: Object,
        required: true,
        default: () => ({}),
    },
});

// 从animator中解构出需要的属性
const {
    distMatrix,
    nextMatrix,
    currentI,
    currentJ,
    currentK,
    helightDistMatrix,
    helightNextMatrix
} = toRefs(props.animator);

// 监听animator的变化
watch(() => props.animator, (newVal) => {
    // 这里可以添加额外的响应逻辑
}, { deep: true });

// 判断单元格是否需要高亮（距离矩阵）
const shouldHighlightDist = (i, j) => {
    return helightDistMatrix.value.some(item => item.i === i && item.j === j);
};

// 判断单元格是否需要第一种高亮（路径矩阵）
const shouldHighlightNextPrimary = (i, j) => {
    return helightNextMatrix.value.length > 0 &&
        helightNextMatrix.value[0].i === i &&
        helightNextMatrix.value[0].j === j;
};

// 判断单元格是否需要第二种高亮（路径矩阵）
const shouldHighlightNextSecondary = (i, j) => {
    return helightNextMatrix.value.length > 1 &&
        helightNextMatrix.value[1].i === i &&
        helightNextMatrix.value[1].j === j;
};

// 判断单元格是否是当前正在处理的
const isCurrentCell = (i, j) => {
    return i === currentI.value && j === currentJ.value;
};

// 判断单元格是否被更新
const isUpdated = (i, j) => {
    return i === currentI.value && j === currentJ.value &&
        props.animator.updated;
};
onMounted(() => {
    console.log("矩阵渲染组件:", props.animator)
})
</script>

<template>
    <!-- <div class="intermediate-graph">
            <h4>中间状态</h4>
            <div class="graph-container">
                <div class="start-node">起始: {{ nodeNames[currentI] }}</div>
                <div class="middle-node">中间: {{ nodeNames[currentK] }}</div>
                <div class="end-node">目标: {{ nodeNames[currentJ] }}</div>
            </div>
        </div> -->

    <!-- 距离矩阵 -->
    <h3>距离矩阵 (D)</h3>
    <table class="matrix-table">
        <tr v-for="(row, i) in distMatrix" :key="i">
            <td v-for="(cell, j) in row" :key="j" :class="{
                'highlight-cell': isCurrentCell(i, j),
                'updated-cell': isUpdated(i, j),
                'custom-highlight': shouldHighlight('dist', i, j)
            }" :style="{
    border: shouldHighlight('dist', i, j) ? '2px solid #000' : '1px solid #ddd'
}">
                {{ cell === Infinity ? '∞' : cell }}
            </td>
        </tr>
    </table>

    <!-- 路径矩阵 -->
    <h3>路径矩阵 (Next)</h3>
    <table class="matrix-table">
        <tr v-for="(row, i) in nextMatrix" :key="i">
            <td v-for="(cell, j) in row" :key="j" :class="{
                highlight: i === currentI && j === currentJ,
                updated: updated && i === currentI && j === currentJ
            }">
                {{ cell !== null ? nodeNames[cell] : '-' }}
            </td>
        </tr>
    </table>
    <h3>路径矩阵 (Next)</h3>
    <table class="matrix-table">
        <tr v-for="(row, i) in nextMatrix" :key="i">
            <td v-for="(cell, j) in row" :key="j" :class="{
                'highlight-cell': isCurrentCell(i, j),
                'updated-cell': isUpdated(i, j),
                'next-highlight-primary': shouldHighlightNextPrimary(i, j),
                'next-highlight-secondary': shouldHighlightNextSecondary(i, j)
            }" :style="{
    border: shouldHighlightNextPrimary(i, j) || shouldHighlightNextSecondary(i, j)
        ? '2px solid #000' : '1px solid #ddd'
}">
                {{ cell !== null ? nodeNames[cell] : '-' }}
            </td>
        </tr>
    </table>
</template>
<style scoped>
.matrix-table {
    border-collapse: collapse;
    margin: 10px 0;
}

.matrix-table td {
    padding: 8px 12px;
    text-align: center;
}

.highlight-cell {
    background-color: #ffeb3b;
    /* 黄色高亮当前处理单元格 */
}

.updated-cell {
    background-color: #4caf50;
    /* 绿色表示更新过的单元格 */
    color: white;
}

.dist-highlight {
    background-color: #ff9800;
    /* 橙色高亮距离矩阵特定单元格 */
    font-weight: bold;
}

.next-highlight-primary {
    background-color: #2196f3;
    /* 蓝色高亮路径矩阵第一个坐标 */
    font-weight: bold;
    color: white;
}

.next-highlight-secondary {
    background-color: #9c27b0;
    /* 紫色高亮路径矩阵第二个坐标 */
    font-weight: bold;
    color: white;
}
</style>