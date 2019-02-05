import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';

class Nav extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Ripley's Dashboard</Navbar.Brand>
            </Navbar>
        );
    }
}

export default Nav;