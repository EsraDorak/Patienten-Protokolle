// App.js
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ErrorFallback } from './components/ErrorFallback';
import { PageIndex } from './components/PageIndex';
import { PageAdmin } from './components/PageAdmin';
import { PageEintrag } from './components/PageEintrag';
import { PagePrefs } from './components/PagePrefs';
import { LoginModal } from './components/LoginDialog';
import { LoginProvider } from './components/LoginContext';
import PageProtokoll from './components/PageProtokoll';


export function App() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <LoginProvider>
      <>
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>Trinkprotokolle</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
              <Nav className="mr-auto">
                <Button
                  variant="primary"
                  onClick={() => setShowLoginDialog(true)}
                  style={{ display: window.innerWidth >= 1000 ? 'block' : 'none' }}
                >
                  Login
                </Button>
                <LinkContainer to="/admin">
                  <Nav.Link>Admin</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/prefs">
                  <Nav.Link>Preferences</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* LoginDialog-Komponente */}
        <LoginModal show={showLoginDialog} onHide={() => setShowLoginDialog(false)} />

        {/* Hauptinhalt */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<PageIndex />} />
            <Route path="/protokoll/:protokollId" element={<PageProtokoll />} />
            <Route path="/protokoll/neu" element={<PageProtokoll />} /> 
            <Route path="/protokoll/:protokollId/eintrag/neu" element={<PageProtokoll />} />
            <Route path="/eintrag/:eintragId" element={<PageEintrag />} />
            <Route path="/admin" element={<PageAdmin />} />
            <Route path="/prefs" element={<PagePrefs />} />
            <Route path="*" element={<PageIndex />} />
          </Routes>
        </ErrorBoundary>
      </>
    </LoginProvider>
  );
}

export default App;
