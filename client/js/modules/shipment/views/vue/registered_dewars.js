define(['vue',
    'utils/vuewrapper',
    'modules/shipment/views/vue/pagination_component',
    'text!templates/shipment/vue/table_component.html',
    'text!templates/shipment/vue/registered_dewars.html'], 
    function(Vue,
        VueWrapper,
        PaginationComponent,
        TableTemplate,
        template) {

    let TableComponent = {
        template: TableTemplate,
        props: ['headers', 'data']
    }

    return VueWrapper.extend({
        vueView: Vue.extend({
            template: template,
            components: {
                'table-component': TableComponent,
                'pagination-component': PaginationComponent,
            },

            data: function() {
                return {
                    dewars: [],
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
                    console.log("Dewar Selected " + dewar.get('FACILITYCODE') )
                },
                onAddDewar: function() {
                    console.log("Register New Dewar " )
                    app.triggerMethod('/dewar')
                },
                onPageChange: function(pageNumber) {
                    console.log("Re-order list of dewars...")
                }
            },

            created: function() {
                console.log("Vue registered dewars")
                this.dewars = this.$getOption('collection').models
                let params = this.$getOption('params')
                if (params) {
                    this.searchTerm = params['s']
                }
                console.log(JSON.stringify(this.dewars))
            },
            mounted: function() {
            }
        })
    })
})