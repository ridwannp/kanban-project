import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { db } from "../services/firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { Col, Row, Button, Form, Modal, ButtonGroup } from "react-bootstrap";
import Column from "./Column";
import ModalComment from "./ModalComment";

function Dashboard() {
  const categories = ["Todo", "Progress", "Review", "Done"];
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterAssignment, setFilterAssignment] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [sortPriority, setSortPriority] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "task"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    });
    return unsubscribe;
  }, []);

  const handleAddProject = async () => {
    const docRef = await addDoc(collection(db, "task"), {
      ...newProject,
      taskId: "",
      status: "Todo",
    });
    await updateDoc(doc(db, "task", docRef.id), {
      taskId: docRef.id,
    });
    setProjects([
      ...projects,
      { taskId: docRef.id, ...newProject, status: "Todo" },
    ]);
    setNewProject({
      priority: "",
      type: "",
      assignedTo: "",
      event: "",
      judul: "",
      narasumber: "",
      materi: "",
      tanggaltempat: "",
      benefitHarga: "",
      giveaway: "",
      pendaftaran: "",
      deadline: "",
      komentar: "",
    });
    setShowModal(false);
  };

  const handleProjectClick = (project) => {
    setSelectedTaskId(project.taskId);
    setSelectedProject(project);
  };

  const assignmentOptions = {
    Video: [
      { label: "Video Editor: Robil", value: "Robil" },
      { label: "Video Editor: Wahyu", value: "Wahyu" },
    ],
    Design: [
      { label: "Desain Grafis: Hilmi", value: "Hilmi" },
      { label: "Desain Grafis: Caroline", value: "Caroline" },
    ],
  };

  useEffect(() => {
    handleFilterAndSort();
  }, [filterAssignment, filterTitle, sortPriority, projects]);

  const handleFilterAndSort = () => {
    let filtered = projects;

    if (filterAssignment) {
      filtered = filtered.filter(
        (project) => project.assignedTo === filterAssignment
      );
    }

    if (filterTitle) {
      filtered = projects.filter((project) =>
        project?.judul?.toLowerCase().includes(filterTitle?.toLowerCase())
      );
    }
    const priorityOrder = { Low: 1, Middle: 2, High: 3 };
    if (sortPriority) {
      filtered = filtered.sort((a, b) => {
        return sortPriority === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }
    setFilteredProjects(filtered);
  };

  return (
    <div className="container mt-4">
      <DndProvider backend={HTML5Backend}>
        <Row className="my-3">
          <Col sm={4}>
            <h2>Project Board</h2>
          </Col>
          <Col sm={8}>
            <Button
              className="my-3"
              style={{ float: "right" }}
              onClick={() => setShowModal(true)}
            >
              Add Project
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Form.Group className="mb-3">
              <Form.Label>Search by Judul</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search title..."
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col sm={4}>
            <Form.Group className="mb-3">
              <Form.Label>Sort by Priority</Form.Label>
              <Form.Select
                value={sortPriority}
                onChange={(e) => setSortPriority(e.target.value)}
              >
                <option value="">None</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group className="mb-3">
              <Form.Label>Filter by Assignment</Form.Label>
              <Form.Select
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
              >
                <option value="">All</option>
                <option value="Robil">Video Editor: Robil</option>
                <option value="Wahyu">Video Editor: Wahyu</option>
                <option value="Hilmi">Desain Grafis: Hilmi</option>
                <option value="Caroline">Desain Grafis: Caroline</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Modal add new project */}
        <Modal
          className="custom-modal"
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Project Type</Form.Label>
                    <Form.Select
                      required
                      value={newProject.type}
                      onChange={(e) =>
                        setNewProject({ ...newProject, type: e.target.value })
                      }
                    >
                      <option>Pilih Project Type</option>
                      <option value="Video">Video</option>
                      <option value="Design">Design</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Assignment</Form.Label>
                    <Form.Select
                      required
                      value={newProject.assignedTo}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          assignedTo: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih Assignment</option>
                      {assignmentOptions[newProject.type]?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Event Project</Form.Label>
                    <Form.Select
                      required
                      value={newProject.event}
                      onChange={(e) =>
                        setNewProject({ ...newProject, event: e.target.value })
                      }
                    >
                      <option>Pilih Event Project</option>
                      <option value="revolution">
                        Sales & Marketing Revolution
                      </option>
                      <option value="Property Rich Revolution">
                        Property Rich Revolution
                      </option>
                      <option value="Life Revolution">Life Revolution</option>
                      <option value="Business Revolution">
                        Business Revolution
                      </option>
                      <option value="Traine For Firewalk Trainer">
                        Traine For Firewalk Trainer
                      </option>
                      <option value="Superteen Bootcamp">
                        Superteen Bootcamp
                      </option>
                      <option value="Konten Sosmed TDW">
                        Konten Sosmed TDW
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Judul Headline</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={newProject.headline}
                      onChange={(e) =>
                        setNewProject({ ...newProject, judul: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Narasumber</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newProject.narasumber}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          narasumber: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="m-2">
                <Form.Label>Materi yang akan dipelajari</Form.Label>
                <Form.Control
                  as="textarea"
                  required
                  rows={4}
                  value={newProject.materi}
                  onChange={(e) =>
                    setNewProject({ ...newProject, materi: e.target.value })
                  }
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Tempat Acara</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newProject.tempat}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          tempat: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Tanggal Acara</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={newProject.tanggal}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          tanggal: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="m-2">
                <Form.Label>Benefit dan Harga Promo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={newProject.benefitHarga}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      benefitHarga: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="m-2">
                <Form.Label>Give Away</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={newProject.giveaway}
                  onChange={(e) =>
                    setNewProject({ ...newProject, giveaway: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="m-2">
                <Form.Label>Info Link Pendaftaran & Contact</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={newProject.pendaftaran}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      pendaftaran: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Row>
                <Col>
                  <Col>
                    <Form.Group className="m-2">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        required
                        value={newProject.priority}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option>Pilih Priority</option>
                        <option value="Low">Low</option>
                        <option value="Middle">Middle</option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Col>
                <Col>
                  <Form.Group className="m-2">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={newProject.deadline}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="m-2">
                <Form.Label>Tambahan Komentar</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={newProject.komentar}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      komentar: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddProject}>
              Add Project
            </Button>
          </Modal.Footer>
        </Modal>
        {/* selesai */}

        <ModalComment
          taskId={selectedTaskId}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <Row>
          {categories.map((category) => (
            <Col key={category} md={3}>
              <Column
                category={category}
                projects={filteredProjects}
                setProjects={setProjects}
                onProjectClick={handleProjectClick}
              />
            </Col>
          ))}
        </Row>
      </DndProvider>
    </div>
  );
}

export default Dashboard;
