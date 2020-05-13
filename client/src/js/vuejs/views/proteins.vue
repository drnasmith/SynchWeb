<template>
<section id="vue-template" class="content">
    <h1>Proteins</h1>

    <div class="ra">
        <button v-on:click="onAdd" class="button"><i class="fa fa-plus"></i> Add Protein</button>
    </div>

    <div class="wrapper">
        <div class="perp"></div>
        <div class="srch clearfix">
            <div class="search hide">
                <input v-model="searchTerm" type="search" placeholder="Search" name="s"/>
            </div>
        </div>
        <table-component
            v-bind:headers="[{'title': 'Protein Name', 'key':'NAME'}, 
                            {'title': 'Acronym', 'key':'ACRONYM'},
                            {'title': 'Mass', 'key':'MOLECULARMASS'},
                            {'title': 'Sequence', 'key':'SEQUENCE'},
                            {'title': 'PDBs', 'key':'PDBS'},
                            {'title': 'Type', 'key':'TYPE'},
                            {'title': 'Unit', 'key':'UNIT'},
                            {'title': 'Samples', 'key':'SCOUNT'},
                            {'title': 'Data Collections', 'key':'DCOUNT'},
                            {'title': 'Validated', 'key':'EXTERNAL'},
                            ]"
            v-bind:data="proteins"
            v-on:sort-by="onSortBy"
            v-on:row-clicked="onSelected">
        </table-component>

        <!-- If using a backbone collection use the totalRecords field -->
        <pagination-component 
            :initialPage="0"
            :totalRecords="total"
            v-on:page-changed="onPageChange">
        </pagination-component>

    </div>
</section> 
</template>

<script>
import Backbone from 'backbone'

import TableComponent from '../components/utils/table.vue'
import PaginationComponent from '../components/utils/pagination.vue'

export default {
    components: {
        'table-component': TableComponent,
        'pagination-component': PaginationComponent,
    },

    data: function() {
        return {
            proteins: [],
            total: 0,
            searchTerm: '',
        }
    },
    watch: {
        searchTerm: function(newVal) {
            console.log("Search Term changed " + newVal)
        }
    },

    methods: {
        onSelected: function(item) {
            console.log("Protein Selected " + item['ACRONYM'])
            // Navigate to specific protein view...
        },
        onSortBy: function(item) {
            console.log("Protein Sort By " + item)
            // Navigate to specific protein view...
        },
        onAdd: function() {
            console.log("Add Protein " )
        },
        onPageChange: function(pageData) {
            console.log("Re-order list of proteins..." + pageData['current-page'] + ", " + pageData['page-size'])
        },
        getProteins: function() {
            let self = this
            let url = this.$store.getters.apiRoot + '/sample/proteins'
            let params = {prop: this.proposal}
            Backbone.ajax({
                url: url, 
                data : params,
                success: function(resp) {
                    self.total = resp.total
                    self.proteins = resp.data
                    console.log(self.total)
                    console.log(self.proteins)
                },
                error: function(err) {
                    console.log("Error getting proteins for proposal: " + self.proposal + ", err: " + err)
                }
            })
        }

    },

    created: function() {
        this.getProteins()
    },
}
</script>