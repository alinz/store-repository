// @flow

import * as React from 'react'

const init = () => {
  const stores: Map<Class<*>, { instance: *, name: string }> = new Map()

  const getStoresMap = (...requestedStores: Array<Class<*>>): { [string]: * } =>
    requestedStores.reduce((base: { [string]: any }, StoreClass: Class<*>) => {
      const { instance, name } = repository.get(StoreClass)

      base[name] = instance

      return base
    }, {})

  const repository = {
    set: function<T>(key: Class<T>, instance: T, name: string): void {
      if (stores.has(key)) {
        throw new Error(`store already registered`)
      }
      stores.set(key, { instance, name })
    },
    get: function<T>(key: Class<T>): { instance: T, name: string } {
      const value = stores.get(key)
      if (!value) {
        throw new Error('store not found')
      }
      return { instance: ((value.instance: any): T), name: value.name }
    }
  }

  const inject = (...requestedStores: Array<Class<*>>) => (Component: React.ComponentType<any>) => (props: {
    [string]: *
  }) => <Component {...props} {...getStoresMap(...requestedStores)} />

  return {
    repository,
    inject
  }
}

export default init
