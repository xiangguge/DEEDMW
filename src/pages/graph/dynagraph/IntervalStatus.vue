<!--
 * @Author: 123 1217776571@qq.com
 * @Date: 2025-06-18 06:49:58
 * @LastEditors: 123 1217776571@qq.com
 * @LastEditTime: 2025-06-18 21:07:14
 * @FilePath: \DEEDMW\src\pages\graph\dynagraph\IntervalStatus.vue
 * @Description: 
 * 123dot
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <svg :width="graph.config.width" :height="graph.config.height">
        <!-- 绘制边 -->
        <g class="edges">
            <Edge v-for="(edge, name) in graph.edge_map" :key="name" :edge="edge" :graph_configure="graph.config" />
        </g>

        <!-- 绘制节点 -->
        <g class="nodes">
            <Node v-for="(node, name) in graph.node_map" :key="name" :node="node" :node_radius="graph.config.node_radius"
                :node-style="node.style_class" />

            <!-- 节点标签 -->
            <g class="node-labels">
                <text v-for="(node, name) in graph.node_map" :key="'label-' + name" :x="node.x"
                    :y="node.y + graph.config.node_radius + 20" text-anchor="middle" fill="white" font-size="12px">
                    {{ node.label }}
                </text>
            </g>
        </g>
    </svg>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Node from './Node.vue';
import Edge from './Edge.vue';

const props = defineProps({
    animator: { type: Object, required: true }
});

const graphConfig = {
    width: 300,
    height: 200,
    node_radius: 15,
    arrow_len: 12
};

const fixedNodePositions = [
    { x: 75, y: 150 },
    { x: 150, y: 50 },
    { x: 225, y: 150 }
];

// 辅助函数：将 Infinity 转换为 '∞'
const formatInfinity = (value) => (value === Infinity ? '∞' : value);

// **关键修改：使用计算属性获取权重值，并在显示前格式化**
const distanceSM = computed(() => formatInfinity(props.animator.state.value.distanceSM));
const distanceME = computed(() => formatInfinity(props.animator.state.value.distanceME));
const distanceSE = computed(() => formatInfinity(props.animator.state.value.distanceSE));

const graph = ref({
    config: graphConfig,
    node_map: {
        nodeI: { x: fixedNodePositions[0].x, y: fixedNodePositions[0].y, name: props.animator.state.value.currentI || '-', style_class: 'start_node', label: '起始节点' },
        nodeK: { x: fixedNodePositions[1].x, y: fixedNodePositions[1].y, name: props.animator.state.value.currentK || '-', style_class: 'middle_node', label: '中间节点' },
        nodeJ: { x: fixedNodePositions[2].x, y: fixedNodePositions[2].y, name: props.animator.state.value.currentJ || '-', style_class: 'target_node', label: '目标节点' },
    },
    edge_map: {
        edgeIK: { u: fixedNodePositions[0], v: fixedNodePositions[1], weight: distanceSM, style_class: 'init_style', positive_arrow: true },
        edgeKJ: { u: fixedNodePositions[1], v: fixedNodePositions[2], weight: distanceME, style_class: 'init_style', positive_arrow: true },
        edgeIJ: { u: fixedNodePositions[0], v: fixedNodePositions[2], weight: distanceSE, style_class: 'init_style', positive_arrow: true },
    }
});

// 监听节点名称变化
watch([
    () => props.animator.state.value.currentI,
    () => props.animator.state.value.currentK,
    () => props.animator.state.value.currentJ
], () => {
    graph.value.node_map.nodeI.name = props.animator.state.value.currentI || '-';
    graph.value.node_map.nodeK.name = props.animator.state.value.currentK || '-';
    graph.value.node_map.nodeJ.name = props.animator.state.value.currentJ || '-';
},{immediate: true});
</script>

<style scoped>
svg {
    background-color: #333;
    border: 2px solid aquamarine;
    border-radius: 10px;
}

.node-labels text {
    fill: white;
    font-family: sans-serif;
    text-shadow: 0 0 2px #000;
}
</style>
