import { Component } from '@angular/core';
// const todos = [
//       {
//         id: 0,
//         title: '吃饭',
//         done: true
//       },
//       {
//         id: 1,
//         title: '写代码',
//         done: false
//       },
//       {
//         id: 2,
//         title: '租房子',
//         done: false
//       }
//     ];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // todos: {
  //   id: number,
  //   title: string,
  //   done: boolean
  // }[] = [
  //     {
  //       id: 0,
  //       title: '吃饭',
  //       done: true
  //     },
  //     {
  //       id: 1,
  //       title: '写代码',
  //       done: false
  //     },
  //     {
  //       id: 2,
  //       title: '租房子',
  //       done: false
  //     }
  //   ];
  /* 实现数据本地持久化 */
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]');
  //
  currentEditing: {
    id: number,
    title: string,
    done: boolean
  }[] = null;
  public todoStatus: string = 'all';
  // 当要设置为get 属性时可以先不写
  /*  filterTodos: {
     id: number,
     title: string,
     done: boolean
   }[]; */
  ngOnInit(): any {
    console.log(this.todos);
    
    // 用箭头函数不改变this指向
    // window.onhashchange = () => {
    //   console.log(this.todoStatus); // #/active
    //   const hash = window.location.hash.substr(1); // 从下标为1开始向后截取
    //   console.log(hash);
    //   switch (hash) {
    //     case '/':
    //       this.todoStatus = 'all';
    //       break;
    //     case '/active':
    //       this.todoStatus = 'active';
    //       break;
    //     case '/completed':
    //       this.todoStatus = 'completed';
    //       break;
    //   }
    // }
    /* 此时有个问题，刷新页面不会保持数据
    当点击active后刷新页面，会还原到all的数据列表 */
    this.windowChangeHandler();
    // 加bind是为了改变this指向，否则this会指向window会报错
    window.onhashchange =  this.windowChangeHandler.bind(this);
  }
  addTodo(e): void {
    // 为了打印键值码   回车键对应13
    // console.log(e.keyCode);
    const todoTitle = e.target.value;
    // console.log(todoTitle);
    // 获取到数组的最后一个元素，拿到对应的id
    const index = this.todos[this.todos.length - 1];
    this.todos.push({
      // 注意：此处要判断数据为空的时候
      id: index ? index.id + 1 : 1,
      title: todoTitle,
      done: false
    });
    // 清楚文本框中的内容
    e.target.value = '';
  }
  // 用属性的get set 取值器/赋值器来操作
  // get 访问器必须返回值
  get toggleAll() {
    // 遍历每一个都为真 返回true 否则返回false
    // return this.todos.every(t => t.done === true);
    return this.todos.every(t => t.done);
  }
  // set不用返回值 它不是方法，（当做方法用，传一个参数）
  set toggleAll(val) {
    this.todos.forEach(item => item.done = val);
  }
  deleteTodo(index) {
    console.log(index);
    this.todos.splice(index, 1);
  }
  get unfinishedTodo() {
    return this.todos.filter(t => !t.done).length;
  }

  // 清除所有已完成的
  clearAllDone() {
    // 将未完成的过滤出来，赋值给this.todos数组
    this.todos = this.todos.filter(t => !t.done);

  }
  windowChangeHandler() {
    const hash = window.location.hash.substr(1); // 从下标为1开始向后截取
    // console.log(hash);
    switch (hash) {
      case '/':
        this.todoStatus = 'all';
        break;
      case '/active':
        this.todoStatus = 'active';
        break;
      case '/completed':
        this.todoStatus = 'completed';
        break;
    }
  }
  /* 数据持久化到本地 */
  // 当angular组件数据被改变时，这个钩子函数就会被触发
  ngDoCheck() {
    // console.log('变化');
    window.localStorage.setItem('todos', JSON.stringify(this.todos));

  }

  /*
    实现导航切换数据功能的思路
    1.设置一个属性，用来存放过滤后的数据的数组
    filterTodos
    2.设置一个属性，接收当前当行对应的状态
    todoStatus
    all active completed
    3.为链接添加点击事件
  */
  //  对一个属性使用它的get访问器，就不用先定义
  get filterTodos() {
    if (this.todoStatus === 'all') {
      return this.todos;
    } else if (this.todoStatus === 'active') {
      return this.todos.filter(t => !t.done);
    } else if (this.todoStatus === 'completed') {
      return this.todos.filter(t => t.done);
    }

  }
}
// window.onhashchange = function () {
//   // 这里拿不到this.todoStatus
//   // 解决：在钩子函数中 onInit(){}
//   console.log(this.todoStatus);
// }
