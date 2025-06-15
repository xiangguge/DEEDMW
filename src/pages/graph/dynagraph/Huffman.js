
import {Animator} from './Animator.js'
import {Graph} from './Graph.js'

export class HuffmanGraph extends Graph{
  constructor(width, height){
    super(width, height);
    this.gap_x = 30;
    this.gap_y = 40;
    this.array_snap_shot = [];

    this.nmp = [];
    this.base_y = this.config.height*0.2;
  }
  clear(){
    this.str_to_graph('');
    this.array_snap_shot = [];
    this.nmp = [];
  }
  init(str){
    let ban_char = {' ':true,'\t':true,'\n':true}
    let char_map = {}, pq = [];
    for(let c of str){
      if (ban_char[c]) continue;
      if (char_map[c]) char_map[c] += 1;
      else char_map[c] = 1;
    }
    for(let [c,w] of Object.entries(char_map)){
      this.nmp.push({
        id:this.nmp.length,
        name:c,
        weight:w,
        leaf_count:1,
        left_son:undefined,
        right_son:undefined,
      });
      pq.push(this.nmp.length-1);
    }
    this.array_snap_shot.push(pq.map((x)=>x));
    let g = this;
    while(pq.length > 1){
      pq.sort((a,b)=>(g.nmp[a].weight-g.nmp[b].weight));
      this.array_snap_shot.push(pq.map((x)=>x));
      let u = pq[0], v = pq[1];
      pq.shift(); pq.shift();
      this.nmp.push({
        id:this.nmp.length,
        name:'',
        weight:this.nmp[u].weight+this.nmp[v].weight,
        leaf_count:this.nmp[u].leaf_count+this.nmp[v].leaf_count,
        left_son:this.nmp[u],
        right_son:this.nmp[v],
        init_x:0
      });

      pq.unshift(this.nmp.length-1);
      this.array_snap_shot.push(pq.map((x)=>x));
    }

    let center = {x:this.config.width*0.5, y:this.config.height*0.5}
    let sum_leaf_count = this.nmp.length, base_x;
    let real_gap_x = (2*this.config.node_radius+this.gap_x);
    base_x = center.x - 0.25*(sum_leaf_count-1)*real_gap_x;

    let root = this.nmp[this.nmp.length-1];

    function get_init_x(u, dep=0){
      let x = 0;
      if (!u.left_son) x = base_x;
      else x = (get_init_x(u.left_son, dep+1) + u.left_son.leaf_count*real_gap_x + get_init_x(u.right_son, dep+1))*0.5;
      u.init_x = x;
      return x;
    }; get_init_x(root);
    
    function dfs(u){
      let pos = [u.init_x, g.base_y]
      g.add_node(String(u.id), pos);
      u.o = g.node_map[String(u.id)];
      u.o.show = false;
      u.o.is_leaf = true;
      u.o.weight = u.weight;
      if (u.left_son){
        u.o.is_leaf = false;
        dfs(u.left_son);
        let ename = `${u.left_son.id} ${u.id}`
        g.add_edge(ename);
        u.left_edge = g.edge_map[ename];
        u.left_edge.show = false;
        
      }
      if (u.right_son){
        u.o.is_leaf = false;
        dfs(u.right_son);
        let ename = `${u.right_son.id} ${u.id}`
        g.add_edge(ename);
        u.right_edge = g.edge_map[ename];
        u.right_edge.show = false;
      }
      if(u.o.is_leaf){
        u.o.name = u.name;
      }
    }; dfs(root);
    this.sync(0);
  }
  sync(version_number=0){
    let arr = this.array_snap_shot[version_number];
    let center = {x:this.config.width*0.5, y:this.config.height*0.5}
    let sum_leaf_count = this.nmp.length, base_x;
    let real_gap_x = (2*this.config.node_radius+this.gap_x);
    base_x = center.x - 0.25*(sum_leaf_count-1)*real_gap_x;
    let g = this;
    function dfs(u, dep=0, binary_encoding=''){
      u.o.show = true;
      if (u.o.is_leaf){
        u.o.x = base_x; base_x += real_gap_x;
        u.o.binary_encoding = binary_encoding;
      }
      else{
        dfs(u.left_son, dep+1, binary_encoding+'0');
        dfs(u.right_son, dep+1, binary_encoding+'1');
        u.o.x = (u.left_son.o.x+u.right_son.o.x)*0.5;
      }
      u.o.y = g.base_y+dep*g.gap_y+2*dep*g.config.node_radius;
    }
    for(let u of arr) dfs(this.nmp[u]);
  }
}

export class HuffmanAnimator extends Animator{
  constructor(graph, is_move){
    super();
    this.graph = graph;
    this.time_interval = 1000;
    this.is_move = is_move;
  }
  init(){
    super.init();
    this.is_move.value = false;
    let g = this.graph;
    this.add_function_event(
      ()=>{
        for(let edge of Object.values(g.edge_map)) edge.show = false;
        for(let node of Object.values(g.node_map)) node.show = node.is_leaf;
        for(let n of Object.values(g.nmp))
          if (!n.o.is_leaf) n.o.x = n.init_x, n.o.y = g.base_y;
        g.sync(0);
      }
    )
    console.log(this.time_interval);
    for(let i = 1; i < g.array_snap_shot.length; ++i){
      this.add_sleep_event(this.time_interval);
      let i_ = i;
      if (i%2 == 1){
        this.add_function_event(
          ()=>{
            g.sync(i_);
          },
          ()=>{
            g.sync(i_-1);
          }
        )
      }
      else{
        let u = g.array_snap_shot[i_][0]
        this.add_function_event(
          ()=>{
            g.nmp[u].o.show = true;
            g.nmp[u].left_edge.show = true;
            g.nmp[u].right_edge.show = true;
            g.sync(i_);
          },
          ()=>{
            g.nmp[u].o.show = false;
            g.nmp[u].left_edge.show = false;
            g.nmp[u].right_edge.show = false;
            g.sync(i_-1);
          }
        )
      }
    }

    this.reset();
  }
}