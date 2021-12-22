/*This Custom Hook provides Form Change detection functionality to any Component,the receiving component then can use the formChanged 
state supplied by this hook to make buttons disabled or show Discard Changes dialog based on whether changes have been made 
or not.

This provides an object with 5 fields -
form -  the form state object
setForm - Method to set form state
formChanged - True if form is changed,false if not
resetInitialForm - Method which takes a form object just before we want to detect changes from,all
                       further change detections for current form will be made by comparing new form sting to
                       this inital string 
*/

import {useState, useRef, useEffect} from 'react'

//Method to convert empty String values to null,so that while comparing ,there is a standard
//and false change detections do not occur
function emptyStringToNull(form) {
  for (let [key, value] of Object.entries(form)) {
    form[key] = !value ? null : value
  }
  return form
}

/**
 * @param {*} emptyFormState
 * @param {function?} validationFunction -- this function should be invoked with a form object and return an array of invalid prop names
 * @return {{
      form: *,
      formChanged: boolean,
      resetInitialForm: function,
      setForm: function,
      validateForm: function,
      invalidItems: function,
    }}
 */
function useFormChanged(emptyFormState, validationFunction) {
  let initialFormString = useRef(JSON.stringify(emptyStringToNull({...emptyFormState})))
  const [form, setFormInternal] = useState(emptyFormState)
  const [formChanged, setFormChanged] = useState(false)
  const [invalidItems, setInvalidItems] = useState([])

  const resetInitialForm = (initialForm, callback) => {
    let newForm = {...initialForm}
    initialFormString.current = JSON.stringify(emptyStringToNull(newForm))
    setInvalidItems([])
    setFormInternal(newForm)

    // this is here so that we give the implementing component time to recognize the formChanged is now false
    // before invoking the callback.
    setTimeout(callback, 0)
  }

  // this allows us to update only a single prop at a time (similar to how setState({...}) works)
  const setForm = newObj => {
    setFormInternal({...form, ...newObj})
  }

  /**
   * returns true IFF the entire form is valid
   * @returns {boolean}
   */
  const validateForm = () => {
    if (typeof validationFunction !== 'function') {
      throw new Error('Cannot validate form, missing validation function')
    }

    let invalid = validationFunction(form)
    setInvalidItems(invalid)

    return invalid.length === 0
  }

  useEffect(() => {
    let updatedForm = JSON.stringify(emptyStringToNull({...form}))
    setFormChanged(updatedForm !== initialFormString.current)
  }, [form])

  return {
    form,
    setForm,
    formChanged,
    validateForm,
    invalidItems,
    resetInitialForm,
  }
}

/**
 * @param {*} validationObject - every key of this object should match a required field on the form, and the value should be a function that returns true IFF the form value is valid for that prop
 * @returns {function(*): [string, unknown][]}
 * @constructor
 */
useFormChanged.PropLevelValidation = function(validationObject) {
  return form => {
    return Object.entries(validationObject)
      .filter(([prop, validator]) => {
        return !validator(form[prop], form)
      })
      .map(([key]) => key)
  }
}

export default useFormChanged

// ------------------------------------------------------------------------------------------
// TODO: Maybe these should go into their own files??
// VALIDATORS
// all validators should be invoked with 2 arguments:
//   1. The value they're validating
//   2. The form they belong to (in case validation is relative to other values)
// ------------------------------------------------------------------------------------------

/**
 * @param {Array<function>} validators
 * @returns {(function(*))|*}
 * @constructor
 */
export function MuxValidator(validators) {
  // every will break as soon as one does not validate, so the order is important
  return (value, form) => validators.every(validator => validator(value, form))
}

// true IFF the value is non empty or 0
export const NonEmptyValidator = value => !!value || value === 0

// true IFF the value is a number
export const NumberValidator = value => !isNaN(parseInt(value))

// true IFF the value is an array with at least 1 element
export const NonEmptyArrayValidator = value => Array.isArray(value) && value.length > 0

// true IFF the value is a date object
export const DateObjectValidator = value => value instanceof Date

// will return a date object validator that compares the value to another form value and returns true IFF this date is greater than that other date
export function ConstructGreaterThanOtherDateValidator(otherPropName) {
  return MuxValidator([DateObjectValidator, (v, form) => v > form[otherPropName]])
}

// true IFF the value is an object with the keys we expect an S3 object to have (key, bucket, region)
export const S3ObjectValidator = value => typeof value === 'object' && value.key && value.bucket && value.region

// true IFF the value is a date object that is strictly in the future
export const FutureDateValidator = MuxValidator([DateObjectValidator, v => v.getTime() > Date.now()])
