const markServices = {
    serviceCheck(){
      console.log("GET ITS ME")
    },  
    getAllBookmarks(knex) {
      return knex
        .select('*')
        .from('bookmarks');
    },
    getById(knex, id) {
      return knex
       .from('bookmarks')
       .select('*')
       .where('id', id)
       .first();
    },
    deleteItem(knex, id) {
      return knex('bookmarks')
        .where({ id })
        .delete();
    },
    updateBookmark(knex, id, newItemFields) {
      return knex('bookmarks')
        .where({ id })
        .update(newItemFields);
    },
    insertBookmark(knex, newItem) {
      return knex
        .insert(newItem)
        .into('bookmarks')
        .returning('*')
        .then(rows => rows[0]);
    },
  };
  
  
    module.exports = markServices;