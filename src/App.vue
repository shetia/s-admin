<template>
  <div id="app">
    <el-container>
      <el-header>
        <i :class="htmlClass" @click="changeTheme"></i>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
                default-active="2"
                background-color="#aaccc9"
                class="el-menu-vertical-demo"
                active-text-color="#ffd04b">
                <el-menu-item v-for="(item, index) in pages" :key="index" :index="item.path" @click="goPage(item)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{item.label}}</span>
                </el-menu-item>
              </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default{
  data () {
    return {
      htmlClass:'el-icon-moon', // el-icon-sunny
      pages:[
        {path:'/', label: '列表'},
        {path:'/cardList', label: '卡片列表'},
        {path:'/bigFile', label: '大文件上传'},
      ]
    }
  },
  methods: {
    goPage(item){
      if(location.pathname == item.path) return
      this.$router.push(item.path)
    },
    // 切换 深色/浅色模式
    changeTheme () {
      let html = document.querySelector('html')
      let attr = html.getAttribute('theme')
      if(attr !== 'dark-mode'){
        html.setAttribute('theme', 'dark-mode')
        this.htmlClass = 'el-icon-sunny'
      } else {
        this.htmlClass = 'el-icon-moon'
        html.setAttribute('theme', 'light-mode')
      }
    }
  }
}
</script>
<style lang="scss">
html,body,#app{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
// 设置黑暗主题
html {
    transition: all 0.5s;
}
html[theme='dark-mode'] {
    filter: invert(1) hue-rotate(180deg);
}
// 取消图片的反转
html[theme='dark-mode'] img ,
html[theme='dark-mode'] video{
    filter: invert(1) hue-rotate(180deg);
}
.el-container{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.el-header{
  background: #45c0ba;
  color: #fff;
  line-height: 50px;
}
.el-aside{
  background: #aaccc9;
  color: #fff;
}
.el-main{
  background: #fff;
  height: 100%;
  overflow: hidden;
}
i{
  cursor: pointer;
}
</style>
