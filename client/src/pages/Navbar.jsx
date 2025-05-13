import React, { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import store from "../context/context";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const navigate = useNavigate();

  const { setSelectedUsers } = useContext(store);


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const loggedUserName =
    user?.name.charAt(0).toUpperCase() + user?.name.slice(1);
  const getFirstLetter = user?.name?.split("")[0].toUpperCase();

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  //logout api
  const handleLogout = async () => {
    try {
      const logoutRes = await axios.get(
        `${import.meta.env.VITE_API_URL_DEV}/app/api/logout`,
        { withCredentials: true }
      );

      if (logoutRes?.status == 200) {
        toast.success(logoutRes?.data?.message);
        localStorage.removeItem("loggedUser");
        navigate("/");
        setSelectedUsers(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Logout Failed");
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item ">
          <div className="nav-link cursor-pointer" data-widget="pushmenu">
            <i className="fas fa-bars" />
          </div>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Navbar Search */}
        <li className="nav-item">
          <li className="nav-item dropdown">
            <Link className="nav-link" data-toggle="dropdown" to="#">
              <Chip
                avatar={<Avatar style={{ backgroundColor: '#2e5faa', color: 'white' }} alt={loggedUserName} >  {getFirstLetter} </Avatar>}
                label={loggedUserName}
                style={{ cursor: 'pointer', fontWeight: 400 }}
                variant="outlined"
              />
            </Link>
            <div className="dropdown-menu dropdown-menu-lg" style={{ minWidth: '100%' }}>
              {loggedUserName && (
                <Grid item xs>
                  <Item
                    label="Logout"
                    className="nav-link"
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => handleLogout()}
                    variant="outlined"
                  >
                    Logout
                  </Item>
                </Grid>
              )}
            </div>
          </li>
        </li>
      </ul>
      <Toaster />
    </nav>
  );
};

export default Navbar;
