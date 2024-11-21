import React, { useEffect, useState } from "react";
import EventCard from "../components/Events/EventCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { fetchUpcomingEvents, fetchFavoriteEvents } from "../utils/events-utils";

const Events = () => {
  // const initialEventData = [
  //   {
  //       id: 1,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 2,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 3,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 4,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 5,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 6,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: false,
  //   },
  //   {
  //       id: 7,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: true,
  //   },
  //   {
  //       id: 8,
  //       club: "CSES",
  //       title: "Software Engineering 101",
  //       date: "10 Nov 2024",
  //       room: "CSE1202",
  //       incentives: ["Food"],
  //       favorite: true,
  //   },
  // ];
  // const [eventData, setEventData] = useState(initialEventData);
  // const toggleFavorite = (id: number) => {
  //   setEventData(prevData =>
  //     prevData.map(event =>
  //       event.id === id ? { ...event, favorite: !event.favorite } : event
  //     )
  //   );
  // };

  // const favoriteEvents = eventData.filter((event) => event.favorite);
  // const upcomingEvents = eventData.filter((event) => !event.favorite);
  const [eventData, setEventData] = useState<{id: number, club: string, title: string, date: string, room: string, incentives: string[], favorite: boolean}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingEvents, favoriteEvents] = await Promise.all([
          fetchUpcomingEvents(),
          fetchFavoriteEvents()
        ]);

        const allEvents = [
          ...upcomingEvents.map((event: any) => ({ ...event, favorite: false })),
          ...favoriteEvents.map((event: any) => ({ ...event, favorite: true }))
        ];

        setEventData(allEvents);  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = (id: number) => {
    setEventData(prevData =>
      prevData.map(event =>
        event.id === id ? { ...event, favorite: !event.favorite } : event
      )
    );
  };

  const favoriteEvents = eventData.filter((event) => event.favorite);
  const upcomingEvents = eventData.filter((event) => !event.favorite);

  if (loading) {
    return <Typography>Loading events...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box sx={{ flexGrow: 1, margin: "3rem" }}>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
      </Typography>
      <Grid container spacing={2} mb={5}>
        {favoriteEvents.map((data) => (
          <Grid data-testid={`favorite-event-${data.id}`} key={data.id} size={3}><EventCard id={data.id} club={data.club} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite} incentives={data.incentives}/>
          </Grid>
        ))}
      </Grid>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Upcoming Events</Box>
      </Typography>
      <Grid container spacing={2}>
        {upcomingEvents.map((data) => (
          <Grid data-testid={`upcoming-event-${data.id}`}key={data.id} size={3}><EventCard id={data.id} club={data.club} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite} incentives={data.incentives}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Events;
