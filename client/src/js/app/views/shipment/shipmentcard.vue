<!--
Card displaying shipment information stored in a specific rack location

Emits an event 'clear-location' which should be handled by the parent component
-->
<template>
    <div class="tw-rounded tw-shadow tw-h-full tw-p-4 tw-m-1 tw-cursor-pointer"
        v-bind:class="borderClass">
        <p class="tw-font-bold">ID: {{shipment.SHIPPINGID}}</p>
        <p class="tw-font-normal">Name: {{shipment.SHIPPINGNAME}}</p>
        <p class="tw-font-normal">Created on: {{shipment.CREATED}}</p>
        <p class="tw-font-normal">Safety Level: {{shipment.SAFETYLEVEL}}</p>
        <p class="tw-font-normal">Number of Packages: {{shipment.DCOUNT}}</p>

        <!-- Tags -->
        <div class="tw-flex tw-flex-wrap">
            <span v-if="shipment.SHIPPINGSTATUS=='processing'" class="tw-rounded tw-text-xs tw-text-black tw-bg-green-500 tw-py-1 tw-px-2 ">{{shipment.SHIPPINGSTATUS}}</span>
            <span v-else class="tw-text-xs tw-text-black tw-bg-red-500 tw-py-1 tw-px-2 ">{{shipment.SHIPPINGSTATUS}}</span>
        </div>
    </div>

</template>


<script>
export default {
    name: 'ShippingCard',
    props: {
        shipment: Object,
        message: String
    },
    computed: {
        borderClass: function() {
            let classes = "tw-border-2 "

            if (this.shipment.SAFETYLEVEL === 'Green') {
                classes += 'tw-border-green-500'
            } else if (this.shipment.SAFETYLEVEL === 'Yellow') {
                classes += 'tw-border-yellow-500'
            } else if (this.shipment.SAFETYLEVEL === 'Red') {
                classes += 'tw-border-red-500'
            } else {
                classes += 'tw-border-gray-500'
            }
            return classes
        }
    }
}
</script>