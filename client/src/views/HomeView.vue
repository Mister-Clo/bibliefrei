<template>
    <div>
      <h2>Se Connecter</h2>
        <section v-if="errored">
          <p>{{errorMessage}}</p>
        </section>
         <form @submit.prevent="login">
          <div class="mb-3">
          <input type="text" class="form-control" v-model="email" placeholder="nom@efrei.fr" required>
          </div>
          <div class="mb-3">
          <input type="text" class="form-control" v-model="password" placeholder="mot de passe">
          </div>
          <button type="button" class="btn btn-info mx-1" @click.prevent="login()">Connexion</button>
          <span>Pas de Compte ? </span><router-link to ="/registration">Inscription</router-link> 
         </form>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'HomeView',
    data : function(){
        return{
            //les valeurs par défaut de mes v-model
            email:"",
            password:"",
            errorMessage:"",
            userInfo: null,
            errored: false
        }
    },
    methods : {
         async login(){
           try {
             // let data = JSON.stringify({email : this.email, password : this.password})
             var body = {}
             body.email = this.email
             body.password = this.password
             var results = await axios.post('/api/login', body)
             this.userInfo = results.data
             this.email = ""
             this.password = ""
             this.errorMessage = ""

             if(this.userInfo.message != null){
               this.errored = true
               this.errorMessage = this.userInfo.message
             }

             //Window.sessionStorage to store data on client side session
             sessionStorage.setItem('user', JSON.stringify(this.userInfo.info))
             sessionStorage.setItem('authToken',this.userInfo.accessToken)
            
            try {
              //On récupère les livres
             const repbooks = await axios.get('/api/books', body, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             
              const books = repbooks.data
              sessionStorage.setItem('books',JSON.stringify(books))
            } catch (error) {
              console.log(error.response.data)
            }

            try {
             
             const pan = await axios.get('/api/panier', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             
             //Window.sessionStorage to store data on client side session
             sessionStorage.setItem('panier',JSON.stringify(pan.data))
            }
            catch (error) {
              console.log(error.response.data)
            }
             
             console.log(JSON.parse(sessionStorage.getItem('user')))
             console.log(JSON.parse(sessionStorage.getItem('panier')))


             this.$router.push({ name: 'library'}) 
           } catch (error) {
             console.log(error.response.data)
           }
           
        }
    },

}
</script>

<style scoped>
  h2{
    text-align: center;
  }
  form{
    width:40%;
    margin:auto;
  }
  div#coche{
    text-align: left;
  }
  label{
    display: inline-block;
    margin-left: 2%;
  }
</style>
