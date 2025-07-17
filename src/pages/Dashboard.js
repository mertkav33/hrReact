import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useMemo } from "react";

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
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  });

  const [employees, setEmployees] = useState([]);

  const totalEmployees = employees.length;

  const averageSalary = employees.length
    ? Math.round(
        employees.reduce((sum, emp) => sum + Number(emp.salary), 0) /
          employees.length
      )
    : 0;

  const departments = [...new Set(employees.map((emp) => emp.department))];
  const departmentCount = departments.length;

  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const mostCrowdedDept =
    Object.keys(departmentCounts).length > 0
      ? Object.entries(departmentCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "Veri yok";

  const totalSalary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0
  );

  const minSalary = employees.length
    ? Math.min(...employees.map((emp) => Number(emp.salary)))
    : 0;

  const maxSalary = employees.length
    ? Math.max(...employees.map((emp) => Number(emp.salary)))
    : 0;

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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // login sayfasına döner
      })
      .catch((error) => {
        console.error("Çıkış hatası:", error);
      });
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
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        justifyContent="flex-start"
        sx={{ my: 2 }}
      >
        <TextField
          label="İsim"
          variant="outlined"
          size="small"
          value={searchQuery.name}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
        />
        <TextField
          label="Pozisyon"
          variant="outlined"
          size="small"
          value={searchQuery.position}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, position: e.target.value })
          }
        />
        <TextField
          label="Departman"
          variant="outlined"
          size="small"
          value={searchQuery.department}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, department: e.target.value })
          }
        />
        <TextField
          label="Maaş"
          variant="outlined"
          size="small"
          value={searchQuery.salary}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, salary: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSearch}
        >
          ARA
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["name", "position", "department", "salary"].map((col) => (
                <TableCell key={col}>
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
              .map((emp) => (
                <TableRow key={emp._id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.salary}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </Button>
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
          rowsPerPageOptions={[5, 10, 15]}
        />
      </TableContainer>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Toplam Çalışan</Typography>
                <Typography variant="h5">{totalEmployees}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Ortalama Maaş</Typography>
                <Typography variant="h5">{averageSalary} ₺</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Departman Sayısı</Typography>
                <Typography variant="h5">{departmentCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">En Yüksek Maaş</Typography>
                <Typography variant="h5">{maxSalary} ₺</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">
                  En Kalabalık Departman
                </Typography>
                <Typography variant="h5">{mostCrowdedDept}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Toplam Maaş Ödemesi</Typography>
                <Typography variant="h5">{totalSalary} ₺</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">En Düşük Maaş</Typography>
                <Typography variant="h5">{minSalary} ₺</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
