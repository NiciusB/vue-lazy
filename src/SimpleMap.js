// Badly implemented Map to avoid ECMAScript 5
// Operations are O(n) instead of O(1)

export default function SimpleMap () {
  const __mapKeysData__ = []
  const __mapValuesData__ = []
  this.get = function (key) {
    const index = __mapKeysData__.indexOf(key)
    if (index === -1) return null
    return __mapValuesData__[index]
  }
  this.has = function (key) {
    const index = __mapKeysData__.indexOf(key)
    return index !== -1
  }
  this.set = function (key, data) {
    const index = __mapKeysData__.indexOf(key)
    if (index === -1) {
      __mapKeysData__.push(key)
      __mapValuesData__.push(data)
    } else {
      __mapKeysData__[index] = key
      __mapValuesData__[index] = data
    }
  }
  this.delete = function (key) {
    const index = __mapKeysData__.indexOf(key)
    if (index === -1) return false
    __mapKeysData__.splice(index, 1)
    __mapValuesData__.splice(index, 1)
  }
}
