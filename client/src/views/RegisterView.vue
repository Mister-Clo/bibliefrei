<template>

  <div class="g">
    <form @submit.prevent="login()">
      <h2>Register</h2>
      <div class="unn"> <input class="un" type="text" v-model="email" placeholder="Enter your email address" required ><br></div>

      <div class="deuxw"><input class="deux" type="text" v-model="password" placeholder="Enter your password" required ><br></div>
     <div class="troiss"><input class="trois" type="text" v-model="name" placeholder="Enter yourname" required ><br></div>
      <button type="submit" class="s">Register</button>
    </form>
  </div>
</template>

<script scoped>





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
    async login() {
      var user = {}
      user.email = this.email
      user.password = this.password
      user.name=this.name


      let res= await axios(
          {
            method: 'post',
            url: 'http://localhost:3000/api/register',
            data: user
          })
      if(res.data===true){
        console.log("bravo, vous êtes inscrit")
        alert('maintenant, connectez-vous')
       await this.$router.push({name:'home'})
      }else{
        console.log("ntm")
      }












    }}
}
</script>

<style>

body{
  margin:0;
  padding:0;
}
.g{
  margin-top: 100px;
  margin:0 auto;
  width:350px;
  height:350px;
  background-color: cadetblue;
  border-radius: 7px 7px 7px;
}

.deux,.trois{
  margin-top: 20px;
}

.un,.deux,.trois {

  border-bottom: 2px solid black;
  border-right: none;
  border-left: none;
  border-top: none;
}


.Ge{
  margin-left: 100px;
  border: 1px solid black;
  background-color: cadetblue;
  width: 300px;
}
.ABB,.Oe,.sal{border: 1px solid black;
  background-color: cadetblue;
  width : 300px
}

.Oe,.Ge,.sal{
  margin-left: 50px;
}

.great{
  display: flex;
  justify-content: center;
}

.s{
  width: 120px;
  height: 30px;
  background-color:lemonchiffon;
  border : none;
  box-shadow: 2px 2px #555555;
  border-radius: 7px 7px 7px;
  font-family: Verdana;
  margin-top: 20px;
}
.change:hover,.groupeA:hover, .groupeB:hover,.addC:hover{
  background-color: brown;
}

.note,.Name,.groupe{

  width: 100px;
}
li{
  list-style-type:none;
}

.groupeB,.groupeA{
  margin-top: 50px;
}
html,body { padding: 0 !important;}
</style>