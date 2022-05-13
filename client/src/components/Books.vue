<template>
     <div class="container">
         <div v-for="book in books" :key="book" class="row align-items-start row-cols-3 row-cols-lg-4 g-2 g-lg-4">
             <div class="col-4">
                 <h3>{{book['titre']}}</h3>
                 <img src="{{book['image']}}" alt="">
             </div>
             <div class="col-2">
                {{book['genre']}}
             </div>
             <div class="col-2">
                 <h4>Exemplaires Disponibles</h4> 
                 <p>{{book['quantite']}}</p>
             </div>
             <div class="col-4 bt-actions">
                 <button type="button" class="btn btn-primary">Ajouter au Panier</button>
                 <button type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button>
             </div>
         </div>
     </div>
</template>

<script>
export default {
  name: "Books",
  props: {
    userRole: int,
    books: {type: Array}
  },

  methods: {
    
  }
 
};
</script>

<style scoped>
    .bt-actions{
        display: flex;
        justify-content: center;
    }

    .i{
        color: bisque;
    }
</style>