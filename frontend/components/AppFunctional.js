import React, {useState} from 'react'
import * as yup from 'yup'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialX = 2;
const initialY = 2;

const schema = 
yup.object()
.shape({
  formValue: yup
  .string()
  .email('Ouch: email must be a valid email')
  .required('Ouch: email is required')
  .notOneOf(['foo@bar.baz'],'foo@bar.baz failure #71')
})

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [x, setX] = useState(initialX)
  const [y, setY] = useState(initialY)
  const [steps, setSteps] = useState(initialSteps)
  const [xy, setXy] = useState(initialIndex)
  const [message, setMessage] = useState(initialMessage)
  const [formValues, setFormValues] = useState('')

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${x}, ${y})`);
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setX(initialX)
    setY(initialY)
    setSteps(initialSteps)
    setXy(initialIndex)
    setMessage(initialMessage)
    setFormValues('')
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'left'){
      if (x === 1){
        setMessage("You can't go left")
        return xy
      }
      setX(x - 1)
      setXy(xy - 1)
      setSteps(steps + 1)
      setMessage(initialMessage)
    }
    if(direction === 'down'){
      if (y === 3){
        setMessage("You can't go down")
        return xy
      }
      setY(y + 1)
      setXy(xy + 3)
      setSteps(steps + 1)
      setMessage(initialMessage)
    }
    if(direction === 'right'){
      if (x === 3){
        setMessage("You can't go right")
        return xy
      }
      setX(x + 1)
      setXy(xy + 1)
      setSteps(steps + 1)
      setMessage(initialMessage)
    }
    if(direction === 'up'){
      if (y === 1){
        setMessage("You can't go up")
        return xy
      }
      setY(y - 1)
      setXy(xy - 3)
      setSteps(steps + 1)
      setMessage(initialMessage)
    }

  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setFormValues(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    validate('formValue', formValues);
    setFormValues('')

  }

  function validate( name, value ){
    yup.reach(schema, name)
    .validate(value)
    .then(() => post())
    .catch(err => setMessage(err.errors[0]))
  }

  function post() {
    const payload = {
      "x": x,
      "y": y,
      "steps": steps,
      "email": formValues
    }

    axios.post('http://localhost:9000/api/result', payload)
    .then((res) => {
      console.log(res)
      setMessage(res.data.message)})
      .finally(setFormValues(''))
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({x},{y})</h3>
        <h3 id="steps">{`You moved ${steps} ${steps === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === xy ? ' active' : ''}`}>
              {idx === xy ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => move(e.target.id)} id="left">LEFT</button>
        <button onClick={(e) => move(e.target.id)} id="up">UP</button>
        <button onClick={(e) => move(e.target.id)} id="right">RIGHT</button>
        <button onClick={(e) => move(e.target.id)} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input value={formValues} onChange={(e) => onChange(e)} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
