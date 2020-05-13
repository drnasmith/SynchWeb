<template>
    <div class="tw-container tw-mx-auto tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center">
        <div class="tw-w-1/2 tw-flex tw-justify-end">
                <button v-show="!isEditable" v-on:click="onToggleEdit" class="button"><i class="fa fa-unlock"/> Edit</button>               
                <span v-show="isEditable">
                    <button class="button submit" v-on:click.prevent="onSave"><i class="fa fa-save"/> Save</button>
                    <button class="button submit" v-on:click.prevent="onReset"><i class="fa fa-lock"/> Reset</button>
                </span>
        </div>

        <tabs class="tw-w-1/2">
            <tab name="Contact Information" :selected="true">

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
            </tab>

            <tab name="Organization / Laboratory Info">

                <form>
                    <h1 class="tw-text-xl tw-font-hairline tw-mb-6 tw-text-center">Organization / Laboratory Information</h1>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="labname">Organisation Name<i class="tw-block tw-text-xs tw-mb-2 tw-text-left">Name of the contact company/university</i>
                            </label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.LABNAME" type="text" name="labname"/>
                        </div>
                    </div>

                    <div v-for="(line, index) in address" :key="index" class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="'address'+index">Address Line {{index+1}}<i class="tw-block tw-text-xs tw-mb-2 tw-text-left"></i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="line.line" type="text" name="'address' + index"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="city">PostCode<i class="tw-block tw-text-xs tw-mb-2 tw-text-left"></i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.POSTCODE" type="text" name="postcode"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="city">City<i class="tw-block tw-text-xs tw-mb-2 tw-text-left"></i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.CITY" type="text" name="city"/>
                        </div>
                    </div>

                    <div class="md:tw-flex md:tw-items-top tw-mb-4">
                        <div class="md:tw-w-2/5">
                            <label 
                                class="tw-text-sm tw-mb-2" 
                                for="country">Country<i class="tw-block tw-text-xs tw-mb-2 tw-text-left"></i></label>
                        </div>
                        <div class="md:tw-w-3/5">
                            <input v-bind:readonly="!isEditable" class="tw-shadow tw-border tw-rounded tw-w-full tw-p-1 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline" v-model="labcontact.COUNTRY" type="text" name="country"/>
                        </div>
                    </div>

                </form>              
            </tab>
            <tab name="Courier Information">
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

                </form>
            </tab>


        </tabs>
    </div>
</template>

<script>
import Backbone from 'backbone'
import Tab from '../../components/tab.vue'
import Tabs from '../../components/tabs2.vue'

export default {
    name: 'ContactForm',
    components: {
        'tabs': Tabs,
        'tab': Tab,
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        edit: {
            type: Boolean, // Initial edit state
            default: false
        }
    },
    data: function() {
        return {
            isEditable: this.edit,
            labcontact: {},
            address: [
                {line: ''},
                {line: ''},
                {line: ''},
            ]
        }
    },
    computed: {
        proposal: function() {
            return this.$store.getters.currentProposal
        },
        fullAddress: function() {
            let addr = [this.address[0].line, this.address[1].line, this.address[2].line]
            return addr.join('\n')
        }
    },
    mounted: function() {
        this.getLabContact()
    },
    
    methods: {
        getLabContact: function() {
            // If we are created to edit a specific contact, get this now
            if (this.id) {
                let self = this
                let url = this.$store.getters.apiRoot + '/contact/' + this.id
                let params = {prop: this.proposal}
                Backbone.ajax({
                    url: url, 
                    data: params,
                    success: function(resp) {
                        self.labcontact = resp

                        let address = self.labcontact.ADDRESS.split('\n')

                        if (address.length > 3) {
                            console.log("Error this address is invalid")
                        } else {
                            for (var i=0; i<address.length; i++) {
                                self.address[i].line = address[i]
                            }
                        }
                    },
                    error: function(err) {
                        console.log("Error getting labcontacts for proposal: " + self.proposal + ", err: " + err)
                    }
                })
            }
        },
        onSave: function(event) {
            event.preventDefault()
            this.labcontact.ADDRESS = this.fullAddress
            console.log("LabContact Details: " + JSON.stringify(this.labcontact))
            this.isEditable = false
        },

        onToggleEdit: function(event) {
            this.isEditable = !this.isEditable
            console.log("Editable = " + this.isEditable)
        },
        onReset: function() {
            this.isEditable = false
            this.getLabContact()
        }
    }
}
</script>