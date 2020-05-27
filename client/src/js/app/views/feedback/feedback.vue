<template>
    <section class="content">
    <h1>Send Feedback</h1>

    <p class="help">This page is for sending feedback about the ISPyB web interface to the developers, not for your beamtime! Please use UAS to report feedback for your visits</p>

    <form novalidate v-bind:class="{loading: isLoading}">

    <div class="form">
        <ul>

            <li>
                <label>Your Name</label>
                <input type="text" name="name" v-bind:class="{'ferror': $v.name.$error}" v-model="$v.name.$model"/>
                <span v-if="$v.name.$error" class="errormesage ferror">Field is required</span>
            </li>

            <li>
                <label>Your Email Address</label>
                <input name="email" type="email"  v-bind:class="{'ferror': $v.email.$error}" v-model="$v.email.$model"/>
                <span v-if="$v.email.$error" class="errormesage ferror">Email format required</span>
            </li>

            <li>
                <label>Feedback</label>
                <textarea name="feedback"  v-bind:class="{'ferror': $v.feedback.$error}" v-model="$v.feedback.$model"></textarea>
                <span v-if="$v.feedback.$error" class="errormesage ferror">Field is required</span>
            </li>

        </ul>

        <button name="submit" value="1" type="submit" class="button submit" v-on:click.prevent="onSubmit">Send Feedback</button>

    </div>

    </form>
</section>
</template>

<script>
import {email, required} from 'vuelidate/lib/validators'
import FeedbackModel from 'modules/feedback/models/feedback'

export default {
    name: 'Feedback',

    data: function() {
        return {
            name: '',
            email: '',
            feedback: '',
            isLoading: false 
        }
    },
    // Example of using vuelidate. Also possible to add this to the backbone model itself
    validations: {
        name: {
            required,
        },
        email: {
            email,
        },
        feedback: {
            required
        }
    },
    methods: {
        // With new build and (IE polyfill) we could use
        // Object.assign() to reset all data to initial state
        // Using the method below is simple alternative that
        // allows us to clear form data after submission
        resetForm: function() {
            this.name = ''
            this.email = ''
            this.feedback = ''

            // To reset form validation, we should wait for next tick
            // Vue rectivity means the DOM will not be updated immediately
            this.$nextTick(function() {
                this.$v.$reset()
            })
        },
        onSubmit: function() {   
            let self = this
            // Ensure vuelidate is up to date
            this.$v.$touch()

            if (this.$v.invalid) {
                console.log('Form submission prevented, validation failed');
            } else {
                self.submitFeedback()
            }
        },
        submitFeedback: function() {
            this.isLoading = true

            let model = new FeedbackModel({
                name: this.name,
                email: this.email,
                feedback: this.feedback
            })

            let self = this

            // Passing {} as first argument means send all model data
            model.save({}, {
                success: function(model, response, options) {
                    // Indicate success and reset form
                    self.$store.commit('add_notification', {message: "Feedback successfully submitted", level: "info"})
                    setTimeout(function() {
                        self.$store.commit('add_notification', {message: "...or was it", level: "error"})
                    }, 3000)
                    setTimeout(function() {
                        self.$store.commit('add_notification', {message: "...yes it was", level: "success"})
                    }, 4000)
                    self.isLoading = false
                    self.resetForm()
                },
                error: function(model, response, options) {
                    self.$store.commit('add_notification', {message: "Something went wrong submitting this feedback, please try again", level: 'error'})
                    // If feedback failed, don't reset the form, just set loading to false
                    self.isLoading = false
                }
            })
        }
    }
}
</script>