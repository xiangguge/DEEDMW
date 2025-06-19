<template>
    <div class="comparison-container">
        <button class="close-btn" @click="props.animator.state.value.show = false">&times;</button>
        <h3 class="comparison-title">Distance Comparison</h3>
        <div class="comparison-content">
            <!-- 公式展示区 -->
            <div class="formula-section">
                <div class="formula-text">
                    <span class="node-label">D({{ props.animator.state.value.currentI }},{{ props.animator.state.value.currentK }})</span> +
                    <span class="node-label">D({{ props.animator.state.value.currentK }},{{ props.animator.state.value.currentJ }})</span> ≤
                    <span class="node-label">D({{ props.animator.state.value.currentI }},{{ props.animator.state.value.currentJ }})</span>
                </div>
                <div class="formula-values">
                    <span class="value-item">{{ props.animator.state.value.distanceSM }}</span> +
                    <span class="value-item">{{ props.animator.state.value.distanceME }}</span> ≤
                    <span class="value-item">{{ props.animator.state.value.distanceSE }}</span>
                </div>
            </div> 

            <!-- 比较结果 -->
            <div class="result-section">
                <div class="result-icon" :class="resultClass">
                    <i class="fa" :class="resultIcon"></i>
                </div>
                <div class="result-text" :class="resultClass">
                    {{ resultText }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    animator: { type: Object, required: true }
});

console.log("调试结果比较组件：",props.animator)



// 计算比较结果
const compareResult = computed(() => {
    const sm = parseFloat(props.animator.state.value.distanceSM);
    const me = parseFloat(props.animator.state.value.distanceME);
    const se = parseFloat(props.animator.state.value.distanceSE);

    // 处理NaN、无穷大或0值
    if (isNaN(sm) || isNaN(me) || isNaN(se) ||
        sm === Infinity || me === Infinity || se === Infinity ||
        sm === 0 || me === 0 || se === 0) {
        return false;
    }

    return (sm + me) <= se;
});



// 结果样式和文本
const resultClass = computed(() =>
    compareResult.value ? 'result-true' : 'result-false'
);

const resultIcon = computed(() =>
    compareResult.value ? 'fa-check-circle' : 'fa-times-circle'
);

const resultText = computed(() =>
    compareResult.value ? '条件满足' : '条件不满足'
);







</script>

<style scoped>
/* 保持与矩阵组件一致的基础样式 */
.comparison-container {
    position: relative; /* 为关闭按钮定位 */
    background-color: #333;
    border: 2px solid aquamarine;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
}

.comparison-title {
    color: aquamarine;
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.2em;
}

.comparison-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.formula-section {
    background-color: #252525;
    border-radius: 8px;
    padding: 12px;
}

.formula-text {
    color: aquamarine;
    font-size: 1.1em;
    text-align: center;
    margin-bottom: 8px;
}

.formula-values {
    color: #e0e0e0;
    font-size: 1.2em;
    text-align: center;
    font-family: monospace;
}

.node-label {
    color: #ff9a9e;
    /* 与矩阵组件保持一致的高亮色 */
    font-weight: bold;
}

.value-item {
    padding: 0 8px;
}

.result-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
}

.result-icon {
    font-size: 1.8em;
}

.result-text {
    font-size: 1.2em;
    font-weight: bold;
}

.result-true {
    color: #66bb6a;
    /* 绿色对勾 */
}

.result-false {
    color: #ef5350;
    /* 红色叉号 */
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.5em;
    cursor: pointer;
    line-height: 1;
}

.close-btn:hover {
    color: #fff;
}</style>
