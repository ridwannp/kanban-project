import React from "react";
import { useDrag } from "react-dnd";
import { Col, Row, Card } from "react-bootstrap";

const DraggableProject = ({ project, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PROJECT",
    item: { id: project.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      className={`mb-2 ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <Card.Header>
        <Row>
          <Col sm={8}>
            <Card.Title>{project.judul}</Card.Title>
          </Col>
          <Col sm={4} className="float-right">
            <Card.Text>{project.assignedTo}</Card.Text>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Text>{project.type}</Card.Text>
        <Card.Text>{project.event}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Card.Text>Deadline: {project.deadline}</Card.Text>
      </Card.Footer>
    </Card>
  );
};

export default DraggableProject;
