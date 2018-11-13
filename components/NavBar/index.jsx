import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Nav = styled.nav`
  max-height: 50px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  background-color: ${props => props.theme.colors.black};
  padding: ${props => props.theme.spacing[3]};
  color: ${props => props.theme.colors.white};

  a {
    color: white;
    text-decoration: none;
  }
`;

const NavLink = styled.a`
  /* f6 link dib white dim mr3 mr4-ns */
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  padding: ${props => props.theme.spacing[3]};

  &:hover {
    text-decoration: underline;
    transition: all 0.5s;
  }
`;

const Left = styled.div`
  display: inline-block;
  grid-column-start: 1;
  align-self: start;
`;

const Right = styled.div`
  display: inline-block;
  grid-column-start: -2;
  justify-self: end;
`;

const CenterRightAligned = styled.div`
  display: inline-block;
  grid-column-start: 2;
  justify-self: end;
`;

const NavBar = ({ loggedIn, logoutFunc }) => (
  <Nav>
    <Left>
      <a
        className="link white-70 hover-white no-underline flex items-center pa3"
        href="/"
      >
        Logo here
      </a>
    </Left>

    <CenterRightAligned>
      <NavLink>Link1</NavLink>
      <NavLink>Link2</NavLink>
    </CenterRightAligned>
    <Right>
      {!loggedIn ? (
        <a
          className="f6 dib white bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20"
          href="/dashboard"
        >
          Log in
        </a>
      ) : (
        <button
          className="f6 dib white bg-animate bg-black hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20"
          onClick={logoutFunc}
          type="button"
        >
          Log out
        </button>
      )}
    </Right>
  </Nav>
);

NavBar.propTypes = {
  loggedIn: PropTypes.bool,
  logoutFunc: PropTypes.func.isRequired,
};

NavBar.defaultProps = {
  loggedIn: false,
};

export default NavBar;
