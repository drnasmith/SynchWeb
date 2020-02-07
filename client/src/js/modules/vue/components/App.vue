<!--
Test App component
-->
<template>

<section>
    <h1>App Title</h1>
    <p>App message: {{message}}</p>
    <my-component></my-component>
    <dewar-card
          rack="RACK-A1"
          v-bind:dewar="dewar"></dewar-card>
</section>

</template>


<script>
import MyComponent from './MyComponent.vue'
import DewarCard from './DewarCard.vue'

export default {
    name: 'App',
    components: {
        'my-component': MyComponent,
        'dewar-card': DewarCard
    },
    data: function() {
        return {
            message: "Welcome from App",
            dewar: {status: 'dispatch-requested',barcode: 'mx12345-1234', facilityCode: 'DLS-MX-1234', needsLN2:true, arrivalDate: '2020-01-31'}
        }
    }
}
</script>