# deedmw

- page 文件夹下放置的是不同组件的显示内容，与路由配合在不同组件进行切换。
  - 比如 home 是主页，graph是图论部分的组件

- router 文件夹用于配置路由

- stores 文件夹用于保存导航栏信息

  - 每个组件都需要写上
    ```javascript
    import { useTitleStore } from '@/stores/title'
    const titleStore = useTitleStore()
    titleStore.setTitle('/* title here */')
    ```
