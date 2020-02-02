import { Component } from '@angular/core';
const todos =[
  {
    id:1,
    title:'写代码',
    done:true
  },
  {
    id:2,
    title:'看电视',
    done:true
  },
  {
    id:3,
    title:'吃饭',
    done:false
  }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public todos :{
    id:number,
    title:string,
    done:boolean
  }[] =JSON.parse(window.localStorage.getItem('todos') || '[]') ;

  public currentEditing:{
    id:number,
    title:string,
    done:boolean
  }= null;

  //路由状态切换
  // 实现导航切换数据过滤功能
  //1.提供一个属性，这个属性会根据当前点击的链接返回过滤的数据
  //filterTodos
  //2.提供一个属性，用来存储当前点击的链接标识
  //visibility  是一个字符串
  //[all active completed]
  //3.为链接添加点击事件，当点击导航链接的时候，改变

  ngOnInit(){
    //刷新保持过滤状态
    this.hashchangeHandler();
    window.onhashchange = this.hashchangeHandler.bind(this);
    //这里要bind（this）绑定，否则的话this的指向是window
  }


  //当angular组件数据发生变化的时候，ngDoCheck钩子函数会触发
  //这个钩子函数中去持久化存储我们的todos数据

  ngDoCheck(){
    console.log('ngDoCheck');
    window.localStorage.setItem('todos',JSON.stringify(this.todos))
  }

  public visibility:string = 'all';  

  get filterTodos(){
    if(this.visibility==='all'){
      return this.todos;
    }else if(this.visibility ==='active'){
      return this.todos.filter(t=>!t.done)
    }else if(this.visibility ==='completed'){
      return this.todos.filter(t=>t.done)
    }
  }

  addTodo(e){
    // console.log(e.keyCode);   //打印出点击按钮的编码 
    // console.log('回车事件以调用');
    // console.log(e.target.value)  //获取输入框内输入的内容

    const titleText = e.target.value;
    if(!titleText.length){
      return
    }

    const last = this.todos[this.todos.length-1];
    this.todos.push({
      id: last ? last.id+1:1,
      title:titleText,
      done:false
    });
    e.target.value='';

    console.log(this.todos);
  }


//全部选中 和 全部取消选中
  get toggleAll(){
    return this.todos.every(t => t.done)
  }
  set toggleAll(val){
    this.todos.forEach(t => t.done = val);
  }

//删除任务项
  removeTodo(index:number){
    console.log(index);
    this.todos.splice(index,1);
  }

//双击进入编辑模式
saveEidt(todo,e){
  //保存编辑
  todo.title = e.target.value;
  // console.log('保存编辑内容')
  //去除编辑模式
  this.currentEditing =null;
}
//输入状态下按esc取消编辑
handleEditkeyUp(e){
  const {keyCode,target} = e;
  console.log(keyCode);
  if( keyCode===27){
    //取消编辑样式
    //同时把文本框的内容恢复为原来的值
    target.value = this.currentEditing.title;
    this.currentEditing =null;

  }
}

//显示所有未完成任务数 
get remaningCount(){
  return this.todos.filter(t => !t.done ).length;
} 

//清楚所有已完成的内容
ClearAllDone(){
  this.todos = this.todos.filter(t=> !t.done)
}

//刷新保持过滤状态
hashchangeHandler(){
  const hash = window.location.hash.substr(1);
      console.log(hash);
      switch(hash){
        case'/':
          this.visibility = 'all'
          break;
        case'/active':
          this.visibility = 'active'
          break;
        case'/completed':
          this.visibility = 'completed'
          break;
      }
}

}