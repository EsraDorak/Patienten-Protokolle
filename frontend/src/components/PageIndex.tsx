import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import ProtokollDescription from "./ProtokollDescription";
import { Container, Card } from 'react-bootstrap';
import { ProtokollResource } from "../Resources";
import { getAllePrivateProtokolle, getAlleProtokolle } from "../backend/api";
import { createProtokoll } from "../backend/api"; 
import { useLoginContext } from "./LoginContext";

export function PageIndex() {
  const [protokolle, setProtokolle] = useState<ProtokollResource[]>([]);
  const [loading, setLoading] = useState(true);
  const loginContext = useLoginContext();
  const isLoggedIn = loginContext?.isLoggedIn;

  useEffect(() => {
    const fetchProtokolle = async () => {
      try {
        const data = await getAlleProtokolle();
        setProtokolle(data);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Protokolldaten vom Server.', error);
        setLoading(false);
      }
    };

    fetchProtokolle();
  }, []);

  useEffect(() => {
    const fetchProtokolle = async () => {
      if(isLoggedIn) {
        const data = await getAllePrivateProtokolle();
        setProtokolle(data);
        setLoading(false);
    };
  }
    fetchProtokolle();
  }, [isLoggedIn]);

  const handleNeuesProtokollClick = async () => {
    try {
      // Hier wird die createProtokoll-Funktion aufgerufen
      const newProtokoll = await createProtokoll({
        patient: "Default Patient", // Provide default patient name
        ersteller: "",
        datum: "", // Provide default datum
        public: false,
        closed: false,
      })

      // Nach dem Erstellen die Liste der Protokolle aktualisieren
      setProtokolle([...protokolle, newProtokoll]);
    } catch (error) {
      console.error('Fehler beim Erstellen eines neuen Protokolls.', error);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <h1 className="mb-4" style={{ textAlign: 'left', marginBottom: '20px', fontWeight: 'bold' }}>Alle Protokolle</h1>
      <Link to="/protokoll/neu" className="btn btn-primary mb-3" onClick={handleNeuesProtokollClick}>
        Neues Protokoll
      </Link>
      {protokolle.map((protokoll) => (
        <Card key={protokoll.id} bg="dark" text="light" style={{ marginBottom: '20px', borderRadius: '15px' }}>
          <Card.Body>
            <Link to={`/protokoll/${protokoll.id}`} className="text-light">
              <h5 style={{ fontWeight: 'bold' }}>Protokoll Details</h5>
            </Link>
            <ProtokollDescription protokoll={protokoll} setSelectedProtokoll={() => {}} />
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}