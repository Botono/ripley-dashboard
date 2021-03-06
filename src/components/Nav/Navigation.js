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
                <Nav.Item>
                    <NavLink to="/logs" activeClassName='is-active'>Changelog</NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/water" activeClassName='is-active'>Water</NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/sleep" activeClassName='is-active'>Sleep</NavLink>
                </Nav.Item>
            </Navbar>
        );
    }
}

export default Navigation;