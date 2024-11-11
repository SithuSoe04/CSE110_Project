import React, { useState } from "react";
import EventCard from "../components/Events/EventCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";

const Events = () => {
  const initialEventData = [
    {
        id: 1,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: true,
    },
    {
        id: 2,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 3,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 4,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 5,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 6,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 7,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
    {
        id: 8,
        title: "Software Engineering 101",
        date: "10 Nov 2024",
        room: "CSE1202",
        favorite: false,
    },
  ];
  const [eventData, setEventData] = useState(initialEventData);
  const toggleFavorite = (id: number) => {
    setEventData(prevData =>
      prevData.map(event =>
        event.id === id ? { ...event, favorite: !event.favorite } : event
      )
    );
  };

  const favoriteEvents = eventData.filter((event) => event.favorite);
  const upcomingEvents = eventData.filter((event) => !event.favorite);

  return (
    <Box sx={{ flexGrow: 1, margin: "3rem" }}>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
      </Typography>
      <Grid container spacing={2} mb={5}>
        {favoriteEvents.map((data) => (
          <Grid size={3}><EventCard id={data.id} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite}/>
          </Grid>
        ))}
      </Grid>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Upcoming Events</Box>
      </Typography>
      <Grid container spacing={2}>
        {upcomingEvents.map((data) => (
          <Grid size={3}><EventCard id={data.id} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Events;
