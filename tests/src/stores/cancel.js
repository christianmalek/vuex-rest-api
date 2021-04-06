import Vapi from "vuex-rest-api"

const cancel = new Vapi({
  baseURL: "/api/cancel",
  queryParams: true,
  state: {
    itemsAuto: [],
    itemsManual: [],
    itemsControlled: []
  }
})
  .get({
    autoCancel: true,
    action: "getItemsLongRunningAutoCancel",
    property: "itemsAuto",
    path: "/long-running",
    onCancel: (state, payload) => {
      console.info("auto cancellation", state, payload)
    }
  })
  .get({
    action: "getItemsLongRunningManual",
    property: "itemsManual",
    path: "/long-running",
    onCancel: (state, payload) => {
      console.info("manual cancellation", state, payload)
    }
  })
  .get({
    action: "getItemsLongRunningControlled",
    property: "itemsControlled",
    path: "/long-running",
    onCancel: (state, payload) => {
      console.info("controlled cancellation", state, payload)
    }
  })
  .getStore()

export default cancel
