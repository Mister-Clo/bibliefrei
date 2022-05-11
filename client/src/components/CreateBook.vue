<template>
    <div>
        <form name="myform" action="#" class="box" id="new-command">
      <fieldset>
        <legend>Ajoutez un livre</legend>
        <input type="text" class="form-control" v-model="titre" placeholder="Titre" required/><br>
        <input type="text" class="form-control" v-model="genre" placeholder="Programmation, BDD..." required/><br>
        <input type="number" min="1" class="form-control" v-model="quantite" required/><br>
        <button type="button" @click.prevent="check()" class="btn btn-dark" id="ajout" >Ajouter</button>
        
      </fieldset>
    </form>
    </div>
</template>

<script>
export default {
    name: 'CreateBook',
    data : function(){
        return{
            //les valeurs par défaut de mes v-model
            titre:"",
            genre:"",
            quantite:1
        }
    },
    methods : {
        check(){
           const livre = {
             titre : this.titre,
             genre : this.genre,
             quantite : this.quantite
           }
           
           this.$emit('addBook',livre)

           this.titre = ""
           this.genre = ""
           this.quantite = 1
        }
    }
}
</script>

<style scoped>
  form{
    width:45%;
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