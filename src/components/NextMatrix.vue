<template>
    <div class="matrix-container">
        <h3 class="matrix-title">Path Matrix</h3>
        <div class="matrix-wrapper">
            <table class="matrix-table">
                <thead>
                    <tr>
                        <th></th>
                        <th v-for="nodeName in nodeNames" :key="nodeName">{{ nodeName }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in formattedNextMatrix" :key="rowIndex">
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
import { computed, ref, watch } from "vue";

const props = defineProps({
    animator: { type: Object, required: true }
});

// 安全转换为数组
const toSafeArray = (refValue) => {
    const value = refValue?.value ?? refValue;
    if (Array.isArray(value)) return [...value];
    console.error('非数组类型:', value);
    return [];
};

// 数据副本管理
const copiedHighlightedCells = ref([]);
const copiedNodeNames = ref([]);
const copiedNextMatrix = ref([]);

// 监听原始数据变化，更新副本
watch(
    () => [
        props.animator.state.value.helightNextMatrix,
        props.animator.nodeNames,
        props.animator.state.value.nextMatrix
    ],
    ([newHighlights, newNodeNames, newMatrix]) => {
        copiedHighlightedCells.value = toSafeArray(newHighlights);
        copiedNodeNames.value = toSafeArray(newNodeNames);
        copiedNextMatrix.value = toSafeArray(newMatrix).map(row => toSafeArray(row));
    },
    { deep: true }
);

// 格式化矩阵数据
const formattedNextMatrix = computed(() =>
    copiedNextMatrix.value.map(row =>
        row.map(cell => cell === null ? '—' : cell)
    )
);

// 节点名称
const nodeNames = computed(() => copiedNodeNames.value);

// 计算高亮状态（直接检查坐标是否在当前高亮数组中）
const isHighlighted = (row, col) => {
    return copiedHighlightedCells.value.some(([i, j]) => i === row && j === col);
};
</script>

<style scoped>
@import '../pages/graph/dynagraph/basic_style.css';

/* 容器样式 */
.matrix-container {
    background-color: #333;
    border: 2px solid aquamarine;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
    width: 100%;
    max-width: fit-content;
    overflow-x: auto;
}

.matrix-title {
    color: aquamarine;
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.2em;
}

.matrix-wrapper {
    overflow-x: auto;
}

/* 表格样式 */
.matrix-table {
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 14px;
    color: #e0e0e0;
}

.matrix-table th,
.matrix-table td {
    border: 1px solid #555;
    padding: 10px 18px;
    text-align: center;
}

.matrix-table th {
    background-color: #1a1a1a;
    color: aquamarine;
    font-weight: normal;
}

.matrix-table td {
    background-color: #252525;
}

/* 高亮基础样式 */
.highlighted-first,
.highlighted-second {
    background-color: rgba(127, 255, 212, 0.2) !important;
    border-color: aquamarine !important;
    font-weight: bold !important;
    box-shadow: 0 0 4px rgba(127, 255, 212, 0.4) !important;
    transition: all 0.3s ease;
}

/* 动画样式 */
.highlight-animation {
    &.highlighted-first {
        transition: all 1s ease;
        transform: scale(1);

        &.active {
            transform: scale(1.05);
            box-shadow: 0 0 12px rgba(127, 255, 212, 0.6);
        }
    }

    &.highlighted-second {
        transition: all 1s ease 0.5s;
        transform: scale(1);

        &.active {
            transform: scale(1.05);
            box-shadow: 0 0 12px rgba(127, 255, 212, 0.6);
        }
    }
}

/* 复用 Distance Matrix 的高亮动画 */
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

.matrix-highlight {
    animation: highlighted 1s ease-in-out 1; /* 时间减半为1秒 */
    animation-fill-mode: forwards; /* 动画结束后恢复原始样式 */
    animation-delay: var(--animation-delay);
    transition: none; /* 防止过渡影响动画 */
}
</style>
