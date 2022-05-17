<template>
     <div class="container">
         <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
            <div v-for="item in items" :key="item" class="card p-0 col m-3" style="width: 18rem;">
                 <img :src="item.image" width="100%" class="card-img-top" alt="Un livre">
                <div class="card-body">
                    <h5 class="card-title">{{item['titre']}}</h5>
                    <p class="card-text">{{item['genre']}}</p>
                    <p> Examplaires : {{item['quantite']}}</p>
                    <button type="button" class="btn btn-primary" @click.prevent="addIt(item['id_livre'])">Ajouter au Panier</button>
                    <input id="addQty" type="number" min="1" max="10" placeholder="qty" class="form-control ms-2" v-model="quantite" required/>
                   <button v-if="userRole==0" type="button" class="btn btn-danger m-2" @click.prevent="emit(deleteBook,item['id_livre'])"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
        </div>
     </div>
</template>

<script>
export default {
  name: 'BibItem',
  props: {
    userRole: Number,
    items: {type: Array}
  },
  
  data(){
      return{
          quantite:1,
          search: ""
      }
  },
  methods: {
    addIt(id){
        const livre = {
            idLivre : id,
            quantite : this.quantite
        }

        this.$emit('addItem',livre)

        this.quantite = 1
    }
  }
 
};
</script>

<style scoped>
    .card-img-top{
        width: 100% !important;
    }
    .row{
        flex-wrap: wrap;
    }
    .bt-actions{
        display: flex;
        justify-content: space-between;
    }
    #addQty{
        display: inline-block;
        width: 5em;
    }

    .i{
        color: bisque;
    }
</style>