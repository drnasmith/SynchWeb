import MxMenu from 'modules/types/mx/menu.js'
import GenMenu from 'modules/types/gen/menu.js'
import EmMenu from 'modules/types/em/menu.js'

const menuStore = {
    state: () => ({
      menus: {
        'gen': GenMenu,
        'mx': MxMenu,
        'em': EmMenu,
      }
    }),

    getters: {
        getMenu: (state, getters, rootState) => {
            return state.menus[rootState.proposalType]
        }
    }
}
export default menuStore