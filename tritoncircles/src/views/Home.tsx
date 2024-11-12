import React from "react";
import EventCard from "../components/Events/EventCard";
import Recruitment from "../components/Recruitment/Recruitment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import FAQ from "../components/FAQ/FAQ";

const Home = () => {
  const favoriteEventsData = [
    {
        id: 1,
        club: "CSES",
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        incentives: ["Food"],
        favorite: true,
    },
    {
        id: 2,
        club: "CSES",
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        incentives: ["Food"],
        favorite: true,
    },
    {
        id: 3,
        club: "CSES",
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        incentives: ["Food"],
        favorite: true,
    },
    {
        id: 4,
        club: "CSES",
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        incentives: ["Food"],
        favorite: true,
    }]

    const recruitmentData = [
      {
          id: 1,
          club: "CSES",
          position: "Marketing Director",
          date_posted: "3 Nov 2024",
          deadline: "12 Nov 2024",
          application_link: "https://www.google.com/"
      },
      {
          id: 2,
          club: "CSES",
          position: "Marketing Director",
          date_posted: "3 Nov 2024",
          deadline: "12 Nov 2024",
          application_link: "https://www.google.com/"
      },
      {
          id: 3,
          club: "CSES",
          position: "Marketing Director",
          date_posted: "3 Nov 2024",
          deadline: "12 Nov 2024",
          application_link: "https://www.google.com/"
      },
      {
          id: 4,
          club: "CSES",
          position: "Marketing Director",
          date_posted: "3 Nov 2024",
          deadline: "12 Nov 2024",
          application_link: "https://www.google.com/"
      }]
    return (
      <Box sx={{ flexGrow: 1, margin: "3rem" }}>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
        </Typography>
        <Grid container spacing={2} mb={5}>
        {favoriteEventsData.map((data) => (
          <Grid size={3}><EventCard id={data.id} club={data.club} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={()=>{}} incentives={data.incentives}/>
          </Grid>
        ))}
        </Grid>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Open Positions</Box>
        </Typography>
        <Grid container spacing={2} mb={5}>
          {recruitmentData.map(data => 
             <Grid size={3}><Recruitment id={data.id} club={data.club} position={data.position} date_posted={data.date_posted} deadline={data.deadline} application_link={data.application_link}/></Grid>
          )}
        </Grid> 
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Frequently Asked Questions (FAQ)</Box>
        </Typography>
        <FAQ />
      </Box>
    );
  };
export default Home;
  