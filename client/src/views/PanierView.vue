<template>
  <div>
    <router-link to="/library">Bibliothèque</router-link> 
    <div class="container text-center mt-5 mb-5">
      <h2 class="mb-2">Bonjour, {{userInfo.name}} Votre Panier</h2>
      <div class="container">
         
         <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
            <div v-for="item in panier" :key="item" class="card p-0 col m-3" style="width: 18rem;">
                 <img :src="item.image" width="100%" class="card-img-top" alt="Un livre">
                <div class="card-body">
                    <h5 class="card-title">{{item['titre']}}</h5>
                    <p class="card-text">{{item['genre']}}</p>
                    <p> Quantité : {{item['quantity']}}</p>
                    <div class="col-5 bt-actions">
                 <button type="button" class="btn btn-danger m-2" @click.prevent="deleteItem(parseInt(item['id_livre']))"><i class="bi bi-trash-fill"></i></button>
             </div>
                </div>
            </div>
        </div>
          <p v-if="panier.length==0"> Votre Panier est vide. <router-link to="/library">Ajouter un livre</router-link></p>
         <button type="button" class="btn btn-primary" @click.prevent="validateCart">Valider</button>

     </div>
    </div>
  </div>
</template>

<script>
 
import axios from 'axios'


export default {
  data(){
      return{
        userInfo : JSON.parse(sessionStorage.getItem('user')),
        panier : JSON.parse(sessionStorage.getItem('panier'))

      }
  },

  methods: {

        async validateCart(){
            try {
            await axios.delete('/api/validate', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
            
          alert('Validée avec Succès avec Succès')
          this.getPanier()
          this.$router.push({ name: 'library'}) 
          } catch (error) {
            console.log(error.response.data)
          }
        },
        
        async deleteItem(id){
            try {
              alert(id)
            await axios.delete('/api/panier', { "idLivre" : id }, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})

          alert('Supprimé avec Succès')
          this.getPanier()
          } catch (error) {
            console.log(error.response.data)
          }
        },

        async getPanier(){
            try {
             const pan = await axios.get('/api/panier', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             //Window.sessionStorage to store data on client side session
             sessionStorage.setItem('panier', JSON.stringify(pan.data))
             this.panier = pan.data
          } catch (error) {
            console.log(error.response.data)
          }
        }
  },

  mounted() {
    //this.getPanier()
    
  },
    
    
  }

</script>

<style scoped>
 .row{
        flex-wrap: wrap;
    }


    .i{
        color: bisque;
    }
</style>
