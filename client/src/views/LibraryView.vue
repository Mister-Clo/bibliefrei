<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png">
    <h1 class="fw-bold">BIBIOTHÈQUE EFREI</h1>
    <div class="container text-center mt-5 mb-5">
      <Books :fields="fields" :items="items"/>
    </div>
    <CreateBook @addTask="createTask"/>
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
        
      }
  },

  methods: {
        createTask : function(task){
            this.items.push(task)
        }
  },

  computed: {
    completedTasks(){
      var numCompleted = 0
        this.items.forEach(element => {
          if (element['Etat']){
            numCompleted++
          }
        });
        return numCompleted
    },
    incompleteTasks(){
      var numIncomplete = 0
        this.items.forEach(element => {
          if (!element['Etat']){
            numIncomplete++
          }
        });
      return numIncomplete
    },
      
  },
    
    
  }

</script>

<style scoped>
 
</style>
