// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import apiClient from "../api/axios";
import CreateUserDialog from "../components/CreateUserDialog";
import EditUserDialog from "../components/EditUserDialog";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/users/");
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Could not load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserCreationSuccess = () => {
    setSnackbar({
      open: true,
      message: "User created successfully!",
      severity: "success",
    });
    fetchUsers();
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentUser(null);
  };
  const handleUserUpdateSuccess = () => {
    setSnackbar({
      open: true,
      message: "User updated successfully!",
      severity: "success",
    });
    fetchUsers();
  };

  const handleOpenDeactivateDialog = (user) => {
    setCurrentUser(user);
    setConfirmOpen(true);
  };
  const handleCloseConfirmDialog = () => {
    setConfirmOpen(false);
    setCurrentUser(null);
  };
  const handleDeactivateUser = async () => {
    if (!currentUser) return;
    try {
      await apiClient.delete(`/api/admin/users/${currentUser.id}/`);
      setSnackbar({
        open: true,
        message: `User '${currentUser.username}' deactivated successfully.`,
        severity: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to deactivate user", err);
      setSnackbar({
        open: true,
        message: "Failed to deactivate user.",
        severity: "error",
      });
    } finally {
      handleCloseConfirmDialog();
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight={700}>
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              New User
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department || "N/A"}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? "Active" : "Inactive"}
                          color={user.is_active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeactivateDialog(user)}
                          disabled={!user.is_active}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleUserCreationSuccess}
      />

      {currentUser && (
        <EditUserDialog
          user={currentUser}
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onSuccess={handleUserUpdateSuccess}
        />
      )}

      {currentUser && (
        <Dialog open={isConfirmOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm Deactivation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to deactivate the user "
              <strong>{currentUser.username}</strong>"? They will no longer be
              able to log in.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button
              onClick={handleDeactivateUser}
              color="error"
              variant="contained"
            >
              Deactivate
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
