<script setup>
import { defineProps, ref, onMounted } from 'vue';
import Node from './Node.vue';
import Edge from './Edge.vue';
import NodeStyleManager from './NodeStyleManager.js'; // 引入样式管理工具类

defineProps({
  graph: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

// 创建样式管理器实例
const styleManager = ref(new NodeStyleManager());

// 初始化节点样式
onMounted(() => {
  if (props.graph && props.graph.node_map) {
    // 设置预设的特殊节点
    if (props.graph.special_nodes) {
      const { start_node, middle_node, target_node } = props.graph.special_nodes;

      if (start_node) styleManager.value.setNodeType(start_node, 'start');
      if (middle_node) styleManager.value.setNodeType(middle_node, 'middle');
      if (target_node) styleManager.value.setNodeType(target_node, 'target');
    }

    // 初始化其他节点样式
    Object.keys(props.graph.node_map).forEach(nodeName => {
      // 如果不是特殊节点，确保设置为默认样式
      if (!styleManager.value.getNodeStyle(nodeName)) {
        styleManager.value.resetNode(nodeName);
      }
    });
  }
});

// 处理节点类型变更事件
const handleNodeTypeChange = (nodeName, nodeType) => {
  styleManager.value.setNodeType(nodeName, nodeType);
};

// 监听graph变化，更新样式
watch(() => props.graph, () => {
  // 重新初始化样式
  styleManager.value.resetAllNodes();
  onMounted();
}, { deep: true });
</script>

<template>
  <svg :width="graph.config.width" :height="graph.config.height">
    <!-- 绘制所有边 -->
    <g class="edges">
      <edge v-for="(edge, name) in graph.edge_map" :key="'edge-' + name" :edge="edge" :graph_configure="graph.config" />
    </g>

    <!-- 绘制所有节点 -->
    <g class="nodes">
      <node v-for="(node, name) in graph.node_map" :key="'node-' + name" :node="node" :graph_configure="graph.config"
        :node-style="styleManager.getNodeStyle(name)"
        @mousedown="(e) => graph.mouse_interaction.on_mouse_down(e, node)"
        @node-type-change="handleNodeTypeChange" 
        />
    </g>
  </svg>
</template>

<style scoped>
* {
  --svg-bg-color: #333;
}

svg {
  background-color: var(--svg-bg-color);
  margin: 20;
  padding: 20;
}
</style>
