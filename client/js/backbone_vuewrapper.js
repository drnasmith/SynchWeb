// Need a good name for this ExtensibleView, VueAdapter, VueView, VueWrapper..?
// Currently a Backbone View - could be a Marionette View instead...
define(['backbone'], function(Backbone) {
    return VueWrapper = Backbone.View.extend({
        vueView: undefined,
        // class or id?
        template: '<div class="vue-container"></div>',

        // Backbone Render method - where we attach the Vue app to the page
        render: function() {
            this.$el.html(this.template)
            this.vue = new this.vueView({el: this.$('.vue-container').get(0)})
            return this
        },

        // Backbone View Lifecycle hook
        remove: function() {
            // Destroy the Vue vm instance
            this.vue.$destroy()
            // Call the base class method, stopping timers, events etc.
            Backbone.View.prototype.remove.apply(this)
        },
    })
})