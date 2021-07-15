<template>
    <div id="app">
        <div id="cover"></div>
        <Header></Header>  
        <Todo></Todo>    
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx';
import Todo from './todo/todo.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        Header,
        Footer,
        Todo
    }
}
</script>

// lang="stylus" 指定用 stylus-loader css预处理器去解析
// scoped仅在#app组件内生效
<style lang="stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #999;
  opacity: 0.5;
  z-index: -1;
}
</style>