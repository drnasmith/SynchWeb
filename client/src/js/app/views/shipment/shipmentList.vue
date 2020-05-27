<template>
    <div id="shipments" class="content">
        <h1>Shipment List</h1>
        <p>There are {{total}} shipments for {{proposal}}</p>
        <button 
            class="button submit"
            v-on:click="onAddShipment"><i class="fa fa-plus icon"></i> Create New Shipment</button>

        <div class="tw-flex">
            <div 
                v-for="(shipment, index) in shipments" v-bind:key='index'
                @click="onSelected(shipment)"
                >
                <ShippingCard v-bind:shipment="shipment" message='Hello from shipments'></ShippingCard>
            </div>
        </div>

        <div v-if="shipments" class="wrapper">
            <div class="perp"></div>
            <div class="srch clearfix">
                <div class="search hide">
                    <input v-model="searchTerm" type="search" placeholder="Search" name="s"/>
                </div>
            </div>
            <table-component
                v-bind:headers="[{'title': 'Name', 'key':'SHIPPINGNAME'},
                                {'title': 'Creation Date', 'key':'CREATED'},
                                {'title': 'Outgoing Contact', 'key':'LCOUT'},
                                {'title': 'Return Contact', 'key':'LCRET'},
                                {'title': 'Status', 'key':'SHIPPINGSTATUS'},
                                {'title': '# Comp', 'key':'DCOUNT'},
                                {'title': 'Comments', 'key':'COMMENTS'},
                                ]"
                v-bind:data="shipments"
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


    </div>
</template>

<script>
import Shipments from 'collections/shipments.js'
import ShippingCard from './shipmentcard.vue'

import TableComponent from '../../components/utils/table.vue'
import PaginationComponent from '../../components/utils/pagination.vue'

export default {
    name: 'shipments',
    components: {
        ShippingCard,
        'table-component': TableComponent,
        'pagination-component': PaginationComponent,
    },
    data: function() {
        return {
            total: 0,
            shipments: [],
            shipmentCollection: null,
            searchTerm: ''
        }
    },
    computed: {
        proposal: function() {
            return this.$store.getters.currentProposal
        }
    },
    created: function() {
        // Get visits for this proposal
        this.shipmentCollection = new Shipments()
        this.getShipments()
    },

    methods: {

        getShipments: function() {
            let self = this
            this.shipmentCollection.fetch({
                success: function(collection,response,options) {
                    self.shipments = collection.toJSON()
                    self.total = collection.totalRecords
                }
            })
        },
        onAddShipment: function() {
            console.log("Create Shipment")
            // Can use a named route...
            this.$emit('navigate', {name: 'addShipment'})
        },

        onSelected: function(shipment) {
            console.log("View Shipment shipment " + shipment.SHIPPINGID)
            //...or a url
            this.$emit('navigate', {url: '/shipments/id/'+shipment.SHIPPINGID})
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

<style scoped>

</style>
