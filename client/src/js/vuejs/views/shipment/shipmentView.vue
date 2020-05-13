<template>
    <div id="vue-view-shipment" class="content tw-container tw-mx-auto">
        <h1>Shipment {{id}}</h1>
        <p>This is actually view shipment component</p>

    </div>
</template>

<script>
export default {
    name: 'AddShipment',
    props: {
        // 'id': String
    },
    data: function() {
        return {
            shipmentName: '',
            id: this.$route.params.id
        }
    },
    created: function() {
        console.log("View Shipment Component")
    },
    methods: {
        onCancel: function() {
            this.$emit('navigate', '')
        },
        onSubmit: function() {
            console.log("Submit..")
        }
    }
}
</script>