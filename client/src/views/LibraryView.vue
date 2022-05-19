<template>
  <div>
    <router-link to="/panier">Panier</router-link> 
    <div class="container text-center mt-5 mb-5">
      <h2 class="mb-2" v-if="userInfo.role == 0"> Connecté en tant que ADMIN</h2>
      <div class="row justify-content-center">
        <div id="searchBar" class="col-3 col-md-3 col-lg-3 align-self-end input-group my-2">
          <input @input="searchBook" type="text" size="15" placeholder="Rechercher un livre" class="form-control" v-model="search" required/>
          <span class="input-group-text" ><i class="bi bi-search"></i></span>
        </div>
      </div>
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
        items : JSON.parse(sessionStorage.getItem('books')),
        search : "",
        originalItems : JSON.parse(sessionStorage.getItem('books'))

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

             const repbooks = await axios.get('/api/books', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             
              const books = repbooks.data
              this.originalItems = books
              this.items = this.originalItems
              sessionStorage.setItem('books',JSON.stringify(books))

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
          const repbooks = await axios.get('/api/books', 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})
             
              const books = repbooks.data
              this.originalItems = books
              this.items = this.originalItems
              sessionStorage.setItem('books',JSON.stringify(books))
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
        },

        searchBook(){
          if(this.search==""){
            this.items = this.originalItems
          }
          else{
            const pattern = new RegExp(this.search,"i")
            this.items = this.originalItems.filter(item => !item.titre.search(pattern) )
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
 #searchBar{
   width: 15rem;
 }
</style>
