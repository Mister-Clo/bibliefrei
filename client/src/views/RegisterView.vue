<template>
    <div>
        <h2>S'Inscrire</h2>
        <section v-if="errored">
         <p>{{errorMessage}}</p>
        </section>
        
        <form @submit.prevent="register">
        <div class="mb-3">
        <input type="text" class="form-control" v-model="name" placeholder="Draven" required>
        </div>
        <div class="mb-3">
        <input type="text" class="form-control" v-model="email" placeholder="nom@efrei.fr" required>
        </div>
        <div class="mb-3">
        <input type="text" class="form-control" v-model="password" placeholder="mot de passe">
        </div>
        <button type="button" class="btn btn-info mx-1" @click.prevent="register()">Inscription</button>
        <span>Déjà un Compte ? </span><router-link to ="/">Connexion</router-link>
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
            name:"",
            email:"",
            password:"",
            errorMessage:"",
            errored: false
        }
    },
    methods : {
        async register(){
           try {
               var body = {}
               body.name = this.name
               body.email = this.email
               body.password = this.password

                const result = await axios.post('/api/register',body)
                alert(res)
                this.name = ""
                this.email = ""
                this.password = ""
                this.errorMessage = ""  

                if(result.message != null){
                  this.errored = true
                  this.errorMessage = result.message
               }

               router.push({ name: '/'}) 
           } catch (error) {
               console.log(error.response.data)
           }
        }
    }
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
