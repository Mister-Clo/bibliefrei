<template>
  <div class="iconese">

  </div>
  <div class="iconess">
    <div class="comp">
      <div class="book">
        <img  src="book-removebg-preview.png"      width="100px" height="100px" alt="image non trouvée">
      </div>

      <div class="ch"><img src="img-removebg-preview.png" width="35px" height="35px"></div>

      <div class="chearch">
        <input type="text" placeholder="Enter a book title, autor name or edition..." class="cl">
      </div>
      <div class="btn1"><button type="submit" class="btn">Rechearch</button></div>
    </div>


  </div>
  <nav>
    <div class="icones">
      <div class="uno">
        <router-link class="xx" to="/"><img class="k" src="home_icon-icons.com_73532-removebg-preview%20(1).png"></router-link>
      </div>

      <div class="deuxo">
        <router-link  class="xx" to="/about"><img src="bookstack_libr_3024-removebg-preview.png" class="kkk"></router-link>
      </div>
      <div class="troiso">
        <router-link  class="xx" to="/test"><img src="cart_icon_160294-removebg-preview.png" class="kk"></router-link>
      </div>

    </div>


    <router-view></router-view>
  </nav>

</template>


<style>


.xx{
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.un,.deux,.trois{

}

.icones{
  background-color: cadetblue;
  height: 50px;
  width:100%;
  marker-start: none;
  display: flex;
justify-content: center;
  margin-bottom: 35px;
 
}

.iconese{
  background-color: cadetblue;
  height: 50px;
  width:100%;
  marker-start: none;
  display: flex;
  justify-content: center;
}

.iconess{
  background-color: lemonchiffon;
  height: 100px;
  width:100%;
  marker-start: none;
  display: flex;
  justify-content: center;


}

.uno, .deuxo,.troiso{
  background-color: cadetblue;
  width:200px;
  height:50px;
  border-right: 2px solid black;

  margin-left: 0;
  text-align: center;
  font-size: 20px;
padding:10px;
}
.uno:hover,.deuxo:hover,.troiso:hover{
  background-color: lemonchiffon;
}

.uno{
  border-left: 2px solid black;
}
/* default css start */
body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.g{

}
.cl{
  width: 350px;
  height:35px;

  margin-top: 32.5px;
border-left: none;
  border-right: none;
  border-top: none;
  border-bottom: 2px solid #0000FF;
}

.chearch{
  vertical-align: center;

 height: 100%;




}


.comp{

  display:flex;
  text-align: center;
  margin-left: 10px;
  margin-right: 250px;
}

.ch{
  background-color: white;
  width: 35px;
  height:35px;
  margin-top: 32.5px;
  margin-bottom:32.5px ;
  margin-left: 150px;
  border-bottom: solid #0000FF;
}

.btn{
  width: 100px;
  height:35px;
  background-color: #0000FF;
}

.btn1{
  margin-top: 32.5px;
  margin-bottom: 32.5px;
}

.btn:hover{
  background-color: lemonchiffon;
}

.k,.kk,.kkk{
  width:35px;
  height:35px;
}

</style>
