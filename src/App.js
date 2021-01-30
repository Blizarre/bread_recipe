import React, { useReducer, useEffect } from 'react';
import Ingredient from './components/Ingredient.js';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const defaultState = { comment: "Ma recette par defaut", flour: 750, ratioWater: 70, ratioYeast: 0, ratioSurdough: 4, ratioSalt: 1.8, nbPieces: 3 }

const read_state = () => {
  try {
    const storedState = JSON.parse(localStorage.getItem("state"))
    const defaultCopy = Object.assign({}, defaultState)
    return Object.assign(defaultCopy, storedState)
  } catch (e) {
    return defaultState
  }
}

var App = () => {
  const reducer = (state, action) => {
    var new_state = Object.assign({}, state)
    return Object.assign(new_state, action)
  }

  const [state, setState] = useReducer(reducer, read_state())

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);
 

  var floatState = {}
  for (const key in state) {
    floatState[key] = parseFloat(state[key])
  }

  const surdough = floatState.flour * floatState.ratioSurdough / 100
  // The flour added as an ingredient
  const flourAdded = floatState.flour

  // The flour in the dough (flour added + surdough)
  const doughFlour = floatState.flour + surdough / 2

  // The water required is computed for the whole dough: flour + flour in surdough. And we need to remove the water already added in the surdough
  console.log(`surdough: ${surdough}, totalwater=${(flourAdded + surdough/2) * (floatState.ratioWater / 100)}, surdoughWater=${surdough / 2}`)
  const water = (flourAdded + surdough/2) * (floatState.ratioWater / 100) - surdough / 2
  const salt = doughFlour * floatState.ratioSalt / 100
  const yeast = doughFlour * floatState.ratioYeast / 100
  const pieceWeight = (salt + yeast + water + surdough + flourAdded) / floatState.nbPieces


  return (
    <Row className="justify-content-center">
      <Col md="8" lg="6" xl="5">
        <Form>
          <h2>Parametres</h2>
          <Form.Group className="p-3">
            <Ingredient update={(v) => { setState({ flour: v }) }} value={state.flour} name="Farine" unit="g" />
            <Ingredient update={(v) => { setState({ ratioWater: v }) }} value={state.ratioWater} name="Taux d'hydratation" unit="TH %" />
            <Ingredient update={(v) => { setState({ ratioSalt: v }) }} value={state.ratioSalt} name="Proportion Sel" unit="%" />
            <Ingredient update={(v) => { setState({ ratioYeast: v }) }} value={state.ratioYeast} name="Proportion levure de boulanger" unit="%" />
            <Ingredient update={(v) => { setState({ ratioSurdough: v }) }} value={state.ratioSurdough} name="Proportion levain" unit="%" />
            <Form.Text size="s" className="mb-2">Les proportions des differents ingredients prennent compte de l'eau et de la farine presents dans le levain.</Form.Text>
            <Ingredient update={(v) => { setState({ nbPieces: v }) }} value={state.nbPieces} name="Nombre de pains" unit="" />
          </Form.Group>
          <h2>Ingredients</h2>
          <Form.Group className="p-3">
            <Ingredient value={water} name="Eau" unit="ml" />
            <Ingredient value={yeast} name="Levure de boulanger" unit="g" />
            <Ingredient value={surdough} name="Levain" unit="g" />
            <Ingredient value={salt} name="Sel" unit="g" />
            <Ingredient value={pieceWeight} name="Poids par pain" unit="g" />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}

export default App;
