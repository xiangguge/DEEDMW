// DEEDMW/src/pages/graph/dynagraph/FloydAnimator.js
import { computed, watch, toRefs, ref } from "vue";
import { Animator } from "./Animator.js";
import {NodeStyleManager} from '../../../utils/NodeStyleManager'

export class FloydAnimator extends Animator {
  constructor(graph) {
    // console.log("构造动画器");
    super();
    this.graph = graph;
    this.distMatrix = ref([]);
    this.nextMatrix = ref([]);
    this.currentI = ref([]);
    this.currentJ = ref([]);
    this.currentK = ref([]);
    this.codeline = ref(-1);
    this.helightDistMatrix = ref([]);
    this.helightNextMatrix = ref([]);
    this.sum = ref(-1);
    this.distanceSM = ref(Infinity);
    this.distanceME = ref(Infinity);
    this.distanceSE = ref(Infinity);
    this.comparison = ref(null);
    this.updated = ref(false);
    this.initTimeInterval = ref(500);
    this.timeInterval = ref(200);
    this.nodeNames = ref([]);
  }

  init() {
    super.init();

    const nodes = this.nodes;

    // 获取所有节点ID
    const nodeIds = Object.keys(this.graph.node_map);
    this.nodeNames.value = [...nodeIds];
    const n = nodeIds.length;

    // 初始化距离矩阵
    this.distMatrix.value = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));

    // 初始化路径矩阵
    this.nextMatrix.value = Array(n)
      .fill()
      .map(() => Array(n).fill(null));

    // 设置对角线为0
    for (let i = 0; i < n; i++) {
      this.distMatrix.value[i][i] = 0;
    }

    const manager = new NodeStyleManager();

    // 填充边权重
    Object.values(this.graph.edge_map).forEach((edge) => {
      const i = nodeIds.indexOf(edge.u.name);
      const j = nodeIds.indexOf(edge.v.name);

      if (i !== -1 && j !== -1) {
        this.distMatrix.value[i][j] = edge.weight;
        //   console.log("变得权重为:",edge.weight)
        this.nextMatrix.value[i][j] = j;
        //   console.log("下一个节点为:", j);
      }
    });

    for (let k = 0; k < n; k++) {
      
      // console.log(
      //   `当前动画在k层循环，k为${k}`
      // );
      this.add_function_event(
        () => {
          this.codeline.value = 3;
          this.currentK.value = this.nodeNames.value[k];
          this.setNodesStylesByArray([this.nodeNames.value[k]]);
          // this.graph.node_map[this.currentK.value].style_class =
          //   manager.getNodeStyle(this.nodeNames.value[k]);
          // console.log(this);
        }
        // () => {
        //   this.currentK.value = "";
        //   this.codeline.value = 3;
        //   manager.setNodeType(this.nodeNames.value[k], "start");
        //     const nodeName = this.nodeNames.value[k];
        //     this.graph.node_map[nodeName].style_class = manager.getNodeStyle(
        //       this.nodeNames.value[k]
        //     );

        // }
      );
      this.add_sleep_event(this.timeInterval.value);
      for (let i = 0; i < n; i++) {
        if (i == k) {
          console.log("触发跳过")
          continue;
        }
        // console.log(
        //   `当前动画在i层循环，i为${i}`
        // );
        this.add_function_event(
          () => {
            this.currentI.value = this.nodeNames.value[i];
            this.codeline.value = 4;
            this.setNodesStylesByArray([
              this.nodeNames.value[k],
              this.nodeNames.value[i],
            ]);
            // this.graph.node_map[this.currentI.value].style_class =
            //   manager.getNodeStyle(this.nodeNames.value[i]);
            // console.log(this);
          },
          () => {
            this.codeline.value = 3;
            this.currentK.value = this.nodeNames.value[k];
            manager.setNodeType(this.nodeNames.value[k], "middle");
            this.graph.node_map[this.currentK.value].style_class =
              manager.getNodeStyle(this.nodeNames.value[k]);
            // console.log(this);
          }
        );
        this.add_sleep_event(this.timeInterval.value);
        for (let j = 0; j < n; j++) {
          if (i == j || k == j) {
            console.log("触发跳过");
            continue;
          }
          // console.log(
          //   `当前动画在j层循环，j为${j}`
          // );
          this.add_function_event(
            () => {
              this.currentJ.value = this.nodeNames.value[j];
              this.codeline.value = 5;
              this.setNodesStylesByArray([
                this.nodeNames.value[k],
                this.nodeNames.value[i],
                this.nodeNames.value[j],
              ]);
              // this.graph.node_map[this.currentJ.value].style_class =
              //   manager.getNodeStyle(this.nodeNames.value[j]);
              // console.log(this);
            },
            () => {
              this.currentI.value = this.nodeNames.value[i];
              this.codeline.value = 4;
              manager.setNodeType(this.nodeNames.value[i], "start");
              this.graph.node_map[this.currentI.value].style_class =
                manager.getNodeStyle(this.nodeNames.value[i]);
              // console.log(this);
            }
          );
          this.add_sleep_event(this.timeInterval.value);

          // 检查负权环 (对角线上的负值)
          if (i === j && this.distMatrix.value[i][j] < 0) {
            this.negativeCycleDetected = true;

            console.warn("检测到负权环!", {
              i,
              j,
              value: this.distMatrix.value[i][j],
            });
            return;
          }
          this.add_function_event(
            () => {
              this.codeline.value = 7;
            },
            () => {
              this.currentJ.value = this.nodeNames.value[j];
              this.codeline.value = 5;
              manager.setNodeType(this.nodeNames.value[j], "target");
              this.graph.node_map[this.currentJ.value].style_class =
                manager.getNodeStyle(this.nodeNames.value[j]);
            }
          );
          this.add_sleep_event(this.timeInterval.value);
          let distanceSM = this.distMatrix.value[i][k];
          let distanceME = this.distMatrix.value[k][j];
          let distanceSE = this.distMatrix.value[i][j];
          // 计算 sum = D[i][k] + D[k][j]
          this.sum.value = distanceSM + distanceME;

          this.add_function_event(
            () => {
              this.codeline.value = 12;
              this.distanceSM.value = distanceSM;
              this.distanceME.value = distanceME;
              this.distanceSE.value = distanceSE;
            },
            () => {
              this.codeline.value = 7;
            }
          );
          this.add_sleep_event(this.timeInterval.value);
          console.log("计算结果为：" + this.sum.value);

          // 记录比较结果
          this.comparison.value =
            this.sum.value < this.distMatrix.value[i][j] ? "less" : "greater";
          // console.log("比较结果为：" + this.comparison.value);

          if (this.sum.value < this.distMatrix.value[i][j]) {
            this.add_function_event(
              () => {
                this.updated.value = true;
                this.codeline.value = 13;
              },
              () => {
                this.codeline.value = 12;
                this.distanceSM.value = distanceSM;
                this.distanceME.value = distanceME;
                this.distanceSE.value = distanceSE;
              }
            );
            this.add_sleep_event(this.timeInterval.value);
            this.add_function_event(
              () => {
                this.codeline.value = 14;
              },
              () => {
                this.codeline.value = 13;
              }
            );
            this.add_sleep_event(this.timeInterval.value);
            let oldDist = this.distMatrix.value[i][j];
            let oldNext = this.nextMatrix.value[i][j];
            let sum = this.sum.value;
            let path = this.nextMatrix.value[i][k];
            this.updated.value = true;
            // console.log(
            //   `更新矩阵，旧的距离矩阵为${oldDist}，旧的路径矩阵为${oldNext}，新的距离矩阵为${this.distMatrix.value}，新的路径矩阵为${this.nextMatrix.value}`
            // );
            // 添加更新动画
            this.add_function_event(
              () => {
                this.codeline.value = 15;

                // 确保存储原始数字索引
                this.helightDistMatrix.value.push([Number(i), Number(j)]);
                this.helightNextMatrix.value.push([Number(i), Number(k)]);
                this.helightNextMatrix.value.push([Number(i), Number(j)]);
                console.log("距离矩阵校验：", this.helightNextMatrix.value);

                // 假设 distMatrix 和 nextMatrix 存储原始值
                this.distMatrix.value[i][j] = Number(sum); // 转为数字
                this.nextMatrix.value[i][j] = String(path); // 转为字符串
              },
              () => {
                this.codeline.value = 14;

                // 使用 splice 清空高亮数组
                this.helightDistMatrix.value.splice(
                  this.helightDistMatrix.value.length - 1,
                  1
                );
                this.helightNextMatrix.value.splice(
                  this.helightNextMatrix.value.length - 1,
                  1
                );

                // 恢复原始值
                this.distMatrix.value[i][j] = Number(oldDist);
                this.nextMatrix.value[i][j] = String(oldNext);
              }
            );
            this.add_sleep_event(this.timeInterval.value);
          }
        }
      }
    }

    this.reset();
  }
  // 新增方法：根据数组设置节点样式
  setNodesStylesByArray(nodeArray) {
    
    // 将所有节点样式重置为默认样式
    Object.keys(this.graph.node_map).forEach((name) => {
      this.graph.node_map[name].style_class = 'init_style';
    });
    console.log(nodeArray)

    const nodeTypes = ['middle_node', 'start_node', 'target_node'];
    for (let i = 0; i < nodeArray.length; i++) {
      const nodeName = nodeArray[i];
      const nodeType = nodeTypes[i % nodeTypes.length];
      this.graph.node_map[nodeName].style_class = nodeType;
    }
  }
}
