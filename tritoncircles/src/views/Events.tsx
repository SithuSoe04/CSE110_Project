import React from "react";
import EventCard from "../components/Events/EventCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";

const Events = () => {
  const eventData = [{ title: "", date: "", room: "" }, { title: "", date: "", room: "" }, { title: "", date: "", room: "" }, { title: "", date: "", room: "" }];

  return (
    <Box sx={{ flexGrow: 1, margin: "3rem" }}>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
      </Typography>
      <Grid container spacing={2} mb={5}>
        {eventData.map(data => (
          <Grid size={3}>
            <EventCard title={data.title} date={data.date} room={data.room} />
          </Grid>
        ))}
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
        <Box sx={{ fontWeight: "bold" }}>Upcoming Events</Box>
      </Typography>
      <Grid container spacing={2}>
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
    </Box>
  );
};

export default Events;
