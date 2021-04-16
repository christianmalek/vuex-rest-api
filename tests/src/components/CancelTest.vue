<template>
  <div>
    <h1>Cancellation Tests</h1>

    <div class="test-container">
      <h3>Auto Cancellation</h3>
      <p>
        Automatically cancel a pending request for an action and suspend the pending state until the next request is
        fulfilled or if there's a non-cancellation error. Press the fetch button below repeatedly and check the network
        tab in your dev tools for a detailed look at what's going on.
      </p>
      <code class="cancel-data">{{ autoItemsStr }}</code>
      <button @click="doGetItemsAutoCancel">Fetch Items</button>
    </div>

    <div class="test-container">
      <h3>Manual Cancellation - Using store</h3>
      <p>
        Cancel sources can also be accessed in the store and used manually.
      </p>
      <code class="cancel-data">{{ manualItemsStr }}</code>
      <button @click="manualButtonClick">{{ manualButtonCTA }}</button>
    </div>

    <div class="test-container">
      <h3>Manual Cancellation - Controlled</h3>
      <p>
        If you don't want to use either of the above flows, you can pass in a cancel token with the request config for
        a controlled approach.
      </p>
      <code class="cancel-data">{{ controlledItemsStr }}</code>
      <button @click="controlledButtonClick">{{ controlledButtonCTA }}</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'

const CancelToken = axios.CancelToken

export default {
  data() {
    return {
      controlledSource: null
    }
  },
  computed: {
    ...mapState({
      cancel: state => state.cancel
    }),
    autoItemsStr() {
      return this.formatItemsStr(this.cancel.pending.itemsAuto, this.cancel.itemsAuto)
    },
    manualItemsStr() {
      return this.formatItemsStr(this.cancel.pending.itemsManual, this.cancel.itemsManual)
    },
    controlledItemsStr() {
      return this.formatItemsStr(this.cancel.pending.itemsControlled, this.cancel.itemsControlled)
    },
    manualButtonCTA() {
      return this.formatDynamicCTA(this.cancel.pending.itemsManual)
    },
    manualButtonClick() {
      return (this.cancel.pending.itemsManual) ? this.doCancelGetItemsManual : this.getGetItemsManual
    },
    controlledButtonCTA() {
      return this.formatDynamicCTA(this.cancel.pending.itemsControlled)
    },
    controlledButtonClick() {
      return (this.cancel.pending.itemsControlled) ? this.doCancelGetItemsControlled : this.doGetItemsControlled
    }
  },
  methods: {
    formatDynamicCTA(pending) {
      return (pending) ? 'Cancel Request' : 'Fetch Items'
    },
    formatItemsStr(pending, items) {
      return (pending) ? 'loading...' : JSON.stringify(items, null, 4)
    },
    async doGetItemsAutoCancel() {
      this.getItemsLongRunningAutoCancel({ params: { foo: 'getAuto' } })
    },
    doCancelGetItemsManual() {
      if (this.cancel.source.itemsManual) {
        this.cancel.source.itemsManual.cancel()
      }
    },
    async getGetItemsManual() {
      try {
        await this.getItemsLongRunningManual({ params: { foo: 'getManual' } })
      } catch (e) {
        console.error(e)
      }
    },
    doCancelGetItemsControlled() {
      if (this.controlledSource) {
        this.controlledSource.cancel()
      }
    },
    async doGetItemsControlled() {
      this.controlledSource = CancelToken.source()
      try {
        await this.getItemsLongRunningControlled({
          params: { foo: 'getControlled' },
          cancelToken: this.controlledSource.token
        })
      } catch (e) {
        console.error(e)
      }
    },
    ...mapActions([
      "getItemsLongRunningAutoCancel",
      "getItemsLongRunningManual",
      "getItemsLongRunningControlled"
    ])
  }
}
</script>

<style>
.test-container {
  max-width: 40rem;
  margin: 2rem auto 3rem auto;
}

.test-container:first-of-type {
  margin-top: 4rem;
}

.test-container > h3 {
  margin-bottom: 0.2rem;
}

.test-container > p {
  margin-top: 0;
}

.cancel-data {
  background: dimgrey;
  color: white;
  padding: 1rem;
  display: block;
  margin-bottom: 1rem;
}
</style>
