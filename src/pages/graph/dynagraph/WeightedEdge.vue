<!-- DEEDMW/src/pages/graph/dynagraph/WeightedEdge.vue -->
<template>
    <g>
        <!-- 复用原有的边渲染 -->
        <path :d="`M${edge.u.x} ${edge.u.y}L${edge.v.x} ${edge.v.y}`" :class="edge.style_class"></path>
        <polygon :class="[edge.style_class, { show: edge.negative_arrow }]" :points="negative_arrow"></polygon>
        <polygon :class="[edge.style_class, { show: edge.positive_arrow }]" :points="positive_arrow"></polygon>
        <!-- 新增显示边的权重 -->
        <text :x="(edge.u.x + edge.v.x) / 2" :y="(edge.u.y + edge.v.y) / 2" dy=".35em" text-anchor="middle"
            :class="edge.style_class" font-size="12" stroke-width="1" :style="`user-select: none;`">{{ edge.weight }}</text>
    </g>
</template>

<script setup>
import { computed } from 'vue';
import { v2d } from './Geograph.js';
import { Edge } from './Graph.js';

const props = defineProps(['edge', 'graph_configure']);

let edge = props['edge'];
let graph_configure = props['graph_configure'];

var positive_arrow = computed(() => {
    let
        e = v2d.nrm(v2d.sub(edge.v, edge.u)), re = v2d.rot(e),
        t1 = v2d.add(edge.v, e, -graph_configure.node_radius),
        tmp = v2d.add(t1, e, -0.86602540378443864676372317075294 * graph_configure.arrow_len),
        t2 = v2d.add(tmp, re, 0.5 * graph_configure.arrow_len),
        t3 = v2d.add(tmp, re, -0.5 * graph_configure.arrow_len),
        str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
    return str;
});

var negative_arrow = computed(() => {
    let
        e = v2d.nrm(v2d.sub(edge.u, edge.v)), re = v2d.rot(e),
        t1 = v2d.add(edge.u, e, -graph_configure.node_radius),
        tmp = v2d.add(t1, e, -0.86602540378443864676372317075294 * graph_configure.arrow_len),
        t2 = v2d.add(tmp, re, 0.5 * graph_configure.arrow_len),
        t3 = v2d.add(tmp, re, -0.5 * graph_configure.arrow_len),
        str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
    return str;
});
</script>

<style scoped>
/* 复用原有的样式 */
@import './basic_style.css';
</style>
