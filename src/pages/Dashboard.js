import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  TextField,
  AppBar,
  Toolbar,
  TablePagination,
  TableSortLabel,
  Tooltip,
  IconButton,
} from "@mui/material";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  });

  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy]?.toString().localeCompare(b[orderBy]?.toString());
      } else {
        return b[orderBy]?.toString().localeCompare(a[orderBy]?.toString());
      }
    });
  }, [filteredEmployees, order, orderBy]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleAddEmployee = async (data) => {
    try {
      await addDoc(collection(db, "employees"), data);

      fetchEmployees();
      setOpenDialog(false);
    } catch (err) {
      console.error("Çalışan ekleme hatası:", err);
    }
  };

  const handleSearch = () => {
    const filteredEmployees = employees.filter((emp) => {
      return (
        (emp.name || "")
          .toLowerCase()
          .includes(searchQuery.name.toLowerCase()) &&
        (
          emp.position?.name ||
          positions.find((p) => p.id === emp.position)?.name ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.position.toLowerCase()) &&
        (
          emp.department?.name ||
          departments.find((d) => d.id === emp.department)?.name ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.department.toLowerCase()) &&
        emp.salary?.toString().includes(searchQuery.salary)
      );
    });

    setFilteredEmployees(filteredEmployees);
  };

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const posSnap = await getDocs(collection(db, "positions"));
      const depSnap = await getDocs(collection(db, "departments"));

      setPositions(posSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setDepartments(
        depSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchOptions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      console.error("Firestore'dan veriler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); //ilk renderda çalışır

  useEffect(() => {
    handleSearch();
  }, [searchQuery, employees]);

  const handleDelete = async (id) => {
    //delete function
    if (window.confirm("Bu çalışanı silmek istiyor musunuz?")) {
      await deleteDoc(doc(db, "employees", id));

      fetchEmployees();
    }
  };

  const handleEdit = (emp) => {
    navigate(`/employee/${emp.id}`);
  };

  const getPositionName = (positionId) => {
    const id = positionId?.$oid;
    return positions.find((p) => p._id?.$oid === id)?.name || "-";
  };

  const getDepartmentName = (departmentId) => {
    const id = departmentId?.$oid;
    return departments.find((d) => d._id?.$oid === id)?.name || "-";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard - Çalışan Yönetimi
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ my: 3 }}
      >
        <TextField
          label="İsim"
          name="name"
          variant="outlined"
          size="small"
          value={searchQuery.name}
          onChange={handleChange}
          sx={{ width: 160 }}
        />

        {/* Pozisyon - dropdown */}
        <FormControl size="small" sx={{ width: 160 }}>
          <InputLabel id="position-label">Pozisyon</InputLabel>
          <Select
            labelId="position-label"
            name="position"
            value={searchQuery.position}
            onChange={handleChange}
            label="Pozisyon"
          >
            <MenuItem value="">Hepsi</MenuItem>
            {positions.map((pos) => (
              <MenuItem key={pos._id} value={pos.name}>
                {pos.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Departman - dropdown */}
        <FormControl size="small" sx={{ width: 160 }}>
          <InputLabel id="department-label">Departman</InputLabel>
          <Select
            labelId="department-label"
            name="department"
            value={searchQuery.department}
            onChange={handleChange}
            label="Departman"
          >
            <MenuItem value="">Hepsi</MenuItem>
            {departments.map((dep) => (
              <MenuItem key={dep._id} value={dep.name}>
                {dep.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Maaş"
          name="salary"
          variant="outlined"
          size="small"
          value={searchQuery.salary}
          onChange={handleChange}
          sx={{ width: 120 }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{
            height: 40,
            width: 120,
            mt: { xs: 2, sm: 0 }, // responsive yukarı hizalama
          }}
        >
          Ara
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            height: 40,
            width: 120,
            mt: { xs: 2, sm: 0 },
          }}
        >
          Ekle
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {["name", "position", "department", "salary"].map((col) => (
                <TableCell
                  key={col}
                  align={col === "salary" ? "right" : "left"}
                  sx={col === "salary" ? { pr: 4 } : {}}
                >
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col)}
                  >
                    <strong>
                      {col === "name"
                        ? "Ad"
                        : col === "position"
                        ? "Pozisyon"
                        : col === "department"
                        ? "Departman"
                        : "Maaş"}
                    </strong>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>
                <strong>İşlemler</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((emp, index) => (
                <TableRow
                  key={emp._id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                    "&:hover": { backgroundColor: "#f0f4ff" },
                  }}
                >
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{getPositionName(emp.position)}</TableCell>
                  <TableCell>{getDepartmentName(emp.department)}</TableCell>
                  <TableCell align="right">
                    {emp.salary.toLocaleString()} ₺
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Düzenle">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(emp)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(emp._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Sayfa başına kayıt:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} arası / toplam ${count}`
          }
        />
        <AddEmployeeDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onAdd={handleAddEmployee}
          positions={positions}
          departments={departments}
        />
      </TableContainer>
    </Container>
  );
};

export default Dashboard;

const AddEmployeeDialog = ({
  open,
  onClose,
  onAdd,
  positions,
  departments,
}) => {
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Gönderilen form verisi:", form);
    onAdd(form);
    setForm({ name: "", position: "", department: "", salary: "" });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="name"
            label="İsim"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="select-position">Pozisyon</InputLabel>
            <Select
              labelId="select-position"
              name="position"
              value={form.position}
              onChange={handleChange}
              label="Pozisyon"
            >
              {positions.map((pos) => (
                <MenuItem key={pos._id} value={pos._id}>
                  {pos.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-department">Departman</InputLabel>
            <Select
              labelId="select-department"
              name="department"
              value={form.department}
              onChange={handleChange}
              label="Departman"
            >
              {departments.map((dep) => (
                <MenuItem key={dep._id} value={dep._id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="salary"
            label="Maaş"
            type="number"
            value={form.salary}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};
