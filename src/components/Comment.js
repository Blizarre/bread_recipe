import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

var Comment = ({ name, value, update }) => {
  var [id,] = useState(() => { (Math.random() * 1000000).toFixed(2) })
  return (
    <Form.Group>
      <Row>
        <Col className="col-7"><Form.Label htmlFor={id}>{name}</Form.Label></Col>
      </Row>
      <Form.Control
        id={id} as="textarea"
        readOnly={update === undefined ? true : false}
        onChange={(e) => { if (update !== undefined) { update(e.target.value) } }}
        style={{ backgroundColor: "white" }}
        value={value}
        placeholder={"Erreur"}>
      </Form.Control>
    </Form.Group>
  )
}

export default Comment;