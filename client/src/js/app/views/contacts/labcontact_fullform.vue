<template>
    <div id="vue-labcontacts" class="content tw-container tw-mx-auto">
        <h1>LabContact for {{ id }}</h1>

        <div class="tw-container tw-mx-auto tw-h-full tw-flex tw-justify-center tw-items-center">

        <div class="tw-w-full md:tw-w-1/2">
            <div class="">
                <button v-show="isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-lock"/> Lock</button>
                <button v-show="!isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-unlock"/> Edit</button>
            </div>

        <form>
            <h1 class="tw-text-xl tw-font-hairline tw-mb-6 tw-text-center">Contact Information</h1>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="cardname">Card Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">reference name for this contact</i>
                    </label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.CARDNAME" type="text" name="cardname"/>
                </div>
            </div>
            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="givenName">Given Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's first name</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.GIVENNAME" type="text" name="givenName"/>
                </div>
            </div>
            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="familyName">Family Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's family name</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.FAMILYNAME" type="text" name="familyName"/>
                </div>
            </div>
            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="phoneNumber">Phone Number<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's phone number</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.PHONENUMBER" type="text" name="phoneNumber"/>
                </div>
            </div>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="email">E-Mail Address<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's e-mail address</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.EMAILADDRESS" type="text" name="emailAddress"/>
                </div>
            </div>

            <h1 class="tw-text-xl tw-font-hairline tw-text-center">Courier Information</h1>
            <p class="tw-text-md tw-font-bold tw-font-hairline tw-mb-6 tw-text-center">The following information is used for each shipment associated with this contact</p>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="courier">Default Courier<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">default courier for this contact</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEFAULTCOURRIERCOMPANY" type="text" name="courier"/>
                </div>
            </div>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="courier">Courier Account<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">default courier account number</i></label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.COURIERACCOUNT" type="text" name="account"/>
                </div>
            </div>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="billing">Billing Reference<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Billing reference to use when returning packages home</i>
                    </label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.BILLINGREFERENCE" type="text" name="billing"/>
                </div>
            </div>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="customsValue">Average customs value<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Average customs value of dewar or package</i>
                    </label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEWARAVGCUSTOMSVALUE" type="text" name="customsValue"/>
                </div>
            </div>

            <div class="md:tw-flex md:tw-items-top tw-mb-4">
                <div class="md:tw-w-2/5">
                    <label 
                        class="tw-text-sm tw-mb-2" 
                        for="transportValue">Average transport value<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Average transport value of dewar or package</i>
                    </label>
                </div>
                <div class="md:tw-w-3/5">
                    <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEWARAVGTRANSPORTVALUE" type="text" name="transportValue"/>
                </div>
            </div>

            <div v-show="isEditable">
                <button class="button submit" v-on:click.prevent="onSubmit">Save</button>
                <button class="button submit" v-on:click.prevent="onReset">Reset</button>
            </div>
        </form>
        </div>
    </div>

    <div class="tw-container tw-mx-auto tw-h-full tw-flex tw-justify-center tw-items-center">
        <tabs>
            <tab name="Contact Information" :selected="true">

            <div class="tw-w-full md:tw-w-1/2">
                <div class="">
                    <button v-show="isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-lock"/> Lock</button>
                    <button v-show="!isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-unlock"/> Edit</button>
                </div>

                <form>
                    <h1 class="tw-text-xl tw-font-hairline tw-mb-6 tw-text-center">Contact Information</h1>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="cardname">Card Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">reference name for this contact</i>
                            </label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.CARDNAME" type="text" name="cardname"/>
                        </div>
                    </div>
                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="givenName">Given Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's first name</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.GIVENNAME" type="text" name="givenName"/>
                        </div>
                    </div>
                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="familyName">Family Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's family name</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.FAMILYNAME" type="text" name="familyName"/>
                        </div>
                    </div>
                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="phoneNumber">Phone Number<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's phone number</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.PHONENUMBER" type="text" name="phoneNumber"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="email">E-Mail Address<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">contact's e-mail address</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.EMAILADDRESS" type="text" name="emailAddress"/>
                        </div>
                    </div>
                </form>
            </div>
            
            </tab>

            <tab name="Courier Information">
                <div class="tw-w-full md:tw-w-1/2">
                    <div class="">
                        <button v-show="isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-lock"/> Lock</button>
                        <button v-show="!isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-unlock"/> Edit</button>
                    </div>

                    <form>
                    <h1 class="tw-text-xl tw-font-hairline tw-text-center">Courier Information</h1>
                    <p class="tw-text-md tw-font-bold tw-font-hairline tw-mb-6 tw-text-center">The following information is used for each shipment associated with this contact</p>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="courier">Default Courier<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">default courier for this contact</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEFAULTCOURRIERCOMPANY" type="text" name="courier"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="courier">Courier Account<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">default courier account number</i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.COURIERACCOUNT" type="text" name="account"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="billing">Billing Reference<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Billing reference to use when returning packages home</i>
                            </label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.BILLINGREFERENCE" type="text" name="billing"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="customsValue">Average customs value<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Average customs value of dewar or package</i>
                            </label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEWARAVGCUSTOMSVALUE" type="text" name="customsValue"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="transportValue">Average transport value<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Average transport value of dewar or package</i>
                            </label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.DEWARAVGTRANSPORTVALUE" type="text" name="transportValue"/>
                        </div>
                    </div>

                    <div v-show="isEditable">
                        <button class="button submit" v-on:click.prevent="onSubmit">Save</button>
                        <button class="button submit" v-on:click.prevent="onReset">Reset</button>
                    </div>
                    </form>
                </div>
            </tab>

            <tab name="Organization / Laboratory Info">
                <h1>Here is the content for the about our vision tab.</h1>
                <p>Line 1</p>
                <p>Line 2</p>
                <p>Line 3</p>
            </tab>
        </tabs>
    </div>

    </div>
</template>

<script>
import Backbone from 'backbone'
import Tab from './tab.vue'
import Tabs from './tabs2.vue'

export default {
    name: 'Login',
    components: {
        'tabs': Tabs,
        'tab': Tab,
    },
    props: [
        'id',
    ],
    data: function() {
        return {
            isEditable: false,
            labcontact: {},
        }
    },
    computed: {
        proposal: function() {
            return this.$store.getters.currentProposal
        }
    },
    mounted: function() {
        this.getLabContact()
    },
    
    methods: {
        getLabContact: function() {
            let self = this
            let url = this.$store.getters.apiRoot + '/contact/' + this.id
            let params = {prop: this.proposal}
            Backbone.ajax({
                url: url, 
                data: params,
                success: function(resp) {
                    console.log("LC response = " + JSON.stringify(resp))
                    self.labcontact = resp
                },
                error: function(err) {
                    console.log("Error getting labcontacts for proposal: " + self.proposal + ", err: " + err)
                }
            })
        },
        onSubmit: function(event) {
            event.preventDefault()
            console.log("Login: " + this.cardName + ":" + this.email)
        },
        onCancel: function(event) {
            event.preventDefault()
            console.log("Login: " + this.cardName + ":" + this.email)
        },
        onToggleEdit: function(event) {
            this.isEditable = !this.isEditable
            console.log("Editable = " + this.isEditable)
        },
        onReset: function() {
            this.getLabContact()
        }
    }
}
</script>