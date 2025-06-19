// DEEDMW/src/pages/graph/dynagraph/FloydAnimator.js
import { watch, ref } from "vue";
import { Animator } from "./Animator.js";

// 一个用于深拷贝状态对象的辅助函数。
// 对于这个只包含可序列化数据的状态对象来说，JSON.parse/stringify 是一个简单有效的方法。
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export class FloydAnimator extends Animator {
  constructor(graph) {
    super();
    this.graph = graph;
    this.nodeNames = ref([]);
    this.timeInterval = ref(200);

    // 1. 所有可变状态都集中在这个响应式对象中
    this.state = ref({
      distMatrix: [],
      nextMatrix: [],
      currentI: "",
      currentJ: "",
      currentK: "",
      codeline: -1,
      helightDistMatrix: [],
      helightNextMatrix: [],
      sum: -1,
      distanceSM: Infinity,
      distanceME: Infinity,
      distanceSE: Infinity,
      comparison: null,
      updated: false,
      show: false,
      nodeStyles: {},
    });

    // 2. 用于存储历史状态快照的栈
    this.stateStack = [];

    // 3. 监听 nodeStyles 的变化，并将其应用到实际的 graph 对象上
    // 这将状态(state)与副作用(修改graph)分离
    watch(
      () => this.state.value.nodeStyles,
      (newStyles) => {
        if (!newStyles || !this.graph.node_map) return;
        // 首先重置所有节点样式
        Object.keys(this.graph.node_map).forEach((name) => {
          this.graph.node_map[name].style_class = 'init_style';
        });
        // 然后应用新的样式
        for (const nodeName in newStyles) {
          if (this.graph.node_map[nodeName]) {
            this.graph.node_map[nodeName].style_class = newStyles[nodeName];
          }
        }
      },
      { deep: true }
    );
  }
  setReadyState(initialState) {
    this.state.value = initialState;
  }
  getReadyState() {
    const initialState = deepClone(this.state.value);
    return initialState;
  }

  /**
   * @private
   * 添加一个改变状态的动画步骤。
   * 自动处理状态的压栈和出栈，用于实现前进和后退。
   * @param {function(object): void} mutator - 一个接收 state 对象并对其进行修改的函数。
   */
  _addStateChange(mutator) {
    this.add_function_event(
      () => {
        // 前进时：将当前状态的引用推入栈中，然后创建一个新状态并替换旧状态
        this.stateStack.push(this.state.value);
        const newState = deepClone(this.state.value);
        mutator(newState);
        this.state.value = newState;
      },
      () => {
        // 后退时：从栈中弹出上一个状态对象来恢复
        const prevState = this.stateStack.pop();
        if (prevState) {
          this.state.value = prevState;
        }
      }
    );
  }

  /**
   * @private
   * 更新状态对象中的节点样式。
   * @param {object} state - 当前的状态对象。
   * @param {string[]} highlightedNodes - 需要高亮的节点名称数组。
   */
  _updateNodeStyles(state, highlightedNodes = []) {
    const newStyles = {};
    this.nodeNames.value.forEach(name => {
      newStyles[name] = 'init_style';
    });

    const nodeTypes = ['middle_node', 'start_node', 'target_node'];
    highlightedNodes.forEach((nodeName, i) => {
      if (Object.prototype.hasOwnProperty.call(newStyles, nodeName)) {
        newStyles[nodeName] = nodeTypes[i % nodeTypes.length];
      }
    });
    state.nodeStyles = newStyles;
  }

  init() {
    super.init();

    const nodeIds = Object.keys(this.graph.node_map);
    this.nodeNames.value = [...nodeIds];
    const n = nodeIds.length;

    // --- 设置初始状态 ---
    const initialState = deepClone(this.state.value);

    initialState.distMatrix = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    initialState.nextMatrix = Array(n).fill(null).map(() => Array(n).fill(null));

    for (let i = 0; i < n; i++) {
      initialState.distMatrix[i][i] = 0;
    }

    Object.values(this.graph.edge_map).forEach((edge) => {
      const i = nodeIds.indexOf(edge.u.name);
      const j = nodeIds.indexOf(edge.v.name);
      if (i !== -1 && j !== -1) {
        initialState.distMatrix[i][j] = edge.weight;
        initialState.nextMatrix[i][j] = j;
      }
    });
    this._updateNodeStyles(initialState, []);
    this.state.value = initialState;
    // -- 初始状态设置完毕 --

    for (let k = 0; k < n; k++) {
      this._addStateChange(state => {
        state.codeline = 2;
        state.currentK = this.nodeNames.value[k];
        this._updateNodeStyles(state, [this.nodeNames.value[k]]);
      });
      this.add_sleep_event(this.timeInterval.value);

      for (let i = 0; i < n; i++) {
        if (i === k) continue;

        this._addStateChange(state => {
          state.codeline = 3;
          state.currentI = this.nodeNames.value[i];
          this._updateNodeStyles(state, [
            this.nodeNames.value[k],
            this.nodeNames.value[i],
          ]);
        });
        this.add_sleep_event(this.timeInterval.value);

        for (let j = 0; j < n; j++) {
          if (i === j || k === j) continue;

          this._addStateChange(state => {
            state.codeline = 4;
            state.currentJ = this.nodeNames.value[j];
            this._updateNodeStyles(state, [
              this.nodeNames.value[k],
              this.nodeNames.value[i],
              this.nodeNames.value[j],
            ]);
          });
          this.add_sleep_event(this.timeInterval.value);

          const distanceSE = this.state.value.distMatrix[i][j];
          const distanceSM = this.state.value.distMatrix[i][k];
          const distanceME = this.state.value.distMatrix[k][j];
          const sum = distanceSM + distanceME;

          this._addStateChange(state => {
            state.codeline = 5;
            state.show = true;
            state.distanceSE = distanceSE;
            state.distanceSM = distanceSM;
            state.distanceME = distanceME;
            state.sum = sum;
            state.comparison = sum < distanceSE ? "less" : "greater";
            state.updated = false; // Reset update flag
          });
          this.add_sleep_event(this.timeInterval.value);

          if (sum < distanceSE) {
            this._addStateChange(state => {
              state.codeline = 6;
              state.updated = true;
            });
            this.add_sleep_event(this.timeInterval.value);

            this._addStateChange(state => {
              state.codeline = 6;
              state.distMatrix[i][j] = sum;
              state.helightDistMatrix = [[i, j]];
              state.helightNextMatrix = [];
            });
            this.add_sleep_event(this.timeInterval.value);

            this._addStateChange(state => {
              state.codeline = 7;
              state.nextMatrix[i][j] = state.nextMatrix[i][k];
              state.helightNextMatrix = [[i, j]];
            });
            this.add_sleep_event(this.timeInterval.value);
          }

          // Reset highlights and temporary info for the next j iteration
          this._addStateChange(state => {
            state.currentJ = "";
            state.show = false;
            state.updated = false;
            state.helightDistMatrix = [];
            state.helightNextMatrix = [];
            this._updateNodeStyles(state, [
              this.nodeNames.value[k],
              this.nodeNames.value[i],
            ]);
          });
        }
        // Reset for the next i iteration
        this._addStateChange(state => {
          state.currentI = "";
          this._updateNodeStyles(state, [this.nodeNames.value[k]]);
        });
      }
      // Reset for the next k iteration
      this._addStateChange(state => {
        state.currentK = "";
        this._updateNodeStyles(state, []);
      });
    }

    this.reset();

  }
  reset() {
    super.reset();
  }

  
}
