<template>
    <section id="nopage" class="tw-container tw-mx-auto tw-text-center">
        <h1 class="tw-text-2xl tw-mb-2">Nothing to see here</h1>
        <p class="tw-mb-2">Sorry but the page you requested: <b>{{url}}</b> does not exist:</p>
        <button class="button tw-p-2" @click="$router.push('/')">Return to Home page</button>
    </section>
</template>

<script>
export default {
    name: 'NoPage',
    props: {
        'url': String
    }
}
</script>