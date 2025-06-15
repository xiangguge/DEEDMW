<script setup>

import { reactive, onMounted, ref, markRaw } from 'vue';
import { HuffmanGraph, HuffmanAnimator } from './dynagraph/Huffman.js'

import Slider from './dynagraph/ui/Slider.vue';
import { Play, Pause } from '@vicons/ionicons5'
import { StepForwardFilled, StepBackwardFilled } from '@vicons/antd'
import { ReplayFilled} from '@vicons/material'
import { NSwitch } from 'naive-ui';

import { useTitleStore } from '@/stores/title'
const titleStore = useTitleStore()
titleStore.setTitle('Huffman Code')

let is_move = ref(false);
let huffman_graph = new HuffmanGraph(800, 500);
let huffman_animator = new HuffmanAnimator(huffman_graph, is_move);

function change_text(text){
  huffman_graph.clear();
  console.log(text);
  huffman_graph.init(text);
  huffman_animator.init();
}

let default_input =`SYSU GREAT FOEVER`
onMounted(()=>{
  change_text(default_input)
})

let icons = {
  play: markRaw(Play),
  pause: markRaw(Pause),
  step_forward: markRaw(StepForwardFilled),
  step_backward: markRaw(StepBackwardFilled),
  replay: markRaw(ReplayFilled)
};

let menu = reactive({
  animator:{
    time_interval: huffman_animator.time_interval,
    change_time_interval: ()=>{
      huffman_animator.time_interval = menu.animator.time_interval;
      huffman_animator.init();
    }
  }
});

</script>

<template>
  <div id="container">
    <div style="gap:20px; height:500px; display: flex; flex-direction: row; justify-content: center; align-items: stretch;">
      <div id="menu">
        <span>Huffman Text</span>
        <div style="display: flex; flex-direction: row; justify-content: center;">
          <textarea 
            @change="(e)=>change_text(e.target.value)" spellcheck="false" >{{ default_input }}</textarea>
        </div>
        <span>Operate</span>
        <div class="menu-item" 
          style="display: flex; flex-direction: row; justify-content: center; gap: 10px">
          <button @click="huffman_animator.switch_play_and_pause"><component :is="huffman_animator.is_playing.value ? icons.pause : icons.play"/></button>
          <button @click="huffman_animator.step_forward"><component :is="icons.step_forward"/> </button>
          <button @click="huffman_animator.step_backward"><component :is="icons.step_backward"/></button>
          <button @click="huffman_animator.reset"><component :is="icons.replay"/></button>
        </div>
        <span>Animation Configure</span>
        <div class="menu-item">
          <label>Time Interval</label>
          <span><input type="number" v-model.number="menu.animator.time_interval" @change="menu.animator.change_time_interval"> ms</span>
        </div>
      </div>
      
      <svg class="canvas" 
        :width="huffman_graph.config.width" :height="huffman_graph.config.height">
        <g v-for="(edge,name) in huffman_graph.edge_map" :opacity="edge.show ? 1.0 : 0.0">
          <path
            :d="`M${edge.u.x} ${edge.u.y}L${edge.v.x} ${edge.v.y}`"
            >
          </path>
        </g>
        <template v-for="node in huffman_graph.node_map">
          <g v-if="node.is_leaf" :transform="`translate(${node.x}, ${node.y})`" :opacity="node.show ? `1.0` : `0.0`">
            <rect
              class="leaf top"
              :x="-huffman_graph.config.node_radius"
              :y="-2*huffman_graph.config.node_radius"
              :width="2*huffman_graph.config.node_radius"
              :height="1*huffman_graph.config.node_radius"
            ></rect>
            <text
              class="leaf-weight"
              font-size="10"
              :y="-2*huffman_graph.config.node_radius"
              dy="1.0em"
            >{{ node.weight }}</text>
            <text 
              :y="2*huffman_graph.config.node_radius"
              dy=".35em"
            >{{ node.binary_encoding }}</text>
            <rect
              class="leaf"
              :x="-huffman_graph.config.node_radius"
              :y="-huffman_graph.config.node_radius"
              :width="2*huffman_graph.config.node_radius"
              :height="2*huffman_graph.config.node_radius"
            ></rect>
            <text 
              dy=".35em"
            >{{ node.name }}</text>
          </g>
          <g v-if="!node.is_leaf" :transform="`translate(${node.x}, ${node.y})`" :opacity="node.show ? `1.0` : `0.0`">
            <rect
              class="branch"
              :x="-huffman_graph.config.node_radius"
              :y="-huffman_graph.config.node_radius"
              :width="2*huffman_graph.config.node_radius"
              :height="2*huffman_graph.config.node_radius"
            ></rect>
            <text
              font-size="12" 
              dy=".35em"
            >{{ node.weight }}</text>
          </g>
        </template>
      </svg>
    </div>
  </div>
</template>

<style scoped>
@import './dynagraph/basic_style.css';

* {
  --svg-bg-color: #333;
  --pos-transition-duration: 0.5s;
  --opacity-transition-duration: 0.5s;
}

button{
  width: 30px;
  height: 30px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#container {
  margin-top: 30px;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#menu{
  background-color: #333;
  border: 2px solid aquamarine;
  border-radius: 10px;

  padding: 20px;

  width: 300px;
  height: 500px - 40px;

  color:aquamarine;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;

  user-select: none;

  overflow-y: auto;
}

.menu-item{
  background-color: #555;
  padding:5px 10px;
  border-radius: 10px;

  width: auto;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.menu-item input{
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
  max-width: 50px;
}

textarea {
  --bg-color: 333;
  background-color: #333;
  width: 200px;
  height: 100px;
  padding: 5px;
  outline: 0px;

  border: 2px solid aquamarine;
  border-radius: 10px;

  color: aquamarine;
}

textarea::placeholder {
  color: rgb(74, 156, 128);
  opacity: 1;
}

textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 4px
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #999;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

svg.canvas {
  background-color: var(--svg-bg-color);
  border: 2px solid aquamarine;
  border-radius: 10px;
  margin: 0px;
  padding: 0px;
}

path {
  transition: d var(--pos-transition-duration) ease;
  stroke-width: 2;
  stroke: aqua;
}

g{
  transition:
    transform var(--pos-transition-duration) ease,
    opacity var(--opacity-transition-duration) ease;
}

rect{
  fill: gray;
  stroke: aqua;
  stroke-width: 2;
  filter: drop-shadow(0px 0px 4px aqua)
}

text{
  font-size: 14;
  stroke: white;
  stroke-width: 1;
  text-anchor: middle;
  user-select: none;
}

text.leaf-weight{
  transition: all var(--pos-transition-duration) ease;
}

</style>