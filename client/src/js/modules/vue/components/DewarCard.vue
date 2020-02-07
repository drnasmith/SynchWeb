<!--
Card displaying dewar information stored in a specific rack location
dewar: { barcode: "", arrivalDate: "", facilityCode: "", status: "", needsLN2: true|false}

Emits an event 'clear-location' which should be handled by the parent component
-->
<template>
    <div class="tw-border tw-rounded tw-shadow tw-h-full tw-p-4 tw-cursor-pointer"
        v-bind:class="{'tw-text-danger': dewar.needsLN2 && dewar.status !== 'dispatch-requested', 'tw-bg-gray-400' : dewar.onBeamline}">
        <span class="tw-font-bold">{{rack}}: </span>
        <span v-if="dewar.barcode" class="tw-font-bold">{{dewar.barcode}}</span>
        <span v-else class=""></span>
        <!-- Tags -->
        <div class="tw-flex tw-flex-wrap">
            <span v-if="dewar.arrivalDate" class="tw-text-xs tw-text-white tw-bg-blue-500 tw-py-1 tw-px-2 ">{{dewar.arrivalDate.split(' ').slice(0,4).join(" ")}}</span>
            <span v-if="dewar.facilityCode" class="tw-text-xs tw-text-white tw-bg-gray-900 tw-py-1 tw-px-2">{{dewar.facilityCode}}</span>
            <span v-if="dewar.status == 'dispatch-requested'" class="tw-text-xs tw-bg-red-500 tw-py-1 tw-px-2 ">{{dewar.status}}</span>
            <span v-else-if="dewar.needsLN2" class="tw-text-xs tw-text-white tw-bg-danger tw-py-1 tw-px-2 ">needs-refill</span>  
        </div>
    </div>
</template>


<script>
export default {
    name: 'DewarCard',
    props: {
        dewar: Object,
        rack: String
    },
}
</script>