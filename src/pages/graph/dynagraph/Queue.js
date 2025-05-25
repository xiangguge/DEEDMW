import { shallowReactive } from "vue";

export class Queue{
  constructor(height=500){
    for(let [key,value] of Object.entries({
      width: 60,
      height: height,
      que:shallowReactive([]),
      que_map:{},
    }))this[key]=value;

    shallowReactive(this);
  }
  sync(pos){
    for(let i = pos; i < this.que.length; ++i)
      this.que_map[this.que[i].name] = this.que[i];
  }
  add(name, pos){
    if (pos < 0 || pos > this.que.length) return false;
    this.que.splice(pos, 0, shallowReactive(new Brick(name)));
    this.sync(pos);
  }
  del(pos){
    if (pos < 0 || pos >= this.que.length) return false;
    delete this.que_map[this.que[pos].name];
    this.que.splice(pos, 1);
    this.sync(pos);
  }
  push_front(name){ this.add(name, 0); }
  push_back(name){ this.add(name, this.que.length); }
  pop_front(){ this.del(0); }
  pop_back(){ this.del(this.que.length-1); }
  clear(){this.que.splice(0, this.que.length); }
}

export class Brick{
  constructor(name,x=0,y=0){
    for(let [key,value] of Object.entries({
      name:name,
      x:x,
      y:y,
      style_class:'init_style',
    }))this[key]=value;
  }
}