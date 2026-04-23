import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/logo 2.png';
import { HashLink } from 'react-router-hash-link';
import {
  useNavigate
} from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();

  const loginHandler = () => {
    alert("HI")
    navigate("/auth");
  }

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    // <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img  src={logo} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              {/*<Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>About</Nav.Link>*/}
              {/*<Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>*/}
            </Nav>
            <span className="navbar-text">
              {/*<div className="social-icon">*/}
              {/*  <a href="#"><img src={navIcon1} alt="" /></a>*/}
              {/*  <a href="#"><img src={navIcon2} alt="" /></a>*/}
              {/*  <a href="#"><img src={navIcon3} alt="" /></a>*/}
              {/*</div>*/}
              <HashLink to='#connect'>
                <button className="vvd" onClick={loginHandler}><span>Log in</span>

                </button>
              </HashLink>
            </span>

          </Navbar.Collapse>
          {/*<div  style={{marginRight:-63,marginLeft:64}} className="social-icon">*/}
          {/*  <a  href="#" ><img style={{width:57,height:57}} src={user} alt="" /></a>*/}
          {/*</div>*/}
        </Container>
      </Navbar>
    // </Router>
  )
}
