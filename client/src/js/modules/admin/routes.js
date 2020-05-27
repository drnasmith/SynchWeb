import Page from 'app/views/page.vue'
import MarionetteView from 'app/views/marionette/marionette-wrapper.vue'

import GroupsEditor from 'modules/admin/views/groups'
import GroupsView from 'modules/admin/views/groupview'

import Group from 'modules/admin/models/group'

import Proposal from 'models/proposal'

import Proposals from 'collections/proposals'
import ProposalsView from 'modules/admin/views/proposals'
import ProposalView from 'modules/admin/views/proposalview'
import AddProposal from 'modules/admin/views/addproposal'

import Visit from 'models/visit'
import VisitView from 'modules/admin/views/visitview'
import AddVisit from 'modules/admin/views/addvisit'

app.on('group:show', function(gid) {
    app.navigate('/admin/groups/'+gid)
    // controller.viewGroup(gid)
})

app.on('proposal:show', function(proposal) {
    app.navigate('/admin/proposals/'+proposal)
    // controller.viewProposal(proposal)
})

app.on('visit:show', function(visit) {
    app.navigate('/admin/proposals/visit/'+visit)
    // controller.viewVisit(visit)
})

let bc = { title: 'Manage Groups & Permissions', url: '/admin/groups' }
let bc2 = { title: 'Manage Proposals & Visits', url: '/admin/proposals' }

// Should probably use the store to cache values like this.
let proposalModel = {}

function lookupProposal(params) {
    return new Promise((resolve, reject) => {
        proposalModel = new Proposal({ PROPOSAL: params.prop })

        proposalModel.fetch({
            // If OK trigger next 
            success: function() {
              console.log("Admin proposal model lookup OK")
              resolve(proposalModel)
            },
            // Original controller had no error condition...
            error: function() {
                reject({msg: "Admin proposal model lookup failed"})
            }
        })    
    })
}

let routes = [
    {
        path: '/admin/groups',
        component: Page,
        children: [
            {
                path: '',
                name: 'admin-manage-groups',
                component: MarionetteView,
                props: route => ({
                    mview: GroupsEditor,
                    breadcrumbs: [bc],
                }),
            },
            {
                path: '/:gid',
                name: 'admin-view-group',
                component: MarionetteView,
                props: route => ({
                    mview: GroupsView,
                    breadcrumbs: [bc],
                    breadcrumb_hint: 'NAME',
                    options: {
                        model: new Group({USERGROUPID: route.params.gid})
                    }
                }),
            }        
        ]
    },
    // The original controller for admin does not provide search 's' or page parameters
    {
        path: '/admin/proposals',
        component: Page,
        children: [
            {
                path: '',
                name: 'admin-manage-proposals',
                component: MarionetteView,
                props: route => ({
                    mview: ProposalsView,
                    breadcrumbs: [bc2],
                    options: {
                        collection: new Proposals(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
                        params: {s: route.params.s}
                    }
                }),
            },
            {
                path: 'add',
                name: 'admin-add-proposal',
                component: MarionetteView,
                props: route => ({
                    mview: AddProposal,
                    breadcrumbs: [bc2],
                    options: {
                        collection: new Proposals(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
                        params: {s: route.params.s}
                    }
                }),
            },
            {
                path: ':prop',
                name: 'admin-view-proposal',
                component: MarionetteView,
                props: route => ({
                    mview: ProposalView,
                    breadcrumbs: [bc2],
                    breadcrumb_hint: 'PROPOSAL',
                    options: {
                        model: new Proposal({ PROPOSAL: route.params.prop }),
                        params: {s: route.params.s}
                    }
                }),
            },
            {
                path: 'visit/add/:prop',
                name: 'admin-add-visit',
                component: MarionetteView,
                props: route => ({
                    mview: AddVisit,
                    breadcrumbs: [bc2, {title: route.params.prop}, {title: 'Add Visit'}],
                    options: {
                        proposal: proposalModel,
                    }
                }),
                beforeEnter: (to, from, next) => {
                    console.log("Lookup admin visit add proposal Model")
                
                    lookupProposal(to.params).then((response) => {
                        console.log("Lookup Model OK - " + response)
                        next()
                    }, (error) => { 
                        console.log(error.msg)
                        next('/nopage')
                    })
                }
            },
            {
                path: 'visit/:visit',
                name: 'admin-view-visit',
                component: MarionetteView,
                props: route => ({
                    mview: VisitView,
                    breadcrumbs: [bc2],
                    breadcrumb_hint: 'PROPOSAL',
                    options: {
                        model: new Visit({ VISIT: route.params.visit }),
                    }
                }),
            },
        ],
        beforeEnter(to, from, next) {
            if (!app.user_can('manage_proposal')) {
                app.message({ title: 'Access Denied', message: 'You do not have access to that page' })
                next('/')
            } else {
                next()
            }
        }
    },
]

export default routes