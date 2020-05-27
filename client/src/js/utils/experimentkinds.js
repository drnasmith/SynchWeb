define([], function() {
    
    return {
        opts: function() {
            let list = {}

            if (app.staff) list = Object.assign(list, this.list, this.staff)

            return _.map(list, function(v,s) { return '<option value="'+v+'">'+s+'</option>' }).join()
        },
        obj: function() {
            let list = {}

            if (app.staff) list = Object.assign(list, this.list, this.staff)

            return _.invert(list)
        },

        key: function(value) {
            let list = {}

            if (app.staff) list = Object.assign(list, this.list, this.staff)

            return _.invert(list)[value]
        },

        list: {
            '': '',
            'native': 'OSC',
            'phasing': 'SAD',
            'ligand': 'Ligand binding',
            'stepped': 'Stepped transmission',
        },

        staff: {
            'commissioning': 'Commissioning'
        }
        
    }
    
})