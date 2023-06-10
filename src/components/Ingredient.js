import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

var Ingredients = ({ name, value, unit, update }) => {
  var [id,] = useState(() => { (Math.random() * 1000000).toFixed(2) })

  var floatValue, strValue;

  if (typeof (value) == typeof (0)) {
    floatValue = value
    strValue = floatValue.toFixed(1)
  } else {
    floatValue = parseFloat(value)
    strValue = value
  }

  const isNumber = !isNaN(floatValue)

  return (
    <Form.Group>
      <Row>
        <Col className="col-7"><Form.Label htmlFor={id}>{name}</Form.Label></Col>
        <Col className="col-2">{unit ? <Form.Text size="s">({unit})</Form.Text> : ""}</Col>
      </Row>
      <Form.Control
        id={id} type="input"
        readOnly={update === undefined ? true : false}
        onChange={(e) => { if (update !== undefined) { update(e.target.value) } }}
        style={{ backgroundColor: isNumber ? "white" : "orange" }}
        value={isNumber ? strValue : ""}
        placeholder={"Erreur"}>
      </Form.Control>
    </Form.Group>
  )
}

export default Ingredients;