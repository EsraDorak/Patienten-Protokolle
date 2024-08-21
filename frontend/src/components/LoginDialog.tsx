import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useLoginContext } from './LoginContext';

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
}

export function LoginModal({ show, onHide }: LoginModalProps) {
  const { isLoggedIn, setIsLoggedIn, setPflegerId, setIsAdmin, logout } = useLoginContext();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!show) {
      setError(null);
    }
  }, [show]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
      credentials: 'include' as RequestCredentials,
    });

    if (response.ok) {
      const result = await response.json();
      setError(null);
      setIsLoggedIn(true);
      onHide();
      const { id } = result;

      setPflegerId(id);
      setIsAdmin(result.role === 'a');

      if (result.success) {
        onHide();
        setError(null);
        setPflegerId(result.id);
        setIsAdmin(result.role === 'a');
      } else {
        setError("Login fehlgeschlagen, bitte versuchen Sie es erneut.");
      }
    } else {
      setError("Login fehlgeschlagen, bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isLoggedIn ? 'Logout' : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoggedIn ? (
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                name = "name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Passwort">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name = "password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error && <div className="error-message">{error}</div>}
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Abbrechen
              </Button>
              <Button variant="primary" type="submit">
                OK
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
