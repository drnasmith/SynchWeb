define(['vue',
    'promise',
    'utils/vuewrapper',
    'models/protein',
    'templates/vue/samples/cloneprotein.html',
    ], function(Vue, Promise, VueWrapper, ProteinModel, template) {

    // Promise is not used, but required for IE if we want to use vee-validate
    // Vue.use(VeeValidate)

    return VueWrapper.extend({
        vueView: Vue.extend({
            template: template,

            data: function() {
                return {
                    message: 'Clone Protein page',
                    isLoading: false,
                    clonedModel: null,
                }
            },
            created: function() {
                let originalModel = this.$getOption('model')
                console.log("Original Model = " + JSON.stringify(originalModel))
                this.clonedModel = originalModel.clone()
                this.clonedModel.set('PROTEINID', null)
                this.clonedModel.set('ACRONYM', 'Clone_'+originalModel.get('ACRONYM'))
                console.log("Cloned Model = " + JSON.stringify(this.clonedModel))
            },
            methods: {
                // With new build and (IE polyfill) we could use
                // Object.assign() to reset all data to initial state
                // Using the method below is simple alternative that
                // allows us to clear form data after submission
                resetForm: function() {
                    this.message = ''
                },
                onSubmit: function() {   
                    let self = this
                    console.log("Submit Clone request")
                    this.clonedModel.save({
                        success: function(model, response, options) {
                            console.log("Saved a model with id " + model.get('PROTEINID'))
                            console.log("Saved a model with response " + response)
                        },
                        error: function() {
                            console.log("Failed to save cloned model ")
                        }
                    })
                },
                submitRequest: function() {
                    this.isLoading = true

                    let model = new ProteinModel({
                    })

                    let self = this

                    // Passing {} as first argument means send all model data
                    model.save({}, {
                        success: function(model, response, options) {
                            // Indicate success and reset form
                            app.alert({message: "Protein Clone successfully submitted"})
                            self.isLoading = false
                        },
                        error: function(model, response, options) {
                            app.alert({message: "Something went wrong cloning this protein, please try again"})
                            // If feedback failed, don't reset the form, just set isLoading to false
                            self.isLoading = false
                        }
                    })
                }
            }
        })
    })
})