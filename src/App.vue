<template>
<div id="app">
    <Puzzle /> 
</div>
</template>

<script>

import Puzzle from './page/Puzzle'


export default {
    name: 'app',
    components: {
       Puzzle
    },
    methods:{

    }
}
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0
}

a {
    text-decoration: none
}

#app {
    height: 100vh;
    width: 100vw;


}
</style>
