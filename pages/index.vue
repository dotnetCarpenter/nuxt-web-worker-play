<template>
  <section class="container">
    <div>
      <app-logo/>
      <h1 class="title">
        web-worker
      </h1>
      <h2 class="subtitle">
        {{ this.$worker.workers.length ? 'Nuxt.js project' : 'No more Web Workers to remove' }}
      </h2>
      <p>{{ $worker.workers.length }}</p>
      <div class="links">
        <a
          v-if="needWorkerSetup"
          v-on:click="test"
          class="button button--green">Test Worker</a>
        <a
          v-if="needWorkerSetup"
          v-on:click="long(1000)"
          class="button button--green">Execute long running Worker</a>
        <a
          v-on:click="removeWorker"
          class="button button--grey">Remove Web Worker</a>
        <a
          v-on:click="createWorkers"
          class="button button--grey">Create more Workers</a>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      needWorkerSetup: true,
      testWorkers: [],
      testIndex: 0,
      longRunningWorkers: [],
      longIndex: 0
    }
  },
  methods: {
    test () {
      if (this.needWorkerSetup) return

      let worker = this.getWorker()

      // if (!worker)

      worker.message({ hello: 'world' })
    },
    long (miliseconds) {
      if (this.needWorkerSetup) this.setupWorkers()

      const worker = this.getWorker()
      worker.message({ action: 'expensive', time: miliseconds })
    },
    removeWorker () {
      if (this.$worker.workers.length > 0) {
        this.$worker.remove()
      } else {
        this.needWorkerSetup = true
      }
    },
    createWorkers () {
      if (process.browser && this.needWorkerSetup) {
        for(let i = 0, len = navigator.hardwareConcurrency || 1; i < len; i++) {
          this.$worker.createWorker()
        }

        this.needWorkerSetup = false
      }
    },
    getWorker () {
      let i = 0
      while (i < this.$worker.workers.length) {
        i++
        if (!this.$worker.workers[i].inUse) return this.$worker.workers[i]
      }
      return null
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
