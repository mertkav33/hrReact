import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Box,
  CssBaseline,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from '@mui/material';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";


const Layout = () => {
  const navigate = useNavigate();         
  const location = useLocation();

  const handleLogout = () => {           
    signOut(auth)
      .then(() => {
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Çıkış hatası:", error);
      });
  };

  const drawerWidth = 200;

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Stats", icon: <AssessmentIcon />, path: "/stats" },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ÜST BAR */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Çalışan Yönetimi Paneli
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SOL MENÜ */}
      <Drawer
  variant="permanent"
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // Alt alta sabitler
    },
  }}
>
  <div>
    <Toolbar />
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </div>

  <div>
    <Divider />
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </ListItem>
    </List>
  </div>
</Drawer>

      {/* İÇERİK */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f9f9f9", p: 3, minHeight: "100vh" }}
      >
        <Toolbar /> {/* üst bar boşluğu kadar yer açar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
