import React from 'react'
import axios from 'axios';
import * as yup from 'yup';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const initialX = 2;
const initialY = 2;
const initialFormValues = ''

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

const schema = 
yup.object()
.shape({
  formValue: yup
  .string()
  .email('Ouch: email must be a valid email')
  .required('Ouch: email is required')
  .notOneOf(['foo@bar.baz'],'foo@bar.baz failure #71')
})


export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor (){
    super();
    this.state = {
      x: initialX,
      y: initialY,
      steps: initialSteps,
      xy: initialIndex,
      message: initialMessage,
      formValues: ''
    };
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${this.state.x}, ${this.state.y})`);
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      x: initialX,
      y: initialY,
      steps: initialSteps,
      xy: initialIndex,
      message: initialMessage,
      formValues: initialFormValues
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "left"){
      if (this.state.x === 1){
        return ({"x": this.state.x, "y": this.state.y});
      } else return ({"x": this.state.x - 1, "y": this.state.y, "steps": this.state.steps + 1, "xy": this.state.xy - 1});
    }
    if (direction === "right"){
      if (this.state.x === 3){
        return ({"x": this.state.x, "y": this.state.y});
      } else return ({"x": this.state.x + 1, "y": this.state.y, "steps": this.state.steps + 1, "xy": this.state.xy + 1});
    }
    if (direction === "up"){
      if (this.state.y === 1){
        return ({"x": this.state.x, "y": this.state.y});
      } else return ({"x": this.state.x , "y": this.state.y - 1, "steps": this.state.steps + 1, "xy": this.state.xy - 3});
    }
    if (direction === "down"){
      if (this.state.y === 3){
        return ({"x": this.state.x, "y": this.state.y});
      } else return ({"x": this.state.x , "y": this.state.y + 1, "steps": this.state.steps + 1, "xy": this.state.xy + 3});
    }

  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let moveCords = this.getNextIndex(evt.target.id);
    if(`(${moveCords.x}, ${moveCords.y})` === this.getXY()){
      return this.setState({message: `You can't go ${evt.target.id}`});
    }
    this.setState({...this.state,
      x: moveCords.x,
      y: moveCords.y,
      steps: moveCords.steps,
      xy: moveCords.xy,
      message: initialMessage,
    })
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({formValues: evt.target.value});
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    this.validate('formValue', this.state.formValues)
    
  }
   

  validate = ( name, value ) => {
    yup.reach(schema, name)
    .validate(value)
    .then(() => this.post())
    .catch(err => this.setState({message: err.errors[0]}))
    
  }

  post = () => {
    const payload = {
      "x": this.state.x,
      "y": this.state.y,
      "steps": this.state.steps,
      "email": this.state.formValues
    }

    axios.post('http://localhost:9000/api/result', payload)
    .then((res) => {
      console.log(res)
      this.setState({message: res.data.message})})
      .finally(this.setState({formValues: initialFormValues}))
  }
  
  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.state.x},{this.state.y})</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.xy ? ' active' : ''}`}>
                {idx === this.state.xy ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={(e) => this.move(e)} id="left">LEFT</button>
          <button onClick={(e) => this.move(e)} data-testid="up" id="up">UP</button>
          <button onClick={(e) => this.move(e)} id="right">RIGHT</button>
          <button onClick={(e) => this.move(e)} id="down">DOWN</button>
          <button data-testid="reset" onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input id="email" type="email" placeholder="type email" onChange={(e) => this.onChange(e)} value={this.state.formValues}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
