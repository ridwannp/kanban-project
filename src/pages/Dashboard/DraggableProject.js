import React from "react";
import { useDrag } from "react-dnd";
import { Col, Row, Card, Badge, Button } from "react-bootstrap";
import moment from "moment";
import { Trash } from "react-bootstrap-icons";

const DraggableProject = ({ project, onClick, onDelete, userRole }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PROJECT",
    item: { id: project.id },
    canDrag: userRole === "multimedia",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const deadline = project.deadline ? moment(project.deadline) : null;
  const today = moment();
  const remainingDays = deadline ? deadline.diff(today, "days") : null;

  return (
    <Card
      ref={drag}
      className={`mb-2 ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <Card.Header>
        <Row>
          <Col sm={8}>
            <Card.Title>{project.type}</Card.Title>
          </Col>
          <Col sm={4} className="float-right">
            <Card.Text>{project.assignedTo}</Card.Text>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Card.Text style={{ fontWeight: "bold" }}>
              Headline: <br />
              {project.judul}
            </Card.Text>
          </Col>
          <Col md={6}>
            {remainingDays !== null && (
              <Card.Text className="mt-2">
                <Badge bg={remainingDays > 0 ? "success" : "danger"}>
                  {remainingDays > 0
                    ? `Sisa ${remainingDays} hari`
                    : `Lewat ${Math.abs(remainingDays)} hari`}
                </Badge>
              </Card.Text>
            )}
          </Col>
        </Row>
        <br />
        <Card.Text>
          Event:
          <br />
          {project.event}
        </Card.Text>
        <Card.Text>
          Tempat & Tanggal Acara: <br />
          {project.tempat}
          {project.tanggal}
        </Card.Text>
      </Card.Body>
      <Card.Footer
        style={{
          backgroundColor:
            project.priority === "High"
              ? "#f8d7da"
              : project.priority === "Middle"
              ? "#fff3cd"
              : project.priority === "Low"
              ? "#cfe2ff"
              : "#f8f9fa",
        }}
      >
        <Row className="px-2">
          <Col md={10}>
            <div>Deadline: {project.deadline}</div>
          </Col>
          <Col md={2}>
            {project.status === "Todo" && userRole !== "multimedia" && (
              <Button
                className="p-1"
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                <Trash size={18} />
              </Button>
            )}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default DraggableProject;
