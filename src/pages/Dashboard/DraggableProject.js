import React from "react";
import { useDrag } from "react-dnd";
import { Col, Row, Card, Badge, Button } from "react-bootstrap";
import moment from "moment";
import { Pencil, Trash, Calendar, GeoAlt, Person } from "react-bootstrap-icons";

const DraggableProject = ({ project, onClick, onEdit, onDelete, userRole }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PROJECT",
    item: { id: project.id, currentStatus: project.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const isAuthorizedToEdit = userRole === "sales" || userRole === "manager";

  const deadline = project.deadline ? moment(project.deadline) : null;
  const today = moment();
  const remainingDays = deadline ? deadline.diff(today, "days") : null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "danger";
      case "Middle": return "warning";
      case "Low": return "info";
      default: return "secondary";
    }
  };

  return (
    <div
      ref={drag}
      className={`kanban-card ${isDragging ? "is-dragging" : ""}`}
      onClick={onClick}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <Badge bg="secondary" className="card-badge">{project.type}</Badge>
        <Badge bg={getPriorityColor(project.priority)} className="card-badge text-white">
          {project.priority || "Normal"}
        </Badge>
      </div>

      <h6 className="card-title">{project.judul}</h6>
      
      <div className="card-meta">
        <Person size={14} className="me-1" /> {project.assignedTo}
      </div>

      {project.event && (
        <div className="card-meta">
          <strong>Event:</strong> {project.event}
        </div>
      )}

      {(project.tempat || project.tanggal) && (
        <div className="card-meta">
          <GeoAlt size={14} className="me-1" />
          {project.tempat} {project.tanggal}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <div className="card-meta m-0">
          <Calendar size={14} className="me-1" />
          {project.deadline}
        </div>
        
        <div className="d-flex gap-1">
          {isAuthorizedToEdit && (
            <Button
              variant="light"
              size="sm"
              className="p-1 text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project.taskId);
              }}
            >
              <Pencil size={16} />
            </Button>
          )}
          
          {project.status === "Todo" && userRole !== "multimedia" && (
            <Button
              variant="light"
              size="sm"
              className="p-1 text-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      </div>

      {remainingDays !== null && (
        <div className="mt-2 text-center">
           <Badge bg={remainingDays > 0 ? "success" : "danger"} className="w-100">
            {remainingDays > 0
              ? `Sisa ${remainingDays} hari`
              : `Lewat ${Math.abs(remainingDays)} hari`}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default DraggableProject;
