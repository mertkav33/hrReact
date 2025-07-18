import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  }); //input değerlerini tutar

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

  const [editId, setEditId] = useState(null); //edit
  const handleSearch = () => {
    const filteredEmployees = employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(searchQuery.name.toLowerCase()) &&
        emp.position
          .toLowerCase()
          .includes(searchQuery.position.toLowerCase()) &&
        emp.department
          .toLowerCase()
          .includes(searchQuery.department.toLowerCase()) &&
        emp.salary.toString().includes(searchQuery.salary)
      );
    });

    setFilteredEmployees(filteredEmployees); // ayrı bir state'e atıyoruz
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Veriler alınamadı:", err);
    }
  }; //veri çeker

  useEffect(() => {
    fetchEmployees();
  }, []); //ilk renderda çalışır

  const handleDelete = async (id) => {
    //delete function
    if (window.confirm("Bu çalışanı silmek istiyor musunuz?")) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    }
  };

  const handleEdit = (emp) => {
    navigate(`/employee/${emp._id}`);
  };

  const handleChange = (e) => {
    //name değerine göre doğru alanı günceller
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/employees/${editId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/employees", form);
      }
      setForm({ name: "", position: "", department: "", salary: "" });
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      console.error("İşlem başarısız:", err);
    }
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
          variant="outlined"
          size="small"
          value={searchQuery.name}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
          sx={{ width: 160 }}
        />
        <TextField
          label="Pozisyon"
          variant="outlined"
          size="small"
          value={searchQuery.position}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, position: e.target.value })
          }
          sx={{ width: 160 }}
        />
        <TextField
          label="Departman"
          variant="outlined"
          size="small"
          value={searchQuery.department}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, department: e.target.value })
          }
          sx={{ width: 160 }}
        />
        <TextField
          label="Maaş"
          variant="outlined"
          size="small"
          value={searchQuery.salary}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, salary: e.target.value })
          }
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
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department}</TableCell>
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
      </TableContainer>
    </Container>
  );
};

export default Dashboard;
