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
    path: "/long-running"
  })
  .get({
    action: "getItemsLongRunningManual",
    property: "itemsManual",
    path: "/long-running"
  })
  .get({
    action: "getItemsLongRunningControlled",
    property: "itemsControlled",
    path: "/long-running"
  })
  .getStore()

export default cancel
