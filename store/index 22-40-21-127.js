export const state = () => ({
  needWorkerSetup: true,
  currentWorkerIndex: 0
})

export const mutations = {
  workerSetupDone (state) {
    state.needWorkerSetup = false
  },
  workerIndex (state) {
    state.currentWorkerIndex += 1
  }
}

export const actions = {
  setupWorkers ({ getters, commit }) {
    if (process.browser && getters.needWorkerSetup) {
      for(let i = 0, len = navigator.hardwareConcurrency || 1; i < len; i++) {
        this.$worker.createWorker()
      }

      commit('workerSetupDone')
    }
  },
  worker ({ dispatch, commit, getters }) {
    if (process.server) return // web workers are only available client-side

    dispatch('setupWorkers')

    const worker = this.$worker.workers[ getters.workerIndex % this.$worker.workers.length ]

    if (!worker.inUse) {
      worker.listen(event => {
        console.log(event)
      })
      worker.error(error => { console.error(error) })
      worker.inUse = true
    }

    worker.message({ hello: 'world' })

    commit('workerIndex')

    console.log(this.$worker.workers)
  },
  expensive ({ dispatch, commit, getters }, payload) {
    if (process.server) return // web workers are only available client-side

    dispatch('setupWorkers')

    const worker = this.$worker.workers[ getters.workerIndex % this.$worker.workers.length ]

    if (!worker.inUse) {
      worker.listen(event => {
        console.log(`expensive made ${event.data} loops`)
      })
      worker.error(error => { console.error(error) })
      worker.inUse = true
    }

    worker.message({ action: 'expensive', time: payload })

    commit('workerIndex')

    console.log(this.$worker.workers)
  }
}

export const getters = {
  needWorkerSetup (state) {
    return state.needWorkerSetup
  },
  workerIndex (state) {
    return state.currentWorkerIndex
  }
}
