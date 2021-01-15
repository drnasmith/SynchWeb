<template>
  <section class="content">
    <h1>Sample Groups</h1>
    <table-component
      :headers="headers"
      :data="samplegroups.data"
      @row-clicked="onRowSelected"
    >
    </table-component>
    <pagination-component></pagination-component>
  </section>
</template>

<script>
import Pagination from 'app/components/pagination.vue'
import Table from 'app/components/table.vue'

import SampleGroups from 'collections/samplegroups'

export default {
  name: "sample-groups",
  components: {
    'pagination-component' : Pagination,
    'table-component' : Table
  },
  data: function() {
    return {
      samplegroups: {
        data: []
      },
      headers: [
        {key: 'NAME', title: 'Group Name'},
        {key: 'BLSAMPLEGROUPID', title: 'Sample Group Id'},
        {key: 'COUNT', title: 'Num samples in group'},
      ]
    }
  },

  created: function() {
      this.groups = new SampleGroups()
  },

  mounted: function() {
    this.fetchSampleGroups(this.groups).then( (collection) => {
      this.$set(this.samplegroups, 'data', collection.groups().toJSON())
      console.log("SampleGroups found: " + JSON.stringify(this.samplegroups))
    })
  },

  methods: {
    // Wrapped getting the collection as a promise...
    fetchSampleGroups: function(collection, queryParams) {
      return new Promise((resolve, reject) => {
        // If we have no collection return immediately
        if (!collection) { resolve() ; return }

        this.$store.commit('loading', true)
        // We want to access 'this' from within the backbone callback
        let self = this
        // We can set queryParams at an options level, or within the collection constructor
        // This handles the former case - may not be needed in future...
        collection.queryParms = queryParams ? queryParams : null

        collection.fetch({
            // Success returns collection object
            success: function(c) {
                self.$store.commit('loading', false)
                resolve(c)
            },
            error: function() {
                self.$store.commit('loading', false)
                app.alert({ title: 'No such collection', message: 'The specified collection could not be found'})
                reject()
            }
        })
      })
    },
    onRowSelected: function(item) {
      console.log("Row Selected " + JSON.stringify(item))
    }

  }

}
</script>