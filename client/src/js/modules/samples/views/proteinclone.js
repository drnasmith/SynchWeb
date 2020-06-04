define(['marionette', 'views/form', 
    'models/protein',
    'collections/componenttypes',
    'collections/concentrationtypes',
    'modules/samples/collections/pdbs', 
    'templates/samples/proteinadd.html'], 
    function(Marionette, TableView, Protein, ComponentTypes, ConcentrationTypes, PDBs, template) {
    
    
    return FormView.extend({
        template: template,

        templateHelpers: function() {
            return {
                IS_STAFF: app.staff
            }
        },
        
        createModel: function() {
            this.model = this.model.clone()
            this.model.set('PROTEINID',null)
            this.model.set('PDBS', '')
            console.log("CLone Protein Model..." + JSON.stringify(this.model))
        },
        
        ui: {
            name: 'input[name=NAME]',
            acronym: 'input[name=ACRONYM]',
            sequence: 'textarea[name=SEQUENCE]',
            mass: 'input[name=MOLECULARMASS]',
            
            exist: 'select[name=existing_pdb]',
            pdbf: 'input[name=new_pdb]',
            type: 'select[name=COMPONENTTYPEID]',
            conc: 'select[name=CONCENTRATIONTYPEID]',
        },
        
        initialize: function(options) {
            console.log("Clone protein initialise")
            this.types = new ComponentTypes()
            this.types.fetch().done(this.updateTypes.bind(this))

            this.concs = new ConcentrationTypes()
            this.concs.fetch().done(this.updateConcs.bind(this))

            this.pdbs = new PDBs(null, { pid: this.model.get('PROTEINID') })
            this.pdbs.fetch().done(this.updatePDBs.bind(this))
        },

        updatePDBs: function() {
            this.ui.exist.html(this.pdbs.opts())
        },

        updateTypes: function() {
            this.ui.type.html(this.types.opts({ empty: true }))
        },

        updateConcs: function() {
            this.ui.conc.html(this.concs.opts({ empty: true }))
        },

        success: function(model, response, options) {
            console.log('success from protadd', this.model)
            app.trigger('proteins:view', model.get('PROTEINID'))
        },

        failure: function(model, xhr, options) {
            console.log(arguments)
            json = null
            if (xhr.responseText) {
                try { 
                    json = $.parseJSON(xhr.responseText)
                } catch(err) {}
            }

            if (json.message) app.alert({ message: json.message })
            else app.alert({ message: 'Something went wrong registering that protein' })
        },
        onRender: function() {
            console.log("Protein Clone On Render")
            console.log(this.ui.pdbf)
            this.ui.name.val(this.model.get('NAME'))
            this.ui.acronym.val(this.model.get('ACRONYM'))
            this.ui.sequence.val(this.model.get('SEQUENCE'))
            this.ui.mass.val(this.model.get('MOLECULARMASS'))
            this.ui.type.val(this.model.get('TYPE'))
        }
    })

})