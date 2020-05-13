import Page from '../page.vue'

import AddShipment from './addShipment.vue'
import ListShipments from './shipmentList.vue'
import ViewShipment from './shipmentView.vue'

export default 
[
  {
    path: '/shipments',
    component: Page,
    children: [
      {
        path: '',
        name: 'shipments',
        name: 'listShipments',
        component: ListShipments
      },
      {
        path: 'new',
        name: 'addShipment',
        component: AddShipment
      },
      {
        path: 'id/:id',
        name: 'viewShipment',
        component: ViewShipment,
      }
    ]
  }
]