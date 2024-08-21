import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Modal, Form, FormGroup, FormLabel, FormControl, Alert } from "react-bootstrap";
import { EintragResource } from "../Resources";
import { getEintrag, updateEintrag, deleteEintrag } from "../backend/api";
import { useLoginContext } from "./LoginContext";
import Eintrag from "./Eintrag";

export function PageEintrag() {
  const [eintrag, setEintrag] = useState<EintragResource>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedEintragData, setEditedEintragData] = useState<EintragResource | null>(null);
  const { eintragId } = useParams<{ eintragId?: string }>();
  const { isLoggedIn } = useLoginContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEintragData = async () => {
      try {
        if (eintragId) {
          const data = await getEintrag(eintragId);
          setEintrag(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Fehler beim Laden des Eintrags vom Server.', error);
        setLoading(false);
      }
    };

    fetchEintragData();
  }, [eintragId]);

  const handleEditClick = () => {
    if (isLoggedIn && eintrag) {
      setIsEditing(true);
      // Setzen der bearbeiteten Eintragsdaten auf die vorhandenen Eintragsdaten
      setEditedEintragData({ ...eintrag });
    } else {
      console.log("Nur eingeloggte Benutzer können Einträge bearbeiten oder Eintrag fehlt.");
    }
  };
  

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEintragData(null);
  };

  const handleDeleteClick = () => {
    if (isLoggedIn) {
      setShowDeleteModal(true);
    } else {
      console.log("Nur eingeloggte Benutzer können Einträge löschen.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEintrag(eintragId!);
      navigate('/');
    } catch (error) {
      console.error('Fehler beim Löschen des Eintrags:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Aktualisieren der bearbeiteten Eintragsdaten
    setEditedEintragData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (editedEintragData) {
        await updateEintrag(eintragId!, editedEintragData);
        setIsEditing(false);
        setEditedEintragData(null);
        // Aktualisieren der Eintragsdaten nach dem Speichern
        const updatedEintrag = await getEintrag(eintragId!);
        setEintrag(updatedEintrag);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Änderungen:', error);
    }
  };

  return (
    <div>
      <h1>Eintrag Details</h1>

      {!isEditing ? (
        <div>
          {/* Anzeigen des Eintrags */}
          {eintrag && <Eintrag eintrag={eintrag} />}
          {isLoggedIn && (
            <>
              <Button onClick={handleEditClick}>Editieren</Button>
              <Button onClick={handleDeleteClick}>Löschen</Button>
            </>
          )}
        </div>
      ) : (
        <div>
          {/* Bearbeitungsformular */}
          <Form>
            <FormGroup>
              <FormLabel>Getränk</FormLabel>
              <FormControl
                type="text"
                name="getraenk"
                value={editedEintragData?.getraenk || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Menge</FormLabel>
              <FormControl
                type="number"
                name="menge"
                value={editedEintragData?.menge || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Kommentar</FormLabel>
              <FormControl
                type="text"
                name="kommentar"
                value={editedEintragData?.kommentar || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <Button onClick={handleSaveChanges}>Speichern</Button>
            <Button onClick={handleCancelEdit}>Abbrechen</Button>
          </Form>
        </div>
      )}

      {/* Modal für Bestätigung des Löschen */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Bestätigung</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie diesen Eintrag wirklich löschen?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            OK
          </Button>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Abbrechen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
