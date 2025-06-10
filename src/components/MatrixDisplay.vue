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

// 格式化矩阵单元格值
const formattedMatrix = computed(() => {
    return props.matrix.map(row =>
        row.map(cell => {
            if (cell === Infinity) return '∞'
            if (cell === null) return '—'
            return cell
        })
    )
})

// 判断单元格是否高亮
const isHighlighted = (row, col) => {
    return props.highlight &&
        props.highlight.row === row &&
        props.highlight.col === col
}

// 判断单元格是否已更新
const isUpdated = (row, col) => {
    return isHighlighted(row, col) && props.highlight.updated
}

onMounted(() => {
    console.log("矩阵渲染组件:",animator)
})
</script>

<template>
    <div class="matrix-container">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="label in labels" :key="label">{{ label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in formattedMatrix" :key="rowIndex">
                    <th>{{ labels[rowIndex] }}</th>
                    <td v-for="(cell, colIndex) in row" :key="colIndex" :class="{
                        'highlighted': isHighlighted(rowIndex, colIndex),
                        'updated': isUpdated(rowIndex, colIndex)
                    }">
                        {{ cell }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.matrix-container {
    overflow: auto;
    max-height: 300px;
    background-color: #252526;
    border-radius: 4px;
    padding: 10px;
}

.matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-family: monospace;
    font-size: 14px;
}

.matrix-table th,
.matrix-table td {
    border: 1px solid #444;
    padding: 8px 12px;
    text-align: center;
    min-width: 40px;
}

.matrix-table th {
    background-color: #333;
    color: #4fc3f7;
}

.matrix-table td {
    background-color: #2a2a2a;
}

.highlighted {
    background-color: rgba(255, 152, 0, 0.3) !important;
    border: 2px solid #FF9800 !important;
}

.updated {
    animation: updateFlash 0.8s ease;
    background-color: rgba(244, 67, 54, 0.3) !important;
    border: 2px solid #f44336 !important;
}

@keyframes updateFlash {
    0% {
        background-color: rgba(244, 67, 54, 0.8);
    }

    100% {
        background-color: rgba(244, 67, 54, 0.3);
    }
}
</style>