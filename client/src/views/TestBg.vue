<template>


  <article>
    <div class="alignee">
       <div class="article-img">
    <div :style="{ backgroundImage: 'url(' + post.imge + ')' }"></div></div>
      <div class="idd"><h3>{{post.id}}</h3></div> <div class="genre"><h3>{{post.genre}}</h3> </div>  -  <div class="desce"><h3>{{post.desce}}</h3>

  </div>
    </div>


  </article>


</template>

<script>

import AboutView from "@/views/AboutView";

export default {

  props:["post"],

components:{
  // eslint-disable-next-line vue/no-unused-components
    AboutView
}


}

</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.alignee{
  display:flex;
  text-align: center;

  background-color: lemonchiffon;
  margin: 0 auto;
  border:1px solid #0000FF;

}

.idd,.genre,.desce{
border-left: 2px solid #0000FF;
  width: 200px;
  height:180px
}
</style>