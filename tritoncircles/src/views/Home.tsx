import React from "react";
import EventCard from "../components/Events/EventCard";
import Recruitment from "../components/Recruitment/Recruitment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import FAQ from "../components/FAQ/FAQ";

const Home = () => {
    return (
      <Box sx={{ flexGrow: 1, margin: "3rem" }}>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
        </Typography>
        <Grid container spacing={2} mb={5}>
          <Grid size={3}>
            <EventCard title="" date="" room="" />
          </Grid>
          <Grid size={3}>
            <EventCard title="" date="" room="" />
          </Grid>
          <Grid size={3}>
            <EventCard title="" date="" room="" />
          </Grid>
          <Grid size={3}>
            <EventCard title="" date="" room="" />
          </Grid>
        </Grid>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Open Positions</Box>
        </Typography>
        <Grid container spacing={2} mb={5}>
          <Grid size={3}>
            <Recruitment/>
          </Grid>
          <Grid size={3}>
            <Recruitment/>
          </Grid>
          <Grid size={3}>
            <Recruitment/>
          </Grid>
          <Grid size={3}>
            <Recruitment/>
          </Grid>
        </Grid> 
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Frequently Asked Questions (FAQ)</Box>
        </Typography>
        <FAQ />
      </Box>
    );
  };
export default Home;
  