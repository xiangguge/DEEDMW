import {ref} from 'vue'

class EventBlock{
  constructor(ff=()=>{}, bf=()=>{}, st=0){
    this.forward_function_list = [ff];
    this.backward_function_list = [bf];
    this.sleep_time = st;
  }
  add_forward_function(ff){this.forward_function_list.push(ff);}
  add_backward_function(bf){this.backward_function_list.unshift(bf);}
  run_forward_function(){for(let f of this.forward_function_list) f();}
  run_backward_function(){for(let f of this.backward_function_list) f();}
}

export class Animator{
  constructor(){
    this.event_list = [];
    this.current_state = 0;
    this.is_playing = ref(false);
    this.play_timer = null;
  }
  init(){
    delete this.event_list;
    this.event_list = [];
    this.event_list.push(new EventBlock());
  }
  step_forward(){
    this.pause();
    if (this.current_state < this.event_list.length-1){
      this.current_state += 1;
      this.event_list[this.current_state].run_forward_function();
      return true;
    }
    else return false;
  }
  step_backward(){
    this.pause();
    if (this.current_state > 0){
      this.event_list[this.current_state].run_backward_function();
      this.current_state -= 1;
      return true;
    }
    else return false;
  }
  reset(){
    this.pause();
    this.current_state = -1;
    this.step_forward();
  }
  play(){
    if (this.play_timer) clearTimeout(this.play_timer);
    let ani = this; 
    let f = ()=>{
      if (ani.current_state < ani.event_list.length-1){
        this.is_playing.value = true;
        ani.play_timer = setTimeout(()=>{
            ani.current_state += 1;
            ani.event_list[ani.current_state].run_forward_function();
            f();
          },
          ani.event_list[ani.current_state].sleep_time
        );
      }
      else{
        this.is_playing.value = false;
      }
    };
    f();
  }
  pause(){
    if (this.play_timer) clearTimeout(this.play_timer);
    this.play_timer = null;
    this.is_playing.value = false;
  }
  switch_play_and_pause(){
    if (this.is_playing.value) this.pause();
    else this.play();
  }
  add_function_event(forward_function, backward_function=undefined){
    let block = this.event_list[this.event_list.length-1];
    block.add_forward_function(forward_function);
    if (backward_function) block.add_backward_function(backward_function);
  }
  add_attr_event(forward_pair, backward_pair=undefined){
    let block = this.event_list[this.event_list.length-1];
    block.add_forward_function(()=>{
      forward_pair[0][forward_pair[1]] = forward_pair[2];
    });
    if(backward_pair) block.add_backward_function(()=>{
      backward_pair[0][backward_pair[1]] = backward_pair[2];
    });
  }
  add_sleep_event(sleep_time){
    this.event_list[this.event_list.length-1].sleep_time = sleep_time;
    this.event_list.push(new EventBlock());
  }
}

export class DfsAnimator extends Animator{
  constructor(graph, que){
    super();
    this.graph = graph;
    this.que = que;
    this.start_node_name = undefined;

    this.init_time_interval = 500;
    this.time_interval = 500;
  }
  init(start_node_name){
    super.init();
    if (!start_node_name || !this.graph.node_map[start_node_name]) 
      start_node_name = Object.keys(this.graph.node_map)[0];
    let ani = this, g = this.graph;
    this.add_function_event(()=>{
      for(let node of Object.values(g.node_map)) node.style_class = 'init_style';
      for(let edge of Object.values(g.edge_map)){
        edge.positive_arrow = false;
        edge.negative_arrow = false;
        edge.style_class = 'init_style';
      }
      ani.que.clear();
    });
    this.add_sleep_event(this.init_time_interval);

    let vis = {}, visited_edge = {};
    let dfs = function(un, dep=0){
      vis[un] = true;
      let u = g.node_map[un], adj = g.adj_table[un];

      ani.add_function_event(()=>{
        u.style_class = 'current_style';
        ani.que.push_back(un);
        ani.que.que_map[un].style_class = 'current_style';
      },()=>{
        ani.que.pop_back();
        u.style_class = 'init_style';
      });
      ani.add_sleep_event(ani.time_interval);
      for(let ei of Object.values(adj)){
        if (!vis[ei.to]){
          let arrow = ei.direction ? 'negative_arrow' : 'positive_arrow';
          visited_edge[ei.o.name] = 2;
          ani.add_function_event(()=>{
            u.style_class = 'link_style';
            ei.o.style_class = 'link_style';
            ei.o[arrow] = true;
            ani.que.que_map[un].style_class = 'link_style';
          },()=>{
            ani.que.que_map[un].style_class = 'current_style';
            ei.o[arrow] = false;
            ei.o.style_class = 'init_style';
            u.style_class = 'current_style';
          });
          dfs(ei.to, dep+1);

          ani.add_function_event(()=>{
            ei.o.style_class = "visited_style";
            u.style_class = "current_style";
            ani.que.que_map[un].style_class = 'current_style';
          },()=>{
            ani.que.que_map[un].style_class = 'link_style';
            u.style_class = 'link_style';
            ei.o.style_class = 'link_style';
          });
          ani.add_sleep_event(ani.time_interval);
        }
      }
      ani.add_function_event(()=>{
        ani.que.pop_back();
        u.style_class = 'visited_style';
      },()=>{
        u.style_class = 'current_style';
        ani.que.push_back(un);
        ani.que.que_map[un].style_class = 'current_style';
      });
    }
    dfs(start_node_name);
    this.reset();

  }
}

export class BfsAnimator extends Animator{
  constructor(graph, que){
    super();
    this.graph = graph;
    this.que = que;
    this.start_node_name = undefined;

    this.init_time_interval = 500;
    this.time_interval = 500;
  }
  init(start_node_name=null){
    super.init();
    if (!start_node_name || !this.graph.node_map[start_node_name]) 
      start_node_name = Object.keys(this.graph.node_map)[0];
    let ani = this, g = this.graph;
    this.add_function_event(()=>{
      for(let node of Object.values(g.node_map)) node.style_class = 'init_style';
      for(let edge of Object.values(g.edge_map)){
        edge.positive_arrow = false;
        edge.negative_arrow = false;
        edge.style_class = 'init_style';
      }
      ani.que.clear();
    });
    this.add_sleep_event(this.init_time_interval);

    let vis = {}, visited_edge = {};
    let bfs = function(start_node_name){
      let fro = 0, que = [];
      que.push([start_node_name, null]); vis[start_node_name] = true;
      while(fro < que.length){
        let un = que[fro][0];
        let u = g.node_map[un], adj = g.adj_table[un];
        if (que[fro][1]){
          let e = que[fro][1];
          ani.add_function_event(()=>{
            e.style_class = 'visited_style';
            u.style_class="current_style";
            ani.que.que_map[un].style_class = 'current_style';
          },()=>{
            ani.que.que_map[un].style_class = 'link_style';
            u.style_class="link_style";
            e.style_class = 'link_style';
          });
        }
        else{
          ani.add_function_event(()=>{
            ani.que.push_back(un);
            ani.que.que_map[un].style_class = 'current_style';
            u.style_class="current_style";
          },()=>{
            u.style_class="init_style";
            ani.que.pop_back(un);
          });
        }
        ++fro;
        ani.add_sleep_event(ani.time_intervel);
        for(let ei of Object.values(adj)){
          if (!vis[ei.to]){
            let arrow = ei.direction ? 'negative_arrow' : 'positive_arrow';
            visited_edge[ei.o.name] = 2;
            ani.add_function_event(()=>{
              ani.que.push_back(ei.to);
              ani.que.que_map[ei.to].style_class = 'link_style';
              ei.o.style_class="link_style";
              ei.o[arrow] = true;
              g.node_map[ei.to].style_class="link_style";
            },()=>{
              g.node_map[ei.to].style_class="init_style";
              ei.o[arrow] = false;
              ei.o.style_class="init_style";
              ani.que.pop_back();
            });
            ani.add_sleep_event(ani.time_interval);
            if (!vis[ei.to]) que.push([ei.to, ei.o]), vis[ei.to] = true;
          }
        }
        ani.add_function_event(()=>{
          ani.que.que_map[un].style_class = 'visited_style';
          u.style_class = 'visited_style';
        },()=>{
          u.style_class = 'current_style';
          ani.que.que_map[un].style_class = 'current_style';
        });
      }
    }
    bfs(start_node_name);
    this.reset();
  }
}