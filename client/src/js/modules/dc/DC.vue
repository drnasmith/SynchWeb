<template>
    <section>
        <h1>Data Collection View</h1>
        <p>{{$route.path}}</p>
        <p>Visit: {{visit}}</p>
        <p>Id: {{id}}</p>
        <p>page: {{page}}</p>
        <p>ty: {{ty}}</p>
        <p>dcg: {{dcg}}</p>
        <p>Search: {{search}}</p>
        <p>Loaded: {{loaded}}</p>

        <marionette-view :key="$route.fullPath" v-if="loaded" :options="options" :fetchOnLoad="true" :mview="mview" :breadcrumbs="bc"></marionette-view>
        <p v-if="loaded">DC View initialisation finished</p>
    </section>
</template>

<script>

import MarionetteView from 'vuejs/views/marionette/marionette-wrapper.vue'

import DCList from 'modules/dc/datacollections'
import GenericDCList from 'modules/types/gen/dc/datacollections'
import SMDCList from 'modules/types/sm/dc/datacollections'
import TomoDCList from 'modules/types/tomo/dc/datacollections'
import EMDCList from 'modules/types/em/dc/datacollections'
import POWDCList from 'modules/types/pow/dc/datacollections'
import SAXSDCList from 'modules/types/saxs/dc/datacollections'
import XPDFDCList from 'modules/types/xpdf/dc/datacollections'

import DCCol from 'collections/datacollections'
import Proposal from 'models/proposal'
import Visit from 'models/visit'

let dc_views = {
  mx: DCList,
  sm: SMDCList,
  gen: GenericDCList,
  tomo: TomoDCList,
  em: EMDCList,
  pow: POWDCList,
  saxs: SAXSDCList,
  xpdf: XPDFDCList,
}



export default {
    name: 'dc',
    components: {
        'marionette-view': MarionetteView
    },
    props: {
        'id': String,
        'visit' : String,
        'page' : String,
        'search': String,
        'dcg': String,
        'pjid': String, 
        'ty': String,
    },
    data: function() {
        return {
            loaded: false,
            mview: null,
            model: null,
            collection: null,
            params: null,
            bc : [{ title: 'Data Collections', url: '/dc' }]
        }
    },
    watch: {
        $route(to, from) {
            // Reload if our route changes
            console.log("DC Route has changed..." + to.path)
        }
    },
    computed: {
        options: function() {
            return {
                collection: this.collection,
                model: this.model,
                params: this.params
            }
        }
    },
    created: function() {
        console.log("DC View Created")

        this.lookupView()

        this.collection = new DCCol(null, {
                        state: { currentPage: this.page ? parseInt(this.page) : 1, pageSize: app.mobile() ? 5 : 15},
                        queryParams: { visit: this.visit, s: this.search, t: this.type, id: this.id, dcg: this.dcg, PROCESSINGJOBID: this.pjid }
                    })
        this.params = { visit: this.visit, search: this.search, type: this.type, id: this.id, dcg: this.dcg }


    },
    mounted: function() {
        console.log("DC View Mounted")
    },
    methods: {
        lookupView: function() {
            let error = ''
            
            if (this.visit) {
                // Sets the proposal based on visit path parameter
                app.cookie(this.visit.split('-')[0])

                this.model = new Visit({ VISIT: this.visit })
                error = 'The specified visit does not exist'
            } else {
                this.model = new Proposal({ PROPOSAL: app.prop })
                error = 'The specified proposal does not exist'
            }

            this.getDCType().then((result) => {
                console.log("DC View Have determined View Type: " + result)
                this.loaded = true
                if (!result) {
                    console.log("DC View Error determining proposal type " + error)
                }
            })                
            
        },

        getDCType: function() {
            let self = this

            return new Promise((resolve) => {
                this.model.fetch({
                    success: function() {
                        let proposalType = self.model.get('TYPE')
                        console.log("DC View got model type " + proposalType)
                        // this.mview = GetView.DCView.get(this.model.get('TYPE')),
                        self.mview = dc_views[proposalType],
                        resolve(true)
                    },
                    // Original controller had no error condition...
                    error: function() {
                        console.log("DC View error getting view/model ")
                        resolve(false)
                    },
                })   

            })
        },

        getOptions: function() {
            console.log("DC Option Params = " + JSON.stringify({ visit: this.visit, search: this.search, type: this.type, id: this.id, dcg: this.dcg }))
            return {
                collection: new DCCol(null, {
                        state: { currentPage: this.page ? parseInt(this.page) : 1, pageSize: app.mobile() ? 5 : 15},
                        queryParams: { visit: this.visit, s: this.search, t: this.type, id: this.id, dcg: this.dcg, PROCESSINGJOBID: this.pjid }
                    }),
                model: this.model,
                params: { visit: this.visit, search: this.search, type: this.type, id: this.id, dcg: this.dcg }
            }
        },
    },
    beforeRouteEnter: function(to, from, next) {
        console.log("DC View Before Enter In Component guard")
        console.log("DC View Before Route Enter " + JSON.stringify(to.params))
        // next(vm => vm.lookupView())
        next()
    }
}
</script>