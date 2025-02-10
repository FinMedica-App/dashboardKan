import React, { useState } from "react";
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Toolbar, 
  Typography,
  Button
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const Layout = ({ children, onMenuSelect }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  // Función para cerrar sesión: elimina el token y recarga la página
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Menú de navegación
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { label: "📋 Tabla", view: "tabla" },
          { label: "🗂 Kanban", view: "kanban" },
        ].map((item) => (
          <ListItem 
            button 
            key={item.view} 
            onClick={() => { 
              onMenuSelect(item.view); 
              setMobileOpen(false); 
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar superior con imagen de fondo */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: 'url("https://i.imgur.com/yIqRVr9.png")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          height: 64,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}  // Solo se muestra en pantallas pequeñas
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard de Turnos
          </Typography>
          {/* Espaciador para empujar el botón de cerrar sesión a la derecha */}
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer para pantallas grandes y móviles */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu de navegación"
      >
        {/* Drawer temporal para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer permanente para pantallas grandes */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Espacio para el AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
