export  class NodeStyleManager {
  constructor() {
    // 存储三种特殊节点的名称
    this.specialNodes = {
      start: null, // 起始节点
      middle: null, // 中间节点
      target: null, // 目标节点
    };

    // 存储所有节点的当前样式
    this.nodeStyles = new Map();

    // 定义样式映射关系
    this.styleMap = {
      start: "start_node",
      middle: "middle_node",
      target: "target_node",
      default: "init_style",
    };
  }

  // 设置节点为特定类型
  setNodeType(nodeName, nodeType) {
    // 检查节点类型是否有效
    if (!["start", "middle", "target"].includes(nodeType)) {
      throw new Error(`Invalid node type: ${nodeType}`);
    }

    // 如果该类型已有节点，将其重置为默认样式
    const existingNode = this.specialNodes[nodeType];
    if (existingNode && existingNode !== nodeName) {
      this.nodeStyles.set(existingNode, this.styleMap.default);
    }

    // 设置新节点类型
    this.specialNodes[nodeType] = nodeName;
    this.nodeStyles.set(nodeName, this.styleMap[nodeType]);

    // 确保其他类型中没有该节点
    Object.keys(this.specialNodes).forEach((type) => {
      if (type !== nodeType && this.specialNodes[type] === nodeName) {
        this.specialNodes[type] = null;
      }
    });
  }

  // 获取节点样式
  getNodeStyle(nodeName) {
    // 检查是否为特殊节点
    for (const [type, name] of Object.entries(this.specialNodes)) {
      if (name === nodeName) {
        return this.styleMap[type];
      }
    }

    // 检查是否有自定义样式
    if (this.nodeStyles.has(nodeName)) {
      return this.nodeStyles.get(nodeName);
    }

    // 默认样式
    return this.styleMap.default;
  }

  // 获取所有节点的样式映射
  getAllNodeStyles() {
    const styles = new Map();

    // 先添加特殊节点
    Object.values(this.specialNodes).forEach((nodeName) => {
      if (nodeName) {
        styles.set(nodeName, this.getNodeStyle(nodeName));
      }
    });

    // 再添加其他自定义样式节点
    for (const [nodeName, style] of this.nodeStyles.entries()) {
      if (!Object.values(this.specialNodes).includes(nodeName)) {
        styles.set(nodeName, style);
      }
    }

    return styles;
  }

  // 重置节点样式
  resetNode(nodeName) {
    // 从特殊节点中移除
    Object.keys(this.specialNodes).forEach((type) => {
      if (this.specialNodes[type] === nodeName) {
        this.specialNodes[type] = null;
      }
    });

    // 设置为默认样式
    this.nodeStyles.set(nodeName, this.styleMap.default);
  }

  // 重置所有节点
  resetAllNodes() {
    this.specialNodes = {
      start: null,
      middle: null,
      target: null,
    };

    // 保留节点名称，但重置样式
    for (const nodeName of this.nodeStyles.keys()) {
      this.nodeStyles.set(nodeName, this.styleMap.default);
    }
  }
}


