<template>
  <section class="container">
    <div>
      <app-logo/>
      <h1 class="title">
        web-worker
      </h1>
      <h2 class="subtitle">
        Nuxt.js project
      </h2>
      <p>{{ notification }}</p>
      <ul class="list">
        <li>Number of Web Workers: {{ workers.length }}</li>
        <li>Number of long Running Workers: {{ longRunningWorkers.length }}</li>
        <li>Number of unused Workers: {{ workers.filter(w => !w.inUse).length }}</li>
      </ul>
      <div class="links">
        <a
          v-if="!needWorkerSetup"
          v-on:click="test"
          class="button button--green">Test Worker</a>
        <a
          v-if="!needWorkerSetup"
          v-on:click="long(2000)"
          class="button button--green">Execute long running Worker</a>
        <a
          v-if="!needWorkerSetup && longRunningWorkers.length"
          v-on:click="freeWorker"
          class="button button--green">Free long running Worker</a>
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
import Vue from 'vue'
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  },
  computed: {
    needWorkerSetup () {
      return this.workers.length === 0
    }
  },
  data () {
    return {
      notification: '',
      workers: [],
      longRunningWorkers: [],
      longIndex: 0
    }
  },
  watch: {
    workers (workers) {
      console.log(workers)
      if (workers.length === 0) this.notification = 'Zero Web Workers - click "Create more Workers"'
    }
  },
  methods: {
    test () {
      console.log(this.workers)
      const worker = this.getWorker()

      if (worker) worker.message({ hello: 'world' })
      else this.notification = 'No more test workers available'
    },
    long (miliseconds) {
      let worker = this.getWorker()

      if (worker) {
        worker.listen(longRunningListener)

        worker.inUse = true
        Vue.set(this.workers, this.workers.indexOf(worker), worker)

        this.longRunningWorkers.push(worker)
      } else {
        worker = this.longRunningWorkers[ this.longIndex++ % this.longRunningWorkers.length]
      }

      worker.message({ action: 'expensive', time: miliseconds })
      // if (worker) worker.message({ action: 'expensive', time: miliseconds })
      // else this.notification = 'No more long running workers available'
    },
    freeWorker () {
      const worker = this.longRunningWorkers.pop()
      worker.unlisten(longRunningListener)
      worker.inUse = false
      this.notification = 'Worker freed'
    },
    removeWorker () {
      if (this.workers.length > 0) {
        const worker = this.workers.pop()
        if (this.longRunningWorkers.indexOf(worker) > -1) this.longRunningWorkers.splice(this.longRunningWorkers.indexOf(worker), 1)
        worker.destroy()
      }
    },
    createWorkers () {
      if (process.browser) {
        for(let i = 0, len = navigator.hardwareConcurrency || 1; i < len; i++) {
          this.workers.push(this.$worker.createWorker())
        }

        this.notification = 'Go nuts!'
      }
    },
    getWorker () {
      return this.workers
        .filter(w => !w.inUse)
        .reduce((a,b) => a || b, null)
    }
  }
}

function longRunningListener (event) {
  console.log(`expensive made ${event.data} loops`)
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

.list {
  text-align: left;
  color: #526488;
  list-style: none;
}
</style>
