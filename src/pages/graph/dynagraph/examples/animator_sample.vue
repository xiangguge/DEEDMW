<script setup>
import {Animator} from '../Animator.js'
import {ref, onMounted} from 'vue'

//////////////////////用前须知////////////////////////////////////
//Animator 有几个关键的函数
//用于创建动画的有
//    add_function_event 
//    add_sleep_event
//用于控制动画播放流程的有
//    step_forward
//    step_backward
//    play
//    pause
//    switch_play_and_pause
//    reset

let color = ref('purple');
let size = ref('50px');
let text = ref('null');

class B extends Animator{
  constructor(){
    super();
  }
  init(){
  ///////////////////////////必要流程(1)：super.init()//////////////////////////
  super.init();

  ///////////////////////////必要流程(2)：添加任意状态向初始状态的转移//////////////////////////
  //添加任意状态向初始状态的转移函数
  //由于初始状态无上状态，不需要 backward_function
    let foward_function, backward_function;
    let sleep_time = 1000; //1000ms

    foward_function = ()=>{ color.value = 'red'; size.value = '100px'; text.value='state:0'; }
    backward_function = undefined;
    this.add_function_event(foward_function, backward_function);

  ///////////////////////////必要流程(3)：设置等待时间//////////////////////////
  //调用该函数后，会创建新状态
    this.add_sleep_event(sleep_time);

  ///////////////////////////必要流程(4)：添加向下已状态的转移函数（两个方向都要）//////////////////////////

    foward_function = ()=>{ color.value = 'green';  }
    backward_function = ()=>{ color.value = 'red';  }
    this.add_function_event(foward_function, backward_function);

    //为便于使用，在 add_sleep_event 前可多次添加转移函数
    foward_function = ()=>{ size.value = '200px'; text.value = 'state:1'}
    backward_function = ()=>{ size.value = '100px'; text.value = 'state:0'}
    this.add_function_event(foward_function, backward_function);
    
    sleep_time = 1000; //1000ms
    this.add_sleep_event(sleep_time);

  ///////////////////////////必要流程(5)：重复必要流程(4) //////////////////////////

    foward_function = ()=>{ color.value = 'yellow';  size.value='300px'; text.value='state:2'}
    backward_function = ()=>{ color.value = 'green'; size.value='200px'; text.value='state:1'}
    this.add_function_event(foward_function, backward_function);
    
    sleep_time = 1000; //500ms
    this.add_sleep_event(sleep_time);

  ///////////////////////////必要流程(6)：末尾状态无需 add_sleep_event //////////////////////////
  //因为 add_sleep_event 会创建新状态
    foward_function = ()=>{ color.value = 'pink';  size.value='400px'; text.value='state:3'}
    backward_function = ()=>{ color.value = 'yellow'; size.value='300px'; text.value='state:2'}
    this.add_function_event(foward_function, backward_function);
  }
}

let b = new B();

onMounted(()=>{
  b.init();
  b.reset();
});

</script>

<template>
<div id="sample" :style="`background-color:${color};width:${size};height:${size}`">{{ text }}</div>
<button @click="b.step_forward">forward</button>
<button @click="b.step_backward">backward</button>
<button @click="b.play">play</button>
<button @click="b.pause">pause</button>
<button @click="b.switch_play_and_pause">switch_play_and_pause</button>
<button @click="b.reset">reset</button>
</template>

<style scoped>
*{
  
}
</style>