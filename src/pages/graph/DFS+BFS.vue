<script setup>
import { onMounted, reactive, computed, ref, shallowReactive, markRaw } from 'vue'

//Vue components
import { Graph } from './dynagraph/Graph.js';
import { ForceLayout } from './dynagraph/GraphLayout';
import { DfsAnimator, BfsAnimator } from './dynagraph/Animator.js';
import graph_canvas from './dynagraph/GraphCanvas.vue'
import { Queue } from './dynagraph/Queue.js';
import queue from './dynagraph/Queue.vue'
import Slider from './dynagraph/ui/Slider.vue';

import { Play, Pause } from '@vicons/ionicons5'
import { StepForwardFilled, StepBackwardFilled } from '@vicons/antd'
import { ReplayFilled} from '@vicons/material'

import { NSwitch } from 'naive-ui';

const graph = new Graph(450, 450);
const force_layout = new ForceLayout(graph);
const que = new Queue(450+4);
const dfs_animator = new DfsAnimator(graph, que);
const bfs_animator = new BfsAnimator(graph, que);

let start_node = ref('1');
let default_fresh_input =`
1 2
1 3
1 4
2 5
2 6
2 7
4 8
4 9
4 10
6 11
6 12
6 13
9 15
9 16
9 17`;

function rect_dots() {
  default_fresh_input = '';
  let
    radius = graph.config.node_radius,
    rows = 3, cols = 3, x, y,
    padding = 3 * radius,
    tot_width = 2 * radius + (rows - 1) * (2 * radius + padding),
    tot_height = 2 * radius + (cols - 1) * (2 * radius + padding),
    bx = (graph.config.width - tot_width) / 2 + radius, dx = 2 * radius + padding,
    by = (graph.config.height - tot_height) / 2 + radius, dy = 2 * radius + padding,
    count;
  // console.log(`w&h:${graph.config.width}&${graph.config.height} dx:${dx} dy:${dy}`);
  for (let r = 0; r < rows; ++r) {
    y = by + r * dx;
    for (let c = 0; c < cols; ++c) {
      x = bx + c * dy;
      let id = r * cols + c;
      graph.add_node(`${id}`, [x, y]);
    }
  }
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
      let nlist = [[r, c + 1], [r + 1, c], [r + 1, c + 1], [r + 1, c - 1]];
      nlist.sort(() => Math.random() - 0.5);
      for (let [nr, nc] of nlist) {
        if (nr >= rows || nc >= cols || nr < 0 || nc < 0) continue;
        let id = r * cols + c, nid = nr * cols + nc;
        graph.add_edge(`${id}`, `${nid}`);
        default_fresh_input += `${id} ${nid}\n`;
      }
    }
  }
};

// rect_dots();

let animator = dfs_animator;
const which_animator = ref(false);

function get_start_node(){
  if (!graph.node_map[start_node.value])
    start_node.value = Object.keys(graph.node_map)[0];
};

let on_input_timer = null;
function on_input(e) {
  if (on_input_timer) clearTimeout(on_input_timer);
  on_input_timer = setTimeout(() => {
    on_input_timer = null;
    graph.str_to_graph(e.target.value);
    get_start_node();
    animator.init(start_node.value);
  }, 500);
};

function change_animator(){
  animator.pause();
  if (animator === dfs_animator) animator = bfs_animator, which_animator.value = true;
  else if (animator === bfs_animator) animator = dfs_animator, which_animator.value = false;
  animator.init(start_node.value);
};

let icons = {
  play: markRaw(Play),
  pause: markRaw(Pause),
  step_forward: markRaw(StepForwardFilled),
  step_backward: markRaw(StepBackwardFilled),
  replay: markRaw(ReplayFilled)
};


let menu = reactive({
  railStyle: ({focused,checked}) => {
    const style = {};
    style.boxShadow = "0 0 0 0px";
    style.background = checked ? "rgb(76, 250, 146)" : "#444";
    return style;
  },
  force_layout:{
    is_animated: true,
    change_animated: (value)=>{
      if(value) force_layout.start_animation();
      else force_layout.stop_animation()
    }
  },
  animator:{
    time_interval: 500,
    change_time_interval: ()=>{
      dfs_animator.time_interval = menu.animator.time_interval;
      bfs_animator.time_interval = menu.animator.time_interval;
      animator.init(start_node.value);
    }
  }
});

onMounted(() => {
  graph.str_to_graph(default_fresh_input);
  get_start_node();
  menu.animator.change_time_interval();
  animator.init(start_node.value);
  menu.force_layout.change_animated(menu.force_layout.is_animated);
});


</script>

<template>
  <div id="container">
    <div style="gap:20px; height:fit-content; display: flex; flex-direction: row; justify-content: center; align-items: stretch;">
      <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap:20px" :height="graph.config.height">
        <div id="operate">
          <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
            <span style="margin-right:5px">Start Node:</span>
            <input 
              @change="(e)=>{start_node = e.target.value;animator.init(start_node);}"
              v-model="start_node" style="width: 100px; text-align: center; " type="text">
          </div>
          <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px">
            <button @click="change_animator">{{ which_animator ? 'BFS' : 'DFS' }}</button>
            <button @click="animator.switch_play_and_pause"><component :is="animator.is_playing.value ? icons.pause : icons.play"/></button>
            <button @click="animator.step_forward"><component :is="icons.step_forward"/> </button>
            <button @click="animator.step_backward"><component :is="icons.step_backward"/></button>
            <button @click="animator.reset"><component :is="icons.replay"/></button>
          </div>
        </div>
        <textarea 
          @input="on_input" spellcheck="false" >{{ default_fresh_input }}
        </textarea>
      </div>
      <graph_canvas :graph="graph" />
      <queue :que="que" :label="which_animator ? `Queue` : `Stack`"/>
      <div id="menu">
        <span>Graph Configuration</span>
        <div class="menu-item">
          <Slider v-model="graph.config.node_radius" :label="`Node radius`" :min="5" :max="25"/>
        </div>
        <span>Force Layout</span>
        <div class="menu-item">
          <span>Active</span>
          <n-switch 
            v-model:value="menu.force_layout.is_animated"
            @update:value="menu.force_layout.change_animated"
            :rail-style="menu.railStyle"
            />
        </div>
        <div class="menu-item">
          <Slider v-model="force_layout.ideal_edge_length" :label="'Ideal edge length'" :min="5" :max="250"/>
        </div>
        <div class="menu-item">
          <Slider v-model="force_layout.exclusive_radius" :label="'Exclusive radius'" :min="5" :max="250"/>
        </div>
        <span>Animation Configuration</span>
        <div class="menu-item">
          <label>Time Interval</label>
          <span><input type="number" v-model.number="menu.animator.time_interval" @change="menu.animator.change_time_interval"> ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

@import './dynagraph/basic_style.css';

* {
  font-family: sans-serif, Avenir, system-ui , Helvetica, Arial, ;
  color-scheme: light dark;
  color: aquamarine;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button{
  width: 30px;
  height: 30px;
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

#operate {
  background-color: #333;
  height: fit-content;
  width: 200px;
  padding: 10px 5px 10px 5px;

  border: 2px solid aquamarine;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

#operate button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#menu{
  background-color: #333;
  border: 2px solid aquamarine;
  border-radius: 10px;

  padding: 20px;

  width: 250px;
  height: 410px;

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
input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
