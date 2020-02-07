<!--
Test App component
-->
<template>

<section>
    <h1>My Component Title</h1>
    <p>My Component message: {{message}}</p>
</section>

</template>


<script>
export default {
    name: 'MyComponent',
    data: function() {
        return {
            message: "I like toast"
        }
    }
}
</script>