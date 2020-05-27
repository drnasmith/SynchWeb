import Page from '../page.vue'

import LabContacts from './labcontacts.vue'
import LabContact from './labcontact.vue'
import AddContact from './addContact.vue'

export default 
[
    {
        path: '/vcontacts',
        component: Page,
        children: [
            {
                path: '',
                name: 'vcontacts',
                name: 'listContacts',
                component: LabContacts,
            },
            {
                path: 'add',
                name: 'addContact',
                component: AddContact,
            },
            // Adding /id makes route determination clearer - does not get confused with 'add' as :id
            {
                path: 'id/:id',
                name: 'contact',
                component: LabContact,
                props: true
            },
        ]
    }
]