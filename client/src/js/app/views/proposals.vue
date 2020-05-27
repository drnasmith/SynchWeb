<template>
    <div id="proposals" class="content">
        <h1>Proposals View</h1>
        <div class="wrapper">
            <div class="perp"></div>
            <table-component
                v-bind:headers="[{'title': 'Proposal Code', 'key':'PROPOSALCODE'}, 
                                {'title': 'Number', 'key':'PROPOSALNUMBER'},
                                {'title': 'Visits', 'key':'VCOUNT'},
                                {'title': 'Title', 'key':'TITLE'},
                                ]"
                v-bind:data="proposals"
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
    name: 'Proposals',
    components: {
        'table-component': TableComponent,
        'pagination-component': PaginationComponent,
    },
    data: function() {
        return {
            total: 0,
            proposals: []
        }
    },
    created: function() {
        // Get visits for this user
        this.getProposals()
    },

    methods: {
        onSelected: function(proposal) {
            let prop = proposal.PROPOSALCODE+proposal.PROPOSALNUMBER
            this.$store.dispatch('set_proposal', prop)
            this.$router.push('/visits')
        },
        onPageChange: function(pageNumber) {
            console.log("Re-order list of records...")
        },
        getProposals: function() {
            let self = this
            let url = this.$store.getters.apiRoot + '/proposal'
            Backbone.ajax({
                url: url,
                success: function(resp) {
                    console.log(JSON.stringify(resp))
                    self.total = resp.total
                    self.proposals = resp.data
                    console.log(self.total)
                    console.log(self.proposals)
                },
                error: function(err) {
                    console.log("Error getting proposals" + err)
                }
            })
        }
    }
}
</script>