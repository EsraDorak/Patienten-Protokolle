import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Eintrag from "./Eintrag";
import { LoadingIndicator } from "./LoadingIndicator";
import ProtokollDescription from "./ProtokollDescription";
import {Container, Row, Col, Card, Button, Modal, Form, FormGroup, FormLabel, FormControl, Alert, FormCheck,} from "react-bootstrap";
import { EintragResource, ProtokollResource } from "../Resources";
import { getAlleEintraege, getProtokoll, createProtokoll, updateProtokoll, deleteProtokoll } from "../backend/api";
import { useLoginContext } from "./LoginContext";

function PageProtokoll() {
  const { protokollId } = useParams<{ protokollId?: string }>();
  const [protokoll, setProtokoll] = useState<ProtokollResource | null>(null);
  const [eintraege, setEintraege] = useState<EintragResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newProtokollData, setNewProtokollData] = useState({
    patient: "",
    ersteller: "",
    datum: "",
    public: false,
    closed: false,
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const { isLoggedIn, logout } = useLoginContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (protokollId) {
          const protokollData = await getProtokoll(protokollId);
          setProtokoll(protokollData);

          const eintraegeData = await getAlleEintraege(protokollId);
          setEintraege(eintraegeData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten vom Server.', error);
        setError('Fehler beim Laden der Daten vom Server.');
        setLoading(false);
      }
    };

    fetchData();
  }, [protokollId]);
  useEffect(() => {
    if (!isEditing && protokollId) {
      const reloadProtokoll = async () => {
        try {
          const protokollData = await getProtokoll(protokollId);
          setProtokoll(protokollData);
        } catch (error) {
          console.error('Fehler beim Laden des Protokolls nach dem Bearbeiten.', error);
        }
      };

      reloadProtokoll();
    }
  }, [isEditing, protokollId]);
  const handleEditClick = () => {
    if (isLoggedIn) {
      setIsEditing(true);
      setNewProtokollData((prevData) => ({
        ...prevData,
        patient: protokoll?.patient || "",
        ersteller: protokoll?.ersteller || "",
        datum: protokoll?.datum || "",
        public: protokoll?.public || false,
        closed: protokoll?.closed || false,
      }));
    } else {
      console.log("Nur eingeloggte Benutzer können Protokolle bearbeiten.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleDeleteClick = () => {
    if (isLoggedIn) {
      setShowDeleteModal(true);
    } else {
      console.log("Nur eingeloggte Benutzer können Protokolle löschen.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProtokoll(protokollId!);
      navigate('/');
    } catch (error) {
      console.error('Fehler beim Löschen des Protokolls:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewProtokollData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setNewProtokollData((prevData) => ({ ...prevData, [name]: checked }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: { [key: string]: string } = {};

    if (newProtokollData.patient.trim().length < 3) {
      errors.patient = 'Der Name des Patienten muss mindestens 3 Zeichen lang sein.';
    }

    if (Object.keys(errors).length === 0) {
      try {
        if (protokollId === 'neu') {
          const newProtokoll = await createProtokoll(newProtokollData);
          navigate(`/protokoll/${newProtokoll.id}`);
        } else {
          await updateProtokoll({ ...newProtokollData, id: protokollId });
          setIsEditing(false);
          setValidationErrors({});
        }
      } catch (error) {
        console.error('Fehler beim Erstellen oder Bearbeiten des Protokolls:', error);
        setError('Fehler beim Erstellen oder Bearbeiten des Protokolls:');
      }
    } else {
      setValidationErrors(errors);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="bg-light">
      <Row className="mt-4">
        <Col>
          {protokoll && (
            <Card bg="dark" text="light" style={{ marginBottom: '20px', borderRadius: '15px' }}>
              <Card.Body>
                {!isEditing ? (
                  <ProtokollDescription protokoll={protokoll} setSelectedProtokoll={() => {}} />
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <FormLabel>Patient</FormLabel>
                      <FormControl
                        type="text"
                        name="patient"
                        value={newProtokollData.patient}
                        onChange={handleInputChange}
                      />
                      {validationErrors.patient && <Alert variant="danger">{validationErrors.patient}</Alert>}
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Datum</FormLabel>
                      <FormControl
                        type="text"
                        name="datum"
                        value={newProtokollData.datum}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormCheck
                        type="checkbox"
                        label="öffentlich"
                        name="public"
                        checked={newProtokollData.public}
                        onChange={handleCheckboxChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormCheck
                        type="checkbox"
                        label="geschlossen"
                        name="closed"
                        checked={newProtokollData.closed}
                        onChange={handleCheckboxChange}
                      />
                    </FormGroup>
                    <Button type="submit" variant="success">
                      Speichern
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Abbrechen
                    </Button>
                  </Form>
                )}
                {!isEditing && isLoggedIn && (
                  <div>
                    <Button variant="primary" onClick={handleEditClick}>
                      Editieren
                    </Button>
                    <Button variant="danger" onClick={handleDeleteClick}>
                      Löschen
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row className="mt-4 bg-light">
        <Col>
          <h2>Einträge</h2>
          <Link to={`/protokoll/${protokollId}/eintrag/neu`} className="btn btn-primary">
            Neuer Eintrag
          </Link>

          <ul className="list-group">
            {eintraege.map((eintrag) => (
              <li key={eintrag.id} className="list-group-item">
                <Eintrag eintrag={eintrag} />
                <Link to={`/eintrag/${eintrag.id}`} className="btn btn-primary">
                  Zum Eintrag
                </Link>
              </li>
            ))}
          </ul>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Bestätigung</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie dieses Protokoll wirklich löschen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmDelete}>
            OK
          </Button>
          <Button variant="danger" onClick={handleCancelDelete}>
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PageProtokoll;
