<template>
    <div id="vue-labcontacts" class="content tw-container tw-mx-auto">
        <h1>Add LabContact</h1>
        <contact-form :edit="true"/>
    </div>
</template>

<script>
import ContactForm from './contactForm.vue'

export default {
    name: 'AddContact',
    components: {
        'contact-form': ContactForm,
    },
}
</script>