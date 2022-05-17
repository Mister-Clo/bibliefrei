<template>
  <div>
    <h1>BIBLIOTHEQUE EFREI</h1>
    <nav>
      <!--<router-link to="#">Home</router-link> |
      <router-link to="//registration">Inscription</router-link>-->
      <router-view></router-view>
    </nav>
  </div>
  
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bungee+Inline&display=swap');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  padding: 5%;
}

h1,h2{
  font-family: 'Bungee Inline', cursive;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
