// src/pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Tabs, Tab, Alert, Skeleton, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Edit, Delete, PersonAdd, ArrowBack, Upgrade,
  RemoveCircle, CheckCircle,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [filterRole, setFilterRole] = useState('all');
  
  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
    fetchTechnicians();
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(filterRole === 'all' ? null : filterRole);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await adminAPI.getTechnicians();
      setTechnicians(response.data);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError('');
      await adminAPI.createUser(formData);
      setSuccess('User created successfully!');
      setOpenCreateModal(false);
      resetForm();
      fetchUsers();
      fetchTechnicians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      setError('');
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await adminAPI.updateUser(selectedUser.id, updateData);
      setSuccess('User updated successfully!');
      setOpenEditModal(false);
      resetForm();
      fetchUsers();
      fetchTechnicians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userName}?`)) return;

    try {
      setError('');
      await adminAPI.deleteUser(userId);
      setSuccess('User deleted successfully!');
      fetchUsers();
      fetchTechnicians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete user. They may have active work orders.');
    }
  };

  const handlePromoteToTechnician = async (userId, userName) => {
    if (!window.confirm(`Promote ${userName} to technician?`)) return;

    try {
      setError('');
      await adminAPI.promoteToTechnician(userId);
      setSuccess('User promoted to technician!');
      fetchUsers();
      fetchTechnicians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to promote user');
    }
  };

  const handleRemoveTechnician = async (techId, techName) => {
    if (!window.confirm(`Remove technician: ${techName}? This will DELETE their account.`)) return;

    try {
      setError('');
      await adminAPI.removeTechnician(techId);
      setSuccess('Technician removed successfully!');
      fetchUsers();
      fetchTechnicians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove technician. They may have assigned work orders.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setSelectedUser(null);
    setError('');
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setOpenEditModal(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'technician': return 'info';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Skeleton variant="text" width="40%" height={50} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rounded" height={80} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 10 : 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700">
            👥 User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users, technicians, and roles
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            size={isMobile ? 'small' : 'medium'}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setOpenCreateModal(true)}
            size={isMobile ? 'small' : 'medium'}
          >
            Create User
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab label={`All Users (${users.length})`} />
          <Tab label={`Technicians (${technicians.length})`} />
        </Tabs>
      </Paper>

      {/* All Users Tab */}
      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="user">Users</MenuItem>
                <MenuItem value="technician">Technicians</MenuItem>
                <MenuItem value="admin">Admins</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  {!isMobile && <TableCell><strong>Email</strong></TableCell>}
                  <TableCell><strong>Role</strong></TableCell>
                  {!isMobile && <TableCell><strong>Created</strong></TableCell>}
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    {!isMobile && <TableCell>{user.email}</TableCell>}
                    <TableCell>
                      <Chip
                        label={user.role.toUpperCase()}
                        color={getRoleBadgeColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        {user.role === 'user' && (
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handlePromoteToTechnician(user.id, user.name)}
                            title="Promote to Technician"
                          >
                            <Upgrade fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={user.id === currentUser?.id}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Technicians Tab */}
      {activeTab === 1 && (
        <Grid container spacing={2}>
          {technicians.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      {tech.name}
                    </Typography>
                    <Chip
                      label="TECHNICIAN"
                      color="info"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {tech.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>ID:</strong> {tech.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Since:</strong> {new Date(tech.created_at).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => openEditDialog(tech)}
                      fullWidth
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<RemoveCircle />}
                      onClick={() => handleRemoveTechnician(tech.id, tech.name)}
                      fullWidth
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create User Dialog */}
      <Dialog open={openCreateModal} onClose={() => { setOpenCreateModal(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenCreateModal(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditModal} onClose={() => { setOpenEditModal(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="New Password (leave blank to keep current)"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              helperText="Only fill this if you want to change the password"
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenEditModal(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateUser}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;