define(['vue',
    'utils/vuewrapper',
    'collections/proposals',

    'text!templates/docs/proposal/index.html',
    'text!templates/docs/contact/index.html',
    'text!templates/docs/mobile/index.html',
    'text!templates/shipment/vue-migrate-steps.html', 'jquery', 'jquery-ui'], 
    function(Vue,
        VueWrapper,
        Proposals, 
        proposalTemplate, contactTemplate, mobileTemplate, 
        template) {

        // Can register the components globally like this:
        // Vue.component('tutorial-proposal', { template: proposalTemplate })
        // But as we only use them here we can use a local object
        let proposalComponent = {template: proposalTemplate}
        let contactComponent = {template: contactTemplate}
        let mobileComponent = {template: mobileTemplate}

    return VueWrapper.extend({
        vueView: Vue.extend({
            template: template,

            components: {
                'tutorial-proposal': proposalComponent,
                'tutorial-contact': contactComponent,
                'tutorial-mobile': mobileComponent,
            },

            data: function() {
                return {
                    message: 'Hello from Vue',
                    proposals: [],
                    pages: ['proposals', 'contacts', 'mobile'],
                    current_page: 0,
                }
            },
            computed: {
                selected: function() {
                    return this.pages[this.current_page]
                },
                lastPage: function() {
                    return this.current_page == this.pages.length - 1 
                },
            },
            methods: {
                onPrev: function() {
                    this.current_page = this.current_page > 0 ? this.current_page -1 : 0
                    console.log("Current Page = " + this.current_page + " selected = " + this.selected)
                },
                onNext: function() {
                    this.current_page = this.current_page < this.pages.length - 1 ? this.current_page + 1 : this.pages.length - 1
                    console.log("Current Page = " + this.current_page + " selected = " + this.selected)
                },
                onSave: function() {
                    console.log("Save Page")
                }
            },

            created: function() {
                console.log("Vue migrate steps tool created")
                this.selected = this.pages[this.current_page]
            },
            mounted: function() {
                $('.tab-container').tabs();
            }
        })
    })
})