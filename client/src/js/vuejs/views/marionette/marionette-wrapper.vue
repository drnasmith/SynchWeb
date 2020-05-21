<template>

        <div class="marionette-wrapper">
            <div id="marionette-view" class="content"></div>
        </div>
    
</template>

<script>
import Marionette from 'marionette'
import EventBus from '../../components/utils/event-bus.js'

export default {
    name: 'MarionetteWrapper',
    props: {
        'mview': Function,
        'breadcrumbs' : Array,
        'breadcrumb_hint' : String,
        'options': Object
    },
    data: function() {
        return {
            marionetteView: null,
            loaded: false
        }
    },
    computed: {
        prefetch: function() {
            if (this.options && (this.options.model || this.options.collection) ) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        // If we are prefetching data, wait for loaded state before rendering
        loaded: function(val) {
            if (val) {
                this.initialiseView()
            }
        }
    },
    created: function() {
        // If we have been passed breadcrumbs, send the update event
        if (this.breadcrumbs) {
            console.log("Marionette View bc: " + JSON.stringify(this.breadcrumbs))
            EventBus.$emit('bcChange', this.breadcrumbs)
        }
    },
    mounted: function() {
        console.log("MarionetteViewWrapper::mounted" )
        if (this.prefetch === false) {
            // No prefetching, initialise now
            this.initialiseView()
        }
    },
    beforeDestroy: function() {
        // We still have access to this so tidy up the marionette view
        if (this.marionetteView) {
            console.log("MarionetteViewWrapper::beforeDestroy - cleaning up view ")
            this.marionetteView.destroy()
        }
    },
    methods: {
        initialiseView: function() {
            if (this.mview) {

                let options = {}

                options = Object.assign(options, {el: '#marionette-view'})
                // Now merge in any passed parameters
                if (this.options) {
                    options = Object.assign(options, this.options)
                }

                // Deal with the passed marionette view.
                // This might be a promise to resolve or a static constructor.
                // Most Marionette views will be lazy loaded from their AMD module definitions until we convert to es2015 exports
                if (this.mview instanceof Promise) {
                    console.log("Marionette View handle lazy loading view...")
                    this.mview.then((module) => {
                        this.marionetteView = new module.default(options)
                        this.marionetteView.render()
                    })
                } else {
                    this.marionetteView = new this.mview(options)
                    this.marionetteView.render()
                }
            } else {
                console.log("MarionetteViewWrapper::initaliseView could not find passed view")
            }
        },
        //
        // Non Promise version
        //
        // prefetchData: function() {
        //     console.log("Marionette Wrapper prefetching data")
        //     // Do we need to 
        //     if (this.options && this.options.collection) {
        //         this.fetchCollection(this.options.collection, this.options.queryParams)
        //         console.log("MARIONETTE WRAPPER HAS OPTIONS.COLLECTION")
        //     }
        //     if (this.options && this.options.model) {
        //         this.fetchModel(this.options.model, this.options.queryParams)
        //         console.log("MARIONETTE WRAPPER HAS OPTIONS.MODEL")
        //     }
        // },
        // fetchCollection: function(collection, queryParams) {
        //     this.$store.commit('loading', true)
        //     let self = this
        //     collection.queryParms = queryParams ? queryParams : null
        //     collection.fetch({
        //         success: function() {
        //             console.log("MarionetteViewWrapper:fetchCollection ok")
        //             self.loaded = true
        //             self.$store.commit('loading', false)
        //         },
        //         error: function() {
        //             console.log("MarionetteViewWrapper:Error getting collection")
        //             self.loaded = false
        //             self.$store.commit('loading', false)
        //             app.alert({ title: 'No such collection', message: 'The specified collection could not be found'})
        //         }
        //     })
        // },
        // fetchModel: function(model, queryParams) {
        //     this.$store.commit('loading', true)
        //     let self = this
        //     model.queryParms = queryParams ? queryParams : null
        //     model.fetch({
        //         success: function() {
        //             console.log("MarionetteViewWrapper:fetchModel ok")
        //             self.loaded = true
        //             self.$store.commit('loading', false)
        //             if (self.breadcrumb_hint) {
        //                 self.breadcrumbs.push({title: model.get(self.breadcrumb_hint)})
        //                 EventBus.$emit('bcChange', self.breadcrumbs)
        //             }
        //         },
        //         error: function() {
        //             console.log("MarionetteViewWrapper:Error getting model")
        //             self.loaded = false
        //             self.$store.commit('loading', false)
        //             app.alert({ title: 'No such model', message: 'The specified model could not be found'})
        //         }
        //     })
        // },

        //
        // Promise Version - wait for collections and models to be prefetched before returning
        //
        prefetchData: function() {
            if (this.options.model || this.options.collection) {
                let self = this
                console.log("Marionette Wrapper prefetching data via promise")
                const promiseCollection = this.fetchCollection(this.options.collection, this.options.queryParams)
                const promiseModel = this.fetchModel(this.options.model, this.options.queryParams)
                Promise.all([promiseCollection, promiseModel]).then(() => {
                    self.loaded = true
                    return
                })
            } else {
                self.loaded = true
                return
            }
        },
        fetchCollection: function(collection, queryParams) {
            return new Promise((resolve, reject) => {
                // If we have no collection return immediately
                if (!collection) { resolve() }

                this.$store.commit('loading', true)
                let self = this
                collection.queryParms = queryParams ? queryParams : null
                collection.fetch({
                    success: function() {
                        self.$store.commit('loading', false)
                        resolve()
                    },
                    error: function() {
                        self.$store.commit('loading', false)
                        app.message({ title: 'No such collection', message: 'The specified collection could not be found'})
                        reject()
                    }
                })
            })
        },
        fetchModel: function(model, queryParams) {
            return new Promise((resolve, reject) => {
                // If we have no model return immediately
                if (!model) { resolve() }
                
                this.$store.commit('loading', true)
                let self = this
                model.queryParms = queryParams ? queryParams : null
                model.fetch({
                    success: function() {
                        self.$store.commit('loading', false)
                        if (self.breadcrumb_hint) {
                            self.breadcrumbs.push({title: model.get(self.breadcrumb_hint)})
                            EventBus.$emit('bcChange', self.breadcrumbs)
                        }
                        resolve()
                    },
                    error: function() {
                        self.$store.commit('loading', false)
                        app.message({ title: 'No such model', message: 'The specified model could not be found'})
                        reject()
                    }
                })
            })
        },
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => vm.prefetchData())
    }
}
</script>