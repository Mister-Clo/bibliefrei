<template>
  <div class="home">

  <form @submit.prevent="log">
    <div class="g">
      <h2>Login :</h2><br>
      <input class="un" type="text" placeholder="enter your email address" v-model="email"><br>
      <input class="deux" type="text" placeholder="enter your password" v-model="password"><br>
      <button class="s" type="submit">Connection</button><br>
      <p>Not yet registered ?</p> <router-link class="xx" to="/register">Register</router-link>
    </div>



  </form>


  </div>
</template>

<script>





const axios=require('axios')

module.exports = {

  data() {
    return {
      //les valeurs par défaut de mes v-model
      email: "",
      password: "",
      error: "",
      name:"",

    }
  },
  async mounted() {
  },

  methods: {
    async log() {
      var user = {}
      user.email = this.email
      user.password = this.password



      let res= await axios(
          {
            method: 'post',
            url: 'http://localhost:3000/api/login',
            data: user
          })
      if(res.data.data==="true"){
        console.log("bravo, vous êtes inscrit pd")
        await this.$router.push({name:'about'})
      }if(res.data.data==="false"){
        console.log("tu pue")
      }












    }}
}

</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.un:hover{
  background-color: cadetblue;
}

.deux:hover{
  background-color: cadetblue;
}

.s:hover{
  background-color: cadetblue;
}
</style>