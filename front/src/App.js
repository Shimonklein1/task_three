import './App.css';

// Grid
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/system';

// Select
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Form
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// General
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


function App() {
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [newMeetingToAdd, setNewMeetingToAdd] = useState({});

  const handleChange = (event) => {
    setTeamId(event.target.value);
    getMeetings(event.target.value);
  };

  const getTeams = async () => {
    try 
    {
      const { data } = await axios.get("http://localhost:3030/api/teams");
      setTeams(data);
    } 
    catch (error) 
    {
      console.error('Error fetching teams:', error);
    };
  }

  const getMeetings = async (team_id) => {
    const { data } = await axios.get(`http://localhost:3030/api/meetings/?	team_id=${team_id}`);
    setMeetings(data);
  }

  const validateForm = (numOfInputs) => {
    // Validate that state is not null
    if (newMeetingToAdd === null) {
      Swal.fire({
        title: 'Required Fields Missing',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    };

    //If state not null, then validate that all fields full
    const objkeys = Object.keys(newMeetingToAdd)
    if (objkeys.length < numOfInputs) {
      Swal.fire({
        title: 'Required Fields Missing',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.log('validateform returns', false)
      return false;
    } else {
      console.log('validateform returns', true)
      return true;

    };
  };

  const handleInsertMeeting = () => {
    const isFormValid = validateForm(4);
    if (isFormValid) {
      const newMeetingWithGroupId = { ...newMeetingToAdd, team_id: teamId }
      axios.post("http://localhost:3030/api/meetings", newMeetingWithGroupId).then(() => {
        setMeetings([
          ...meetings,
          newMeetingWithGroupId
        ]);
        Swal.fire({
          title: 'Success!',
          text: 'Meeting has been added successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }).catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add meeting',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error adding meeting:', error);
      });
    };
  };

  useEffect(() => {
    getTeams();
  }, [])

  useEffect(() => {
    setNewMeetingToAdd(null);
  }, [meetings])

  return (
    <>
      <CssBaseline />
      <Container fixed>

        <h1>My Teams And Meetings System</h1>
        <h2>Choose Team</h2>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Teams</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={teamId}
              label="Teams"
              onChange={handleChange}
            >
              {teams.map((item, index) => (
                <MenuItem key={index} value={item.ID}>{item.team_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {teamId && (
          <>
            <h2>Add New Meeting</h2>
            <Box sx={{ minWidth: 120, display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <TextField value={newMeetingToAdd?.description || ""} label="Description" variant="outlined" onChange={e => setNewMeetingToAdd({ ...newMeetingToAdd, description: (e.target.value) })} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Date"
                  sx={{ width: 226.17 }}
                  onChange={(newValue) => setNewMeetingToAdd({ ...newMeetingToAdd, start: newValue })}
                  value={newMeetingToAdd?.start || null}
                  ampm={false}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="end Date"
                  sx={{ width: 226.17 }}
                  onChange={(newValue) => setNewMeetingToAdd({ ...newMeetingToAdd, end: newValue })}
                  value={newMeetingToAdd?.end || null}
                  ampm={false}
                />
              </LocalizationProvider>
              <TextField value={newMeetingToAdd?.meeting_room || ""} label="Room" variant="outlined" onChange={e => setNewMeetingToAdd({ ...newMeetingToAdd, meeting_room: (e.target.value) })} />
              <Button variant="contained" onClick={() => handleInsertMeeting()}>Add Meeting!</Button>
            </Box>

            <h2>Meetings</h2>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell align="right">Description:</TableCell>
                    <TableCell align="right">Starts At:</TableCell>
                    <TableCell align="right">Ends At:</TableCell>
                    <TableCell align="right">Room:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings.map((meeting, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">
                        {meeting.description}
                      </TableCell>
                      <TableCell align="right">
                        {meeting.start ? new Date(meeting.start).toLocaleString() : ''}
                      </TableCell>
                      <TableCell align="right">
                        {meeting.end ? new Date(meeting.end).toLocaleString() : ''}
                      </TableCell>
                      <TableCell align="right">
                        {meeting.meeting_room}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
