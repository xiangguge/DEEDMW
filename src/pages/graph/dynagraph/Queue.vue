<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps(['que', 'label']);

const d1 = ref(null), d2 = ref(null);
let observer = null;

onMounted(()=>{
  d1.value = document.getElementById('label')
  d2.value = document.getElementById('queue')
  observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      d1.value.style.width = entry.contentRect.width + 'px';
    })
  })
  observer.observe(d2.value)
  d1.value.style.width = d2.value.offsetWidth + 'px';
});

onBeforeUnmount(() => {
  observer?.disconnect()
});
</script>

<template>

  <div class="vis" :style="`height: ${que.height}px;`">
    <div id="label" style="flex-shrink:0;">{{ label }}</div>
    <TransitionGroup id="queue" name="list" tag="div" style="flex-grow: 1;">
      <div class="rect" v-for="(brick, key) in que.que" :key="key"
        :class="brick.style_class"
      >
        {{ brick.name }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
*{
  --style-transition-duration: 0.3s;

  --brick-width: 60px;
  --brick-height: 20px;

  --padding: 20px;

  --bg-color: #333;
}
.vis{
  display: flex;
  flex-direction: column;
}
#label{

  border-radius: 10px 10px 0px 0px;
  border: aquamarine solid 2px;
  border-bottom: aquamarine solid 1px;
  padding: 0px var(--padding) 0px var(--padding);

  width: 100%;
  height: 40px;
  background-color: var(--bg-color);;

  font-size: 1em;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;
}

#queue {
  background-color: var(--bg-color);

  margin-top: 0px;
  border-radius: 0px 0px 10px 10px;
  border: aquamarine solid 2px;
  border-top: 0px;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content:flex-start;
  gap: 5px;
  padding: var(--padding);
  
  width: fit-content;
  min-width: calc(var(--brick-width) + 4px);
}

.rect {
  width: var(--brick-width);
  height: var(--brick-height);
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1em;
  font-weight: bold;
  color: white;

  border-radius: 10px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
  transition: all 0.3s ease;

  background-color: gray;
  border: aquamarine solid 2px;
  /* filter: drop-shadow(0px 0px 6px aquamarine) */
}

.rect.init_style{
  border-color: aquamarine;
}

.rect.visited_style{
  border-color: gold;
}

.rect.current_style{
  border-color: crimson;
}

.rect.link_style{
  border-color: greenyellow;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>
