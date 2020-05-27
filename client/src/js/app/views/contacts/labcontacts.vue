<template>
    <section id="labcontacts" class="content">
        <h1>Lab Contacts</h1>
        <div class="ra">
            <button v-on:click="onAdd" class="button"><i class="fa fa-plus"></i> Add Lab Contact</button>
        </div>

        <div class="wrapper">
            <div class="perp"></div>
            <div class="srch clearfix">
                <div class="search hide">
                    <input v-model="searchTerm" type="search" placeholder="Search" name="s"/>
                </div>
            </div>
            <table-component
                v-bind:headers="[{'title': 'Contact Name', 'key':'CARDNAME'}, 
                                {'title': 'First Name', 'key':'GIVENNAME'},
                                {'title': 'Family Name', 'key':'FAMILYNAME'},
                                {'title': 'Address', 'key':'ADDRESS'},
                                {'title': 'City', 'key':'CITY'},
                                {'title': 'Postcode', 'key':'POSTCODE'},
                                {'title': 'Country', 'key':'COUNTRY'},
                                {'title': 'Phone Number', 'key':'PHONENUMBER'},
                                {'title': 'Laboratory', 'key':'LABORATORY'},
                                ]"
                v-bind:data="labcontacts"
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

import TableComponent from '../../components/utils/table.vue'
import PaginationComponent from '../../components/utils/pagination.vue'

export default {
    name: 'labcontacts',

    components: {
        'table-component': TableComponent,
        'pagination-component': PaginationComponent,
    },

    data: function() {
        return {
            total: 0,
            labcontacts: [],
            searchTerm: ''
        }
    },

    watch: {
        searchTerm: function(newVal) {
            console.log("Search Term changed " + newVal)
        }
    },

    computed: {
        proposal: function() {
            return this.$store.getters.currentProposal
        }
    },
    created: function() {
        // Get visits for this user
        this.getLabContacts()
    },
    methods: {
        onSelected: function(item) {
            console.log("Lab Contact Selected " + item['CARDNAME'])
            // Navigate to specific view...
            this.$router.push('contacts/id/' + item['LABCONTACTID'])
        },
        onSortBy: function(item) {
            console.log("Sort By " + item)
            // Navigate to specific view...
        },
        onAdd: function() {
            this.$emit('navigate', {url: '/contacts/add'})
        },
        onPageChange: function(pageData) {
            console.log("Re-order list of contacts..." + pageData['current-page'] + ", " + pageData['page-size'])
        },

        getLabContacts: function() {
            let self = this
            let url = this.$store.getters.apiRoot + '/contact'
            let params = {prop: this.proposal}
            Backbone.ajax({
                url: url, 
                data : params,
                success: function(resp) {
                    self.total = resp.total
                    self.labcontacts = resp.data
                    console.log(self.total)
                    console.log(self.labcontacts)
                },
                error: function(err) {
                    console.log("Error getting labcontacts for proposal: " + self.proposal + ", err: " + err)
                }
            })
        }
    }
}
</script>