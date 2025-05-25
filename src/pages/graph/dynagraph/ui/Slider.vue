
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  label:{
    type: String,
    default: 'label',
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const trackRef = ref(null)
const isDragging = ref(false)
const inputValue = ref(props.modelValue)
const valueRef = ref(props.modelValue)

// 计算进度百分比
const progressPercentage = computed(() => {
  return ((valueRef.value - props.min) / (props.max - props.min)) * 100
})

// 处理外部值变化
watch(() => props.modelValue, (newVal) => {
  valueRef.value = clampValue(newVal)
  inputValue.value = valueRef.value
})

// 处理输入框变化
const handleInputChange = (e) => {
  const newValue = clampValue(Number(e.target.value))
  valueRef.value = newValue
  inputValue.value = newValue
  updateValue(newValue)
}

// 开始拖动
const startDrag = (e) => {
  isDragging.value = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('touchend', stopDrag)
}

// 处理拖动
const handleDrag = (e) => {
  if (!isDragging.value) return
  
  const rect = trackRef.value.getBoundingClientRect()
  const clientX = e.clientX;// || e.touches[0].clientX
  let newPosition = ((clientX - rect.left) / rect.width) * 100
  newPosition = Math.max(0, Math.min(newPosition, 100))
  
  const newValue = props.min + (props.max - props.min) * (newPosition / 100)
  valueRef.value = clampValue(Math.round(newValue / props.step) * props.step)
  updateValue(valueRef.value)
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 点击轨道跳转
const handleTrackClick = (e) => {
  const rect = trackRef.value.getBoundingClientRect()
  const newPosition = ((e.clientX - rect.left) / rect.width) * 100
  const newValue = props.min + (props.max - props.min) * (newPosition / 100)
  valueRef.value = clampValue(Math.round(newValue / props.step) * props.step)
  updateValue(valueRef.value)
}

// 更新值并触发事件
const updateValue = (value) => {
  inputValue.value = value
  emit('update:modelValue', value)
}

// 数值范围限制
const clampValue = (value) => {
  return Math.min(props.max, Math.max(props.min, value))
}

// 初始化时同步值
onMounted(() => {
  valueRef.value = clampValue(props.modelValue)
})
</script>

<template>
  <div class="slider-container">
    <div class="label" >
      <span>{{ label }}</span>
      <input type="number" v-model.number="inputValue" @change="handleInputChange" class="value-input" :min="min" :max="max"/>
    </div>
    <div class="slider-track" ref="trackRef" @click="handleTrackClick" >
      <div class="slider-progress" :style="{ width: progressPercentage + '%' }" ></div>
      <div class="slider-thumb" :style="{ left: progressPercentage + '%' }" @mousedown="startDrag" @touchstart.passive="startDrag" ></div>
    </div>
  </div>
</template>

<style scoped>

@import '../basic_style.css';

span{
  color:aquamarine;

}

.slider-container {
  width: 100%;
}

.label{
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  align-items: center;

  margin-bottom: 10px;
  width: 100%;
}

.value-input {
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  cursor: pointer;

  margin-bottom: 5px;
}

.slider-progress {
  position: absolute;
  height: 100%;
  background-color: aquamarine;
  border-radius: 2px;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: aquamarine;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.slider-thumb:hover,
.slider-thumb:active {
  transform: translate(-50%, -50%) scale(1.2);
}

</style>