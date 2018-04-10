// @flow

import * as React from 'react'
import hoistStatics from 'hoist-non-react-statics'

const getStoresMap = (repository: Repository, ...requestedStores: Array<Class<*>>): { [string]: * } =>
  requestedStores.reduce((base: { [string]: any }, StoreClass: Class<*>) => {
    const { instance, name } = repository.get(StoreClass)

    base[name] = instance

    return base
  }, {})

export class Repository {
  stores: Map<Class<*>, { instance: *, name: string }> = new Map()

  set<T>(key: Class<T>, instance: T, name: string): void {
    if (this.stores.has(key)) {
      throw new Error(`store already registered`)
    }
    this.stores.set(key, { instance, name })
  }

  get<T>(key: Class<T>): { instance: T, name: string } {
    const value = this.stores.get(key)
    if (!value) {
      throw new Error('store not found')
    }
    return { instance: ((value.instance: any): T), name: value.name }
  }

  getInstance<T>(key: Class<T>): T {
    const { instance } = this.get(key)
    return instance
  }
}

export const repository = new Repository()

export const inject = (...requestedStores: Array<Class<*>>) => (Component: React.ComponentType<any>) => {
  const displayName = `inject-${Component.displayName || Component.name}`
  class InjectComponent extends React.Component<any> {
    static displayName = displayName

    render() {
      return <Component {...this.props} {...getStoresMap(repository, ...requestedStores)} />
    }
  }

  hoistStatics(InjectComponent, Component)
  return InjectComponent
}
