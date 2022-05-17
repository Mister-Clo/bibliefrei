<template>
  <div>
    <router-link to="/panier">Panier</router-link> 
    <div class="container text-center mt-5 mb-5">
      <h2 class="mb-2" v-if="userInfo.role == 0"> Connecté en tant que ADMIN</h2>
      <Biblio @addItem="addCart" @deleteBook="deleteBook" :userRole="userInfo.role" :items="items"/>
    </div>
    <CreateBook v-if="userInfo.role == 0" @addBook="createBook"/>
  </div>
</template>

<script>
 
import Biblio from '@/components/Books.vue'
import CreateBook from '@/components/CreateBook.vue'
import axios from 'axios'


export default {
  name: 'LibraryView',
  components : {
    Biblio,
    CreateBook
  },

  data(){
      return{
        userInfo : JSON.parse(sessionStorage.getItem('user')),
        items : JSON.parse(sessionStorage.getItem('books'))

      }
  },

  methods: {

        async addCart(livre){
          alert('captured addItem Cart')

          try {
              await axios.post('/api/panier', livre, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})

             alert('Ajouté avec succès')
             this.getPanier

          } catch (error) {
            console.log(error.response.data)
            
          }
        },

        async createBook(livre){
          alert('captured createBook')
          try {
             await axios.post('/api/books', livre, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})

             alert("créé avec succès")
          } catch (error) {
            console.log(error.response.data)
          }
         

        },

        async deleteBook(id){
          alert('captured delete')

          try {
            await axios.delete('/api/books', { idLivre : id }, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})

          alert('Supprimé avec Succès')
          } catch (error) {
            console.log(error.response.data)
          }
          
        },

        getPanier(){
            try {
             const pan = axios.get('/api/panier', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             //Window.sessionStorage to store data on client side session
             sessionStorage.setItem('panier', JSON.stringify(pan.data))
          } catch (error) {
            console.log(error.response.data)
          }
        }

  },

  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.items = JSON.parse(sessionStorage.getItem('books'))
  },

  computed: {
      
  },
    
    
  }

</script>

<style scoped>
 
</style>
