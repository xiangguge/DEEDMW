<script setup>
import { onMounted } from 'vue';
import { NodeStyleManager } from '../../../utils/NodeStyleManager.js'

defineProps(['node', 'node_radius'])
onMounted(()=>{
  
})
</script>
<template>
  <g>
    <circle
      :cx="node.x" :cy="node.y" :r="node_radius"
      :class="node.style_class"
    ></circle>
    <text 
        :x="node.x" :y="node.y" dy=".35em" text-anchor="middle"
        :class="node.style_class"
        font-size="14"
        stroke-width="1"
        :style="`user-select: none;`"
        v-if="node_radius > 9"
    >{{ node.name }}</text>
  </g>
</template>

<style scoped>

@import './animation_configure.css';

circle,text{
  transition-property: fill, stroke, filter, stroke-width;
  transition-duration: var(--style-transition-duration);
  transition-timing-function: ease;
}

circle.init_style{
  fill: gray;
  stroke: aqua;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px aqua)
}
text.init_style{
  stroke: white;
}

circle.visited_style{
  fill: rgb(168, 152, 58);
  stroke: gold;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px gold)
}
text.visited_style{
  stroke: rgb(246, 240, 209);
}

circle.current_style{
  fill: rgb(112, 33, 49);
  stroke:crimson;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px crimson)
}
text.current_style{
  stroke: rgb(239, 189, 200);
}

circle.link_style{
  fill: rgb(135, 157, 101);
  stroke:greenyellow;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px greenyellow)
}
text.link_style{
  stroke: rgb(216, 236, 183);
}


/* 新增：起始节点样式 */
circle.start_node{
  fill: rgb(72, 118, 255);
  stroke: rgb(0, 60, 136);
  stroke-width: 3;
  filter: drop-shadow(0px 0px 8px rgb(72, 118, 255));
}
text.start_node{
  stroke: rgb(213, 229, 255);
}

/* 新增：中间节点样式 */
circle.middle_node{
  fill: rgb(118, 118, 118);
  stroke: rgb(76, 76, 76);
  stroke-width: 2;
  filter: drop-shadow(0px 0px 6px rgb(118, 118, 118));
}
text.middle_node{
  stroke: rgb(229, 229, 229);
}

/* 新增：目标节点样式 */
circle.target_node{
  fill: rgb(255, 118, 118);
  stroke: rgb(136, 0, 0);
  stroke-width: 3;
  filter: drop-shadow(0px 0px 8px rgb(255, 118, 118));
}
text.target_node{
  stroke: rgb(255, 213, 213);
}

</style>