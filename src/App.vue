<template>
  <div id="app">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
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
      pages:[
        {path:'/', label: '列表'}
      ]
    }
  },
  methods: {
    goPage(item){
      this.$router.push(item.path)
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
.el-container{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.el-header{
  background: hsl(20, 10%, 10%);
  color: #fff;
  line-height: 50px;
}
.el-aside{
  background: hsl(210, 10%, 20%);
  color: #fff;
}
</style>
