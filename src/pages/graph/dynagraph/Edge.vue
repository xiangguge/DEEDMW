<script setup>
import { computed } from 'vue';
import { v2d } from './Geograph.js'

const props = defineProps(['edge', 'graph_configure'])

let edge = props['edge'], graph_configure = props['graph_configure'];

// 箭头计算（保持原有逻辑）
const positive_arrow = computed(() => {
  let
    e = v2d.nrm(v2d.sub(edge.v, edge.u)), re = v2d.rot(e),
    t1 = v2d.add(edge.v, e, -graph_configure.node_radius),
    tmp = v2d.add(t1, e, -0.86602540378443864676372317075294 * graph_configure.arrow_len),
    t2 = v2d.add(tmp, re, 0.5 * graph_configure.arrow_len),
    t3 = v2d.add(tmp, re, -0.5 * graph_configure.arrow_len),
    str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
  return str;
});

const negative_arrow = computed(() => {
  let
    e = v2d.nrm(v2d.sub(edge.u, edge.v)), re = v2d.rot(e),
    t1 = v2d.add(edge.u, e, -graph_configure.node_radius),
    tmp = v2d.add(t1, e, -0.86602540378443864676372317075294 * graph_configure.arrow_len),
    t2 = v2d.add(tmp, re, 0.5 * graph_configure.arrow_len),
    t3 = v2d.add(tmp, re, -0.5 * graph_configure.arrow_len),
    str = `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`;
  return str;
});

// 权重标签位置计算
const labelPosition = computed(() => {
  const midX = (edge.u.x + edge.v.x) / 2;
  const midY = (edge.u.y + edge.v.y) / 2;

  // 计算边的角度
  const angle = Math.atan2(edge.v.y - edge.u.y, edge.v.x - edge.u.x);

  // 垂直偏移量（根据角度调整）
  const offset = 15;
  return {
    x: midX + Math.sin(angle) * offset,
    y: midY - Math.cos(angle) * offset
  };
});

// 权重标签颜色（根据权重正负变化）
const labelColor = computed(() => {
  if (edge.weight > 0) return '#4CAF50';  // 正权重 - 绿色
  if (edge.weight < 0) return '#F44336';  // 负权重 - 红色
  return '#2196F3';                      // 零权重 - 蓝色
});
</script>

<template>
  <g>
    <!-- 边线 -->
    <path :d="`M${edge.u.x} ${edge.u.y}L${edge.v.x} ${edge.v.y}`" :class="edge.style_class" :stroke="labelColor"></path>

    <!-- 箭头 -->
    <polygon :class="[edge.style_class, { show: edge.negative_arrow }]" :points="negative_arrow" :fill="labelColor">
    </polygon>
    <polygon :class="[edge.style_class, { show: edge.positive_arrow }]" :points="positive_arrow" :fill="labelColor">
    </polygon>

    <!-- 权重标签 -->
    <text v-if="edge.weight !== undefined" class="weight-label" :x="labelPosition.x" :y="labelPosition.y"
      :fill="labelColor" text-anchor="middle" dominant-baseline="middle">
      {{ edge.weight }}
    </text>
  </g>
</template>

<style scoped>
@import './animation_configure.css';

path {
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;
  transition: opacity var(--opacity-transition-duration) ease;
  stroke-width: 2;
}

polygon {
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;
  transition: opacity var(--style-transition-duration) ease;
}

/* 权重标签样式 */
.weight-label {
  font-size: 12px;
  font-weight: bold;
  text-shadow:
    1px 1px 2px black,
    -1px -1px 2px black,
    1px -1px 2px black,
    -1px 1px 2px black;
  pointer-events: none;
  user-select: none;
  transition: all var(--style-transition-duration) ease;
}

/* 保持原有的样式类 */
path.init_style {
  opacity: 0.5;
}

path.visited_style {
  stroke-width: 3;
  opacity: 1;
}

path.current_style {
  stroke-width: 3;
  opacity: 1;
}

path.link_style {
  stroke-width: 3;
  opacity: 1;
}

path.hide_style {
  opacity: 0;
}

polygon {
  opacity: 0;
}

polygon.show {
  opacity: 1;
}
</style>

<!-- <style scoped>

@import './animation_configure.css';

path{
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;

  transition: opacity var(--opacity-transition-duration) ease;
}

polygon{
  transition-property: stroke, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;

  transition: opacity var(--style-transition-duration) ease;
}

path.init_style{
  stroke: aquamarine;
  stroke-width: 2;
  opacity: 0.5;
}

path.visited_style{
  stroke: gold;
  stroke-width: 3;
  opacity: 1;
}

path.current_style{
  stroke: crimson;
  stroke-width: 3;
  opacity: 1;
}

path.link_style{
  stroke: greenyellow;
  stroke-width: 3;
  opacity: 1;
}

path.hide_style{
  stroke: aquamarine;
  stroke-width: 2;
  opacity: 0;
}

polygon{
  opacity: 0;
}

polygon.init_style{
  fill: aquamarine;
}

polygon.visited_style{
  fill: gold;
}

polygon.current_style{
  fill: crimson;
}

polygon.link_style{
  fill: greenyellow;
}

polygon.show{
  opacity: 1;
}

polygon.hide_style{
  fill: aquamarine;
  opacity: 0;
}
</style> -->