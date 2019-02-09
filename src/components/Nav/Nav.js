import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';


class Nav extends Component {
    render() {
        return (
            <Navbar variant="dark" className="nav">
                <Navbar.Brand href="#home">Ripley's Dashboard</Navbar.Brand>
            </Navbar>
        );
    }
}

export default Nav;