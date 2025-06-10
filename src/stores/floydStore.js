// DEEDMW/src/stores/floydStore.js
import { defineStore } from "pinia";

export const useFloydStore = defineStore("floyd", {
  state: () => ({
    distanceMatrix: [],
    nextMatrix: [],
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    timeInterval: 500,
  }),
  actions: {
    initMatrices(graph) {
      const nodes = Object.keys(graph.node_map);
      const n = nodes.length;
      this.distanceMatrix = Array.from({ length: n }, () =>
        Array(n).fill(Infinity)
      );
      this.nextMatrix = Array.from({ length: n }, () => Array(n).fill(null));

      for (let i = 0; i < n; i++) {
        this.distanceMatrix[i][i] = 0;
        this.nextMatrix[i][i] = nodes[i];
      }

      for (const [ename, edge] of Object.entries(graph.edge_map)) {
        const [u, v] = ename.split(" ");
        const uIndex = nodes.indexOf(u);
        const vIndex = nodes.indexOf(v);
        this.distanceMatrix[uIndex][vIndex] = edge.weight;
        this.distanceMatrix[vIndex][uIndex] = edge.weight;
        this.nextMatrix[uIndex][vIndex] = v;
        this.nextMatrix[vIndex][uIndex] = u;
      }

      this.totalSteps = n * n * n;
    },
    updateStep(step) {
      this.currentStep = step;
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying;
    },
    setTimeInterval(interval) {
      this.timeInterval = interval;
    },
  },
});
