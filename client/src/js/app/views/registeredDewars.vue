<template>
<section id="vue-template" class="content">
    <h1>Registered Dewars</h1>

    <div class="ra">
        <button v-on:click="onAddDewar" class="button"><i class="fa fa-plus"></i> Register Dewar</button>
    </div>

    <div class="wrapper">
        <div class="perp"></div>
        <div class="srch clearfix">
            <div class="search hide">
                <input v-model="searchTerm" type="search" placeholder="Search" name="s"/>
            </div>
        </div>
        <table-component
            v-bind:headers="[{'title': 'Dewar Code', 'key':'FACILITYCODE'}, 
                            {'title': 'Lab Contact', 'key':'CARDNAME'}, 
                            {'title': 'Name', 'key': 'GIVENNAME'},
                            {'title': 'Surname', 'key': 'FAMILYNAME'},
                            {'title': 'Lab Name', 'key': 'LABNAME'},
                            {'title': 'Address', 'key': 'ADDRESS'},
                            {'title': '# Uses', 'key': 'DEWARS'},
                            ]"
            v-bind:data="dewars"
            v-on:row-clicked="onDewarSelected">
        </table-component>

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
            dewars: [],
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
        onDewarSelected: function(dewar) {
            console.log("Dewar Selected " + dewar['FACILITYCODE'] )
        },
        onAddDewar: function() {
            console.log("Register New Dewar " )
        },
        onPageChange: function(pageNumber) {
            console.log("Re-order list of dewars...")
        },
        getDewars: function() {
            let self = this
            let url = this.$store.getters.apiRoot + '/shipment/dewars/registry'
            let params = {prop: this.proposal}
            Backbone.ajax({
                url: url, 
                data : params,
                success: function(resp) {
                    self.total = resp.total
                    self.dewars = resp.data
                    console.log(self.total)
                    console.log(self.dewars)
                },
                error: function(err) {
                    console.log("Error getting registered dewars for proposal: " + self.proposal + ", err: " + err)
                }
            })
        }

    },

    created: function() {
        this.getDewars()
    },
}
</script>