<template>
    <div class="matrix-container">
        <h3 class="matrix-title">Distance Matrix</h3>
        <div class="matrix-wrapper">
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="nodeName in nodeNames" :key="nodeName">{{ nodeName }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in formattedMatrix" :key="rowIndex">
                        <th>{{ nodeNames[rowIndex] }}</th>
                        <td v-for="(cell, colIndex) in row" :key="colIndex"
                            :class="{ 'matrix-highlight': isHighlighted(rowIndex, colIndex) }"
                            :style="{ '--animation-delay': `${rowIndex * 0.05 + colIndex * 0.05}s` }">
                            {{ cell }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref, onUnmounted } from 'vue';

const props = defineProps({
    animator: { type: Object, required: true }
});

// 解构高亮坐标数组（二维数组）
const { nodeNames, distMatrix, helightDistMatrix } = props.animator;

// 记录上一次的高亮坐标数组（二维数组）
const prevHighlight = ref([]);




const formattedMatrix = computed(() => {
    return props.animator.state.value.distMatrix?.map(row =>
        row.map(cell => cell === Infinity ? '∞' : cell === null ? '—' : cell)
    ) || [];
});



const isHighlighted = (row, col) => {
    return props.animator.state.value.helightDistMatrix?.some(([i, j]) => i === row && j === col);
};



</script>

<style scoped>
@import '../pages/graph/dynagraph/basic_style.css';
/* 引入之前的基础样式文件 */

.matrix-container {
    background-color: #333;
    /* 深灰背景 */
    border: 2px solid aquamarine;
    /* 青绿色边框 */
    border-radius: 10px;
    /* 圆角 */
    padding: 15px;
    /* 内边距 */
    margin: 20px 0;
    /* 外边距 */
    width: 100%;
    max-width: fit-content;
    overflow-x: auto;
    /* 横向滚动 */
}

.matrix-title {
    color: aquamarine;
    /* 青绿色标题 */
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.2em;
}

.matrix-wrapper {
    overflow-x: auto;
    /* 确保表格可横向滚动 */
}

.matrix-table {
    width: fit-content;
    /* 自适应内容宽度 */
    min-width: 80%;
    border-collapse: collapse;
    font-family: sans-serif;
    /* 无衬线字体 */
    font-size: 14px;
    color: #e0e0e0;
    /* 浅灰文本 */
}

.matrix-table th,
.matrix-table td {
    border: 1px solid #555;
    /* 深灰边框 */
    padding: 10px 18px;
    text-align: center;
    transition:
        background-color 0.3s ease-in-out,
        border-color 0.3s ease-in-out,
        box-shadow 0.3s ease-in-out,
        font-weight 0.2s ease;
}

.matrix-table th {
    background-color: #1a1a1a;
    /* 深灰标题背景 */
    color: aquamarine;
    /* 青绿色标题文本 */
    font-weight: normal;
}

.matrix-table td {
    background-color: #252525;
    /* 更深的灰色单元格 */
}

/* 基础样式（完全保留你原有的数值） */
.matrix-table td {
    background-color: #252525;
    /* 保留原有背景色 */
    border-color: #555;
    /* 保留原有边框色 */
    color: #e0e0e0;
    /* 保留原有文本颜色（确保数字可见） */
    font-weight: normal;
    /* 保留原有字体粗细 */
    box-shadow: none;
    /* 保留原有阴影 */
}

/* 高亮+消失动画（仅影响装饰性样式，不影响文本） */
/* 高亮动画 */
@keyframes highlighted {
    0% {
        background-color: #252525;
        border-color: #555;
        box-shadow: none;
        font-weight: normal;
    }

    25% {
        background-color: rgba(127, 255, 212, 0.4);
        border-color: aquamarine;
        box-shadow: 0 0 10px rgba(127, 255, 212, 0.6);
        font-weight: bold;
    }

    100% {
        background-color: #252525;
        border-color: #555;
        box-shadow: none;
        font-weight: normal;
    }
}

/* 应用动画 */
.matrix-highlight {
    animation: highlighted 2s ease-in-out 1;
    animation-fill-mode: both;
    /* 保持动画结束状态 */
    animation-delay: var(--animation-delay);
    /* 应用延迟变量 */
}
</style>