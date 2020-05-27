<template>
    <div id="vue-labcontacts" class="content tw-container tw-mx-auto">
        <h1>LabContact Details</h1>
        <contact-form :id="id"/>
    </div>
</template>

<script>
import ContactForm from './contactForm.vue'

export default {
    name: 'LabContact',
    components: {
        'contact-form': ContactForm,
    },
    props: {
        'id': String,
    },
}
</script>