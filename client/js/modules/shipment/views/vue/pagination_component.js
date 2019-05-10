define(['vue',
    'text!templates/shipment/vue/pagination_component.html'],
    function(Vue,
        template) {

    return Vue.extend({
        template: template,
        props: {
            initialPage: {
                type: Number,
                default: 0
            },
            totalRecords: {
                type: Number,
                default: 0
            }
        },

        data: function() {
            return {
                currentPage: 1,
                perPage: 15,
                pageSizes: ['15', '25', '50', '100', '500'],
            }
        },
        computed: {
            // Calculate total number of pages
            maxPages: function() {
                return Math.ceil(this.totalRecords / this.perPage)
            }
        },
        methods: {
            onFirst: function() {
                this.currentPage = 1
                this.sendPageChangeEvent()
            },
            onPrev: function() {
                this.currentPage = this.currentPage > 1 ? this.currentPage -1 : 1
                this.sendPageChangeEvent()
            },
            onNext: function() {
                this.currentPage = this.currentPage < this.maxPages ? this.currentPage + 1 : this.maxPages
                this.sendPageChangeEvent()
            },
            onLast: function() {
                this.currentPage = this.maxPages
                this.sendPageChangeEvent()
            },
            onPageSizeChange: function(event) {
                console.log("Page Size changed..." + this.perPage + " event " + event.target.value)
                this.sendPageChangeEvent()
            },
            sendPageChangeEvent: function() {
                payload = {
                    'current-page': this.currentPage,
                    'page-size': this.perPage
                }
                this.$emit('page-changed', payload)
            }
        },

        created: function() {
            console.log("Created pagination component")
            if (this.initialPage < 1) {
                this.currentPage = 1
            } else if (this.initialPage > this.maxPages) {
                this.currentPage = this.maxPages
            }
        },
    })
})