<template>
  <table id="tableComponent" class="table table-bordered table-striped table-hover">
    <thead>
      <tr><!--un for loop sur les champs des entêtes-->
        <th v-for="field in Object.keys(books[0])" :key='field'>
          {{field}}
        </th>
      </tr>
    </thead>
    <tbody>
      <!--un for loop sur chaque item-->
      <tr v-for="book in books" :key="book">
        <td v-for="field in Object.keys(books[0])" :key='field' >

          <span>{{book[field]}}</span>

        </td>      
      </tr>
    </tbody>
  
  </table>
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
</style>