<template>
  <div>
    <h1 class="fw-bold">BIBIOTHÈQUE EFREI</h1>
    <div class="container text-center mt-5 mb-5">
      <Books @addItem="addCart" @deleteBook="deleteBook" :userRole="userInfo.info.role" :items="books"/>
    </div>

    <CreateBook v-if="userInfo.info.role == 0" @addBook="createBook"/>
  </div>
</template>

<script>
 
import Books from '@/components/Books.vue'
import CreateBook from '@/components/CreateBook.vue'

export default {
  name: 'LibraryView',
  components : {
    Books,
    CreateBook
  },

  data(){
      return{
        userInfo : null,
        books : null

      }
  },

  methods: {

        async addCart(book){
          alert('captured addItem Cart')

          try {
              await axios.post('/api/panier', book, 
             {headers: {Authorization: 'Bearer ' + this.userInfo.accessToken}})

             alert('Ajouté avec succès')

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
          
        }
  },

  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.books = JSON.parse(sessionStorage.getItem('books'))
  },

  computed: {
      
  },
    
    
  }

</script>

<style scoped>
 
</style>
