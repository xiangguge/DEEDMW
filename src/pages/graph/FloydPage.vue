<template>
    <div id="container">
        <div
            style="gap:20px; height:fit-content; display: flex; flex-direction: row; justify-content: center; align-items: stretch;">
            <!-- 1. 左侧栏（操作+输入+配置，垂直堆叠） -->
            <div id="config"
                style="gap:20px; height:fit-content; display: flex; flex-direction: column; justify-content: center; align-items: stretch;">
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap:20px"
                    :height="graph.config.height">
                    <div id="operate">
                        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
                            <span style="margin-right:5px">Start Node:</span>
                            <input @change="(e) => { start_node = e.target.value; animator.init(start_node); }"
                                v-model="start_node" style="width: 100px; text-align: center; " type="text">
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: center; gap: 10px">

                            <button @click="animator.switch_play_and_pause">
                                <component :is="animator.is_playing.value ? icons.pause : icons.play" />
                            </button>
                            <button @click="animator.step_forward">
                                <component :is="icons.step_forward" />
                            </button>
                            <button @click="animator.step_backward">
                                <component :is="icons.step_backward" />
                            </button>
                            <button @click="animator.reset">
                                <component :is="icons.replay" />
                            </button>
                        </div>
                    </div>
                    <textarea style="height: 150px ;" @input="on_input" spellcheck="false">{{ default_fresh_input }}
                </textarea>
                </div>
                <div id="menu">
                    <span>Graph Configuration</span>
                    <div class="menu-item">
                        <Slider v-model="graph.config.node_radius" :label="`Node radius`" :min="5" :max="25" />
                    </div>
                    <!-- <span>Force Layout</span>
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
            </div> -->
                    <span>Animation Configuration</span>
                    <div class="menu-item">
                        <label>Time Interval</label>
                        <span><input type="number" v-model.number="menu.animator.time_interval"
                                @change="menu.animator.change_time_interval"> ms</span>
                    </div>
                </div>
            </div>

            <!-- 2. 主图形（上） -->
            <div id="graphs"
                style="display: flex; flex-direction: column; justify-content: initial; align-items: center; gap:20px"
                :height="graph.config.height">
                <div style="padding: 15px; margin: 20px 0;">
                    <graph_canvas v-if="graph" :graph="graph" />
                </div>
                <div>
                    <IntervalStatus :animator="animator"></IntervalStatus>
                </div>
                <div v-if="animator.updated.value">
                    <DistanceComparison :animator="animator"></DistanceComparison>
                </div>
            </div>


            <!-- 4. 距离矩阵（上） -->
            <div id="matrixs"
                style="display: flex; flex-direction: column; justify-content: initial; align-items:center;  width:350px">
                <div>
                    <DistanceMatrix :animator="animator" />
                </div>
                <div>
                    <NextMatrix :animator="animator" />
                </div>


            </div>



            <!-- 6. 代码区（右侧，占满整列） -->
            <div id="codes"
                style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap:20px ; width:350px">
                <div>
                    <CodeHighlighter :highlightedLine="animator.codeline.value" />
                </div>

            </div>

        </div>


    </div>
</template>




<script setup>
import { shallowRef, onMounted, reactive, ref, markRaw } from 'vue';
import { WeightedGraph } from './dynagraph/WeightedDirectedGraph.js';
import { ForceLayout } from './dynagraph/GraphLayout.js';
import DistanceMatrix from '../../components/DistanceMatrix.vue';
import NextMatrix from '../../components/NextMatrix.vue';
import CodeHighlighter from '../../components/CodeHighlighter.vue';
import DistanceComparison from '../../components/DistanceComparison.vue';
import IntervalStatus from './dynagraph/IntervalStatus.vue'
import { FloydAnimator } from './dynagraph/FloydAnimator.js';
import graph_canvas from './dynagraph/GraphCanvas.vue';
import { Play, Pause } from '@vicons/ionicons5'
import { StepForwardFilled, StepBackwardFilled } from '@vicons/antd'
import { ReplayFilled } from '@vicons/material'
import MatrixRenderer from './dynagraph/MatrixRenderer.vue';

import { useTitleStore } from '@/stores/title'
const titleStore = useTitleStore()
titleStore.setTitle('Floyd算法')


const graph = new WeightedGraph(300, 200);
const animator = new FloydAnimator(graph)



// const force_layout = new ForceLayout(graph);


// 控制按钮图标
let icons = {
    play: markRaw(Play),
    pause: markRaw(Pause),
    step_forward: markRaw(StepForwardFilled),
    step_backward: markRaw(StepBackwardFilled),
    replay: markRaw(ReplayFilled)
}

const default_fresh_input = `
A B 2
A C -5
A D -1
B D 8
B C 7
C D -5`


function on_input(e) {
    graph.str_to_graph(e.target.value);
    nodes.value = Object.keys(graph.node_map);
    animator.init();
    // 添加调试输出
    console.log('Updated distanceMatrix in FloydPage:');
}
let menu = reactive({
    railStyle: ({ focused, checked }) => {
        const style = {};
        style.boxShadow = "0 0 0 0px";
        style.background = checked ? "rgb(76, 250, 146)" : "#444";
        return style;
    },
    // force_layout: {
    //     is_animated: true,
    //     change_animated: (value) => {
    //         if (value) force_layout.start_animation()
    //         else force_layout.stop_animation()
    //     }
    // },
    animator: {
        time_interval: 1500,
        change_time_interval: () => {
            animator.time_interval = menu.animator.time_interval
        }
    }
})



onMounted(() => {

    graph.str_to_graph(default_fresh_input);
    menu.animator.change_time_interval();
    animator.init();
});
</script>

<style scoped>
@import './dynagraph/basic_style.css';

* {
    font-family: sans-serif, Avenir, system-ui, Helvetica, Arial;
    /* 通用字体栈 */
    color-scheme: light dark;
    /* 支持系统明暗模式 */
    color: aquamarine;
    /* 主色调 */
    text-rendering: optimizeLegibility;
    /* 优化文本渲染 */
    -webkit-font-smoothing: antialiased;
    /* 抗锯齿 */
}


#container {
    margin-top: 30px;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

/* 四列布局的主要模块 */
#config {
    background-color: #333;
    /* 深色背景 */
    border: 2px solid aquamarine;
    /* 青绿色边框 */
    border-radius: 10px;
    /* 圆角 */
    display: flex;
    flex-direction: column;
    gap: 10px;

}

#graphs {
    background-color: #333;
    /* 深色背景 */
    border: 2px solid aquamarine;
    /* 青绿色边框 */
    border-radius: 10px;
    /* 圆角 */
    display: flex;
    flex-direction: column;
    gap: 10px;

}

#matrixs {
    background-color: #333;
    /* 深色背景 */
    border: 2px solid aquamarine;
    /* 青绿色边框 */
    border-radius: 10px;
    width: max-content;
    /* 圆角 */
    display: flex;
    flex-direction: column;
    gap: 2px;
}

#codes {
    background-color: #333;
    /* 深色背景 */
    border: 2px solid aquamarine;
    /* 青绿色边框 */
    border-radius: 10px;
    /* 圆角 */
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* 子元素间距 */
}

/* 响应式调整 - 根据屏幕宽度自动调整列数 */
@media (max-width: 1400px) {

    #config,
    #graphs,
    #matrixs,
    #codes {
        width: calc(33.33% - 20px);
        /* 变为3列 */
    }
}

@media (max-width: 1024px) {

    #config,
    #graphs,
    #matrixs,
    #codes {
        width: calc(50% - 20px);
        /* 变为2列 */
    }
}

@media (max-width: 600px) {

    #config,
    #graphs,
    #matrixs,
    #codes {
        width: 100%;
        /* 变为1列 */
    }
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

#menu {
    background-color: #333;
    border: 2px solid aquamarine;
    border-radius: 10px;

    padding: 20px;

    width: 250px;
    height: 410px;

    color: aquamarine;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;

    user-select: none;

    overflow-y: auto;
}

.menu-item {
    background-color: #555;
    padding: 5px 10px;
    border-radius: 10px;

    width: auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

}

.menu-item input {
    width: fit-content;
    height: 800px;
    padding: 2px;
    border-radius: 4px;
    max-width: 50px;
}

input[type="number"] {
    -moz-appearance: textfield;
    /* Firefox */
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;

}
</style>



