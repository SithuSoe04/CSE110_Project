import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, List, ListItem, Divider, TextField } from "@mui/material";
import { updateFriendsInterestedEvents, fetchFriendsInterestedEvents } from "../utils/friends-utils"; 

interface Event {
  id: number;
  title: string;
  date: string;
  room: string;
  incentives: string;
  courseCode: string;
  friendId: number; 
  friendName: string;
}

const FriendsInterestedEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }
  
      try {
        // Update the friends interested events table before fetching
        await updateFriendsInterestedEvents(userId);
        const eventsData = await fetchFriendsInterestedEvents(userId);
        setEvents(eventsData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load friends' events.");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);   

  // Filter events based on the search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Typography>Loading events...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" sx={{ color: "gray" }}>
          Friends' Interested Events
        </Typography>

        {/* Search bar */}
        <TextField
          variant="outlined"
          placeholder="Search events"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "200px" }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        {filteredEvents.map((event) => (
          <ListItem
            key={event.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              padding: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <Avatar sx={{ bgcolor: "green", mr: 2 }}>{event.title.charAt(0)}</Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {event.title}
              </Typography>

              <Typography variant="caption" sx={{ display: "block", color: "gray" }}>
                {event.date}
              </Typography>

              <Typography variant="caption" sx={{ display: "block", color: "gray" }}>
                Incentives: {event.incentives}
              </Typography>

              <Typography variant="caption" sx={{ display: "block", color: "gray" }}>
                Friend: {event.friendName} ({event.friendId})
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>

    </Box>
  );
};

export default FriendsInterestedEvents;
