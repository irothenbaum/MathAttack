class Serializable {
  static createFromPlainObject() {
    throw new Error('Must be overridden')
  }

  toPlainObject() {
    return Object.entries(this).reduce((obj, tuple) => {
      console.log(tuple)
      obj[tuple[0]] =
        tuple[1] instanceof Serializable
          ? tuple[1].toPlainObject()
          : typeof tuple[1] === 'object' && !!tuple[1]
          ? JSON.parse(JSON.stringify(tuple[1]))
          : tuple[1]
      return obj
    }, {})
  }
}

export default Serializable
