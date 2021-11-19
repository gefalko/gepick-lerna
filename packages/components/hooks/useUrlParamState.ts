import { isArray } from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'
import { History } from 'history'

interface IParam<T> {
  key: string
  value: T
}

const appendParams = (query: URLSearchParams, param: IParam<string[]>) => {
  query.delete(param.key)
  param.value.forEach((value) => {
    query.append(param.key, value)
  })
}

const addUrlSearchParam = (history: History, params: IParam<string | string[]>[], replace?: boolean) => {
  const query = new URLSearchParams(history.location.search)
  params.forEach((param: IParam<string | string[]>) => {
    if (isArray(param.value)) {
      appendParams(query, param as IParam<string[]>)
    } else {
      query.set(param.key, param.value)
    }
  })
  if (replace) {
    history.replace({ ...history.location, search: query.toString() })
  } else {
    history.push({ ...history.location, search: query.toString() })
  }
}

export const removeUrlSearchParm = (history: History, params: string | string[]) => {
  const query = new URLSearchParams(history.location.search)

  if (isArray(params)) {
    params.forEach((param) => query.delete(param))
  } else {
    query.delete(params)
  }

  const location = { ...history.location, search: query.toString() }

  history.replace(location)
}

function useUrlParamState(key: string, initValue?: string): [string | null, (value: string | null) => void] {
  const history = useHistory()
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const param = urlParams.get(key)

  const setValue = (value: string | null) => {
    if (value != null) {
      addUrlSearchParam(history, [{ key, value }])
    } else {
      removeUrlSearchParm(history, [key])
    }
  }

  if (!param && initValue) {
    setValue(initValue)
  }

  return [param ?? initValue ?? null, setValue]
}

export default useUrlParamState
