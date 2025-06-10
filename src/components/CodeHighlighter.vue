<!-- CodeHighlight.vue -->
<script setup>
import { computed, defineProps, watch } from 'vue';

const props = defineProps({
    highlightedLine: {
        type: Number,
        default: -1
    }
});

// 固定代码内容（保持不变）
const codeLines = computed(() => [
    "function floydWarshall(dist, next) {",
    "  const n = dist.length;",
    "  ",
    "  for (let k = 0; k < n; k++) {",
    "    for (let i = 0; i < n; i++) {",
    "      for (let j = 0; j < n; j++) {",
    "        // 检查负权环",
    "        if (i === j && dist[i][j] < 0) {",
    "          return false; // 检测到负权环",
    "        }",
    "        ",
    "        // 比较路径",
    "        const sum = dist[i][k] + dist[k][j];",
    "        ",
    "        if (sum < dist[i][j]) {",
    "          // 更新最短路径",
    "          dist[i][j] = sum;",
    "          next[i][j] = next[i][k];",
    "        }",
    "      }",
    "    }",
    "  }",
    "  ",
    "  return true; // 算法成功完成",
    "}"
]);

// 计算高亮行（保持逻辑）
const highlightedLineContent = computed(() => {
    if (props.highlightedLine >= 0 && props.highlightedLine < codeLines.value.length) {
        return codeLines.value[props.highlightedLine];
    }
    return '';
});

watch(() => props.highlightedLine, (newVal) => {
    console.log('当前高亮行变化:', newVal);
});
</script>

<template>
    <div id="code-container">

        <div v-for="(line, index) in codeLines" :key="index" class="code-line"
            :class="{ highlighted: props.highlightedLine === index }">
            <span class="line-number">{{ index + 1 }}.</span>
            <span class="line-content">{{ line }}</span>
        </div>

    </div>
</template>

<style scoped>
#code-container {
    font-family: sans-serif, Avenir, system-ui, Helvetica, Arial;
    white-space: pre-wrap;
    /* 长代码自动换行（替代pre） */
    word-break: break-word;
    align-items: start;

    padding: 15px;
    /* 内边距 */
    margin: 20px 0;
    /* 外边距 */
    /* 辅助长单词换行 */
}

.code-line {
    padding: 6px 0;
    transition: background 0.3s;
}

.line-number {
    color: #666;
    min-width: 35px;
    display: inline-block;
    text-align: right;
    margin-right: 12px;
    user-select: none;
}

.highlighted {
    background: rgba(127, 255, 212, 0.2);
    border-left: 3px solid aquamarine;
    font-weight: bold;
}

.code-line {
    padding: 4px 0;
    /* 原6px → 4px，减少行高 */
    font-size: 14px;
    /* 微调字体大小 */
}

/* 新增动画过渡 */
.code-line {
  transition: 
    background-color var(--animation-duration, 300ms) ease-in-out,
    border-left-color var(--animation-duration, 300ms) ease-in-out,
    transform var(--animation-duration, 300ms) ease-in-out;
  transform: translateX(0);
}

/* 高亮样式（触发动画） */
.highlighted {
  background: rgba(127, 255, 212, 0.2);
  border-left: 3px solid aquamarine;
  font-weight: bold;
  transform: translateX(5px); /* 轻微位移增强动画感 */
}
</style>
