import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Button, List, ListItem, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  courseCode: string;
}

const FriendsInterestedEvents: React.FC = () => {
  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: 'Introduction to Software Engineering', date: 'Jan 27, 2024', time: '6:00 PM - 7:30 PM', courseCode: 'CSE 110' },
    { id: 2, title: 'Advanced Data Structures', date: 'Feb 10, 2024', time: '3:00 PM - 5:00 PM', courseCode: 'CSE 220' },
    { id: 3, title: 'Machine Learning Basics', date: 'Mar 15, 2024', time: '1:00 PM - 2:30 PM', courseCode: 'CSE 250' },
  ]);

  // Function to remove an event by ID
  const removeEvent = (id: number) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ color: 'gray', mb: 2 }}>Friends' Interested Events</Typography>
      <Divider sx={{ mb: 2 }} />

      <List>
        {events.map((event) => (
          <ListItem key={event.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, padding: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Avatar sx={{ bgcolor: 'green', mr: 2 }}>{event.title.charAt(0)}</Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>{event.date} - {event.time}</Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>{event.courseCode}</Typography>
            </Box>
            <IconButton onClick={() => removeEvent(event.id)} aria-label="remove" color="error">
              <CloseIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendsInterestedEvents;
