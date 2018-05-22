import plan from './plan'
import PlanGroup from './planGroup'

const components = [
  plan,
  PlanGroup
]
export default {
  install: function (Vue) {
    components.map(component => {
      Vue.component(component.name, component)
    })
  }
}
