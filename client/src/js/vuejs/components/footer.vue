<template>
    <div id="footer">
      <div class="whatnow">
          <a href="http://diamondlightsource.github.io/SynchWeb/">SynchWeb? What is This?</a>
      </div>
      <p><a href="http://diamond.ac.uk">Diamond Light Source</a> &copy;2013-{{currentYear}}</p>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data: function() {
      return {
        currentYear: document.write(new Date().getFullYear())
      }
    }
}
</script>