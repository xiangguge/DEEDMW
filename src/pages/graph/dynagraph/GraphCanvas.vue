<script setup>
defineProps(['graph'])

import GraphNode from './Node.vue'
import GraphEdge from "./Edge.vue"

</script>

<template>
  <svg :width="graph.config.width" :height="graph.config.height">
    <GraphEdge 
      v-for="(edge,name) in graph.edge_map"
      :key="name"
      :edge="edge"
      :graph_configure="graph.config"
    />
    <GraphNode
      v-for="(node,name) in graph.node_map"
      :key="name"
      :node="node"
      :node_radius="graph.config.node_radius"
      @mousedown="(e)=>graph.mouse_interaction.on_mouse_down(e,node)"
    />
  </svg>
</template>

<style scoped>
* {
  --svg-bg-color: #333;
}

svg {
  background-color: var(--svg-bg-color);
  border: 2px solid aquamarine;
  border-radius: 10px;
  margin: 0px;
  padding: 0px;
}
</style>