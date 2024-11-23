import React, { useEffect, useState } from "react";
import EventCard from "../components/Events/EventCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import { fetchUpcomingEvents, fetchFavoriteEvents, fetchUpcomingNonFavoriteEvents } from "../utils/events-utils";
import { userFavoriteEvent, userUnfavoriteEvent } from "../utils/user-utils";

const Events = () => {
  const [eventData, setEventData] = useState<{id: number, club: string, club_name: string, title: string, date: string, room: string, incentives: string[], favorite: boolean}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcomingEvents = await fetchUpcomingNonFavoriteEvents();
        const favoriteEvents = await fetchFavoriteEvents();
        const allEvents = [
          ...upcomingEvents.map((event: any) => ({ ...event,
            id: event.event_id, 
            club: event.club_id,
            club_name: event.club_name,
            favorite: false,
            incentives: JSON.parse(event.incentives)})),
          ...favoriteEvents.map((event: any) => ({ ...event,    
            id: event.event_id, 
            club: event.club_id,
            club_name: event.club_name,
            favorite: true,
            incentives: JSON.parse(event.incentives) }))
        ];
        setEventData(allEvents);  
        console.log(allEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const user_id = parseInt(localStorage.getItem('user_id') || '');
  const toggleFavorite = async (id: number) => {
    if (favoriteEvents.some(event => event.id === id)){
      try {
        await userUnfavoriteEvent(user_id, id);
        setEventData(prevData =>
          prevData.map(event =>
            event.id === id ? { ...event, favorite: !event.favorite } : event
          )
        );
        setLoading(false);
      }
      catch (error){
        console.error("Error favoriting events:", error);
        setError("Failed to favorite events.");
        setLoading(false);
      }
    }
    else {
      try {
        await userFavoriteEvent(user_id, id);
        setEventData(prevData =>
          prevData.map(event =>
            event.id === id ? { ...event, favorite: !event.favorite } : event
          )
        );
        setLoading(false);
      }
      catch (error){
        console.error("Error favoriting events:", error);
        setError("Failed to favorite events.");
        setLoading(false);
      }
    }
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
          <Grid data-testid={`favorite-event-${data.id}`} key={data.id} size={3}><EventCard id={data.id} club={data.club_name} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite} incentives={data.incentives}/>
          </Grid>
        ))}
      </Grid>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Upcoming Events</Box>
      </Typography>
      <Grid container spacing={2}>
        {upcomingEvents.map((data) => (
          <Grid data-testid={`upcoming-event-${data.id}`}key={data.id} size={3}><EventCard id={data.id} club={data.club_name} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={toggleFavorite} incentives={data.incentives}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Events;
