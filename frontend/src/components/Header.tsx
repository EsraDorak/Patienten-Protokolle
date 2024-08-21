import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { LoginModal } from './LoginDialog';
import LoginContext from './LoginContext';

export function Header() {
    const [modalShow, setModalShow] = useState(false);
    const loginContext = useContext(LoginContext);
    const isLoggedIn = loginContext?.isLoggedIn;
    const logout = loginContext?.logout;
    const isAdmin = loginContext?.isAdmin;
    
    return (
        <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" style={{boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)"}}>
            <Container>
                <Navbar.Brand href="/">Trinkprotokolle</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    {isAdmin && isLoggedIn ?
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    : null
                }
                    {isLoggedIn ?
                    <Nav.Link href="/prefs">Preferences</Nav.Link>
 
                    : null }
                    <Nav.Link href="/">Übersicht</Nav.Link>
                    <Nav.Link href="/protokoll/neu">Neues Protokoll</Nav.Link>
                    {isLoggedIn ? 
                    <Button href="/" style={{padding:"8px"}} variant="primary" onClick={logout}>
                    Logout
                    </Button> :
                    <Button  style={{padding:"8px"}} variant="primary" onClick={() => setModalShow(true)}>
                    Login
                    </Button>
}
                    <LoginModal show={modalShow} onHide={() => setModalShow(false)} />
                </Nav>
            </Container>
        </Navbar>
    )
}