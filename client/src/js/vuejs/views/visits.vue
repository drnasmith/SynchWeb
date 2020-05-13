<template>
    <div id="visits" class="content">
        <h1>Visits View</h1>
        <div class="wrapper">
            <div class="perp"></div>
            <table-component
                v-bind:headers="[
                    {'title': 'Start', 'key':'STARTDATE'}, 
                    {'title': 'End', 'key':'ENDDATE'}, 
                    {'title': 'Visit Number', 'key':'VIS'}, 
                    {'title': 'Session Type', 'key':'SESSIONTYPE'}, 
                    {'title': 'Beamline', 'key':'BEAMLINENAME'},
                    {'title': '# Data Collections', 'key':'DCCOUNT'}
                ]"
                v-bind:data="visits"
                v-on:row-clicked="onSelected">
            </table-component>

            <!-- If using a backbone collection use the totalRecords field -->
            <pagination-component 
                :initialPage="0"
                :totalRecords="total"
                v-on:page-changed="onPageChange">
            </pagination-component>

        </div>
    </div>
</template>

<script>
import Backbone from 'backbone'

import TableComponent from '../components/utils/table.vue'
import PaginationComponent from '../components/utils/pagination.vue'

export default {
    name: 'Visits',

    components: {
        'table-component': TableComponent,
        'pagination-component': PaginationComponent,
    },

    data: function() {
        return {
            total: 0,
            visits: []
        }
    },

    created: function() {
        let self = this
        // Get visits for this user
        let url = this.$store.getters.apiRoot + '/proposal/visits'
        Backbone.ajax({
            url: url,
            data: {'per_page': 15, 'page': 1, 'prop': this.$store.getters.currentProposal},
            success: function(resp) {
                console.log(JSON.stringify(resp.data))
                self.total = resp.total
                self.visits = resp.data
                console.log(self.total)
                console.log(self.visits)
            },
            error: function(err) {
              console.log("Error getting visits" + err)
            }
        })
    },
    methods: {

        onSelected: function(item) {
            console.log("Visit Selected " + item['TITLE`'])
            // Navigate to specific view...
            this.$router.push('/visits/' + item['SESSIONID'])
        },
        onSortBy: function(item) {
            console.log("Sort By " + item)
            // Navigate to specific view...
        },
        onPageChange: function(pageData) {
            console.log("Re-order list of contacts..." + pageData['current-page'] + ", " + pageData['page-size'])
        },
    }
}
</script>