import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';


class Navigation extends Component {
    render() {
        return (
            <Navbar variant="dark" className="nav">
                <Navbar.Brand>
                    <NavLink exact={true} to='/'>
                        Ripley's Dashboard
                    </NavLink>
                </Navbar.Brand>
            </Navbar>
        );
    }
}

export default Navigation;