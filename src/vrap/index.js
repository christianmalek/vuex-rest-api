import Vue from "vue";
import VueResource from "vue-resource";

Vue.use(VueResource);

/*
Needs to be called like

createVrapPlugin({
  list: "/categories",
  get: "/categories{/id}",
  create: "/categories{/id}",
  update: "/categories{/id}",
  remove: "/categories{/id}"
}, "categories");
*/
export default function createVrapPlugin(resourceURLs, name) {

  const capitalizedName = name.replace(/(A-Z])/g, "_$1");
  const successSuffix = "_SUCCEEDED";
  const failureSuffix = "_FAILED";

  // TODO: Use same action names as vue-resource does, otherwise mapping is mandatory!
  const map = {
    list: "LIST",
    get: "GET",
    create: "CREATE",
    update: "UPDATE",
    delete: "DELETE"
  };

  const resources = {};
  resourceURLs.forEach((key, value) => {
    resources[key] = Vue.resource(value);
  });

  function createMutations() {
    const mutations = {};

    resources.forEach((key) => {
      const method = map[key];

      mutations[`${method}_${capitalizedName}`] = (state) => {
        state.pending = true;
        state.error = null;
      };
      mutations[`${method}_${capitalizedName}_${successSuffix}`] = (state, payload) => {
        state.pending = false;
        state.error = null;
        state[name] = payload;
      };
      mutations[`${method}_${capitalizedName}_${failureSuffix}`] = (state, payload) => {
        state.pending = true;
        state.error = payload;
        state[name] = null;
      };
    });

    return mutations;
  }

  function createActions() {
    const actions = {};

    resources.forEach((key, value) => {
      const method = map[key];

      actions[key] = ({ commit }, { params, body = {} }) => {
        commit(`${method}_${capitalizedName}`);
        value[key](params, body)
          .then((response) => {
            commit(`${method}_${capitalizedName}_${successSuffix}`, response);
          }, (response) => {
            commit(`${method}_${capitalizedName}_${failureSuffix}`, response);
          });
      };
    });

    return actions;
  }

  return (store) => {
    store.subscribe((mutation) => {
      console.log(mutation);
    });
  };
}
