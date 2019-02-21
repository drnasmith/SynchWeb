define(['utils/marionette_vuewrapper',
        'vue',
        'vee-validate',
        'modules/feedback/models/feedback',
        'text!templates/feedback/feedback.html',
        ], function(VueWrapper, Vue, VeeValidate, FeedbackModel, tmpl) {

    // Declare use of validation plugin
    Vue.use(VeeValidate)

    return VueWrapper.extend({
        vueView: Vue.extend({
            template: tmpl,

            // Data needs to be a function as we are defining a Vue component here
            data: function() {
                return {
                    // Form elements
                    name: null,
                    email: null,
                    feedback: null,
                    // Control for loading spinner
                    isLoading: false
                }
            },

            methods: {
                onSubmit(event) {
                    event.preventDefault()
                    let self = this // Save this for resetting if submit is ok

                    // Check vee-validation passes
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            // Set the attribute to show loading spinner
                            self.isLoading = true
                
                            let model = new FeedbackModel({
                                name: this.name,
                                email: this.email,
                                feedback: this.feedback
                            })
                            // Save model (post) to server
                            model.save({}, {
                                success: function(model, response, options) {
                                    // Reset all data to defaults
                                    self.reset()
                                    app.alert({message: "Your feedback has been submitted!", notify: true})
                                    self.isLoading = false
                                },
                                error: function(model, response, options) {
                                    app.alert({message: "Your feedback has NOT been submitted - Failed validation on server!"})
                                    self.isLoading = false
                                }})
                        } else {
                            console.log('Form validation failed - UI should show errors!')
                        }
                    });
                },
                // Called on successful submission
                reset: function() {
                    this.name = null
                    this.email = null
                    this.feedback = null
                    // If we don't call reset form will show errors straight away
                    this.$validator.reset()
                }
            },
        })
    })
})