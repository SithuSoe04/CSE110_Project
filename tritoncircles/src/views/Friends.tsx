import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Divider, List, ListItem, Avatar, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Friends: React.FC = () => {
  // State to toggle request views
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showGroupRequests, setShowGroupRequests] = useState(false);

  // State to track accepted friends and groups
  const [acceptedFriends, setAcceptedFriends] = useState<any[]>([]); 
  const [acceptedGroups, setAcceptedGroups] = useState<any[]>([]);

  // State to track friend and group requests
  const [friendRequests, setFriendRequests] = useState([
    { name: 'Alice', message: 'Hi, let’s connect!', avatarLetter: 'A', declined: false },
    { name: 'Bob', message: 'Looking forward to joining your circle.', avatarLetter: 'B', declined: false }
  ]);
  const [groupRequests, setGroupRequests] = useState([
    { name: 'Developers Group', message: 'Request to join your group.', avatarLetter: 'D', declined: false },
    { name: 'Study Buddies', message: 'Join our study group for CSE110.', avatarLetter: 'S', declined: false }
  ]);

  // Shared box style for sections
  const sectionStyle = {
    mb: 2,
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 1,
    backgroundColor: '#f9f9f9'
  };

  // Handle accept action
  const handleAcceptFriend = (friend: any) => {
    setAcceptedFriends((prev) => [...prev, friend]);
    setFriendRequests((prev) => prev.filter(request => request.name !== friend.name));
  };

  const handleAcceptGroup = (group: any) => {
    setAcceptedGroups((prev) => [...prev, group]);
    setGroupRequests((prev) => prev.filter(request => request.name !== group.name));
  };

  // Handle decline action
  const handleDeclineFriend = (friend: any) => {
    setFriendRequests((prev) => prev.map(request => 
      request.name === friend.name ? { ...request, declined: true } : request
    ));
  };

  const handleDeclineGroup = (group: any) => {
    setGroupRequests((prev) => prev.map(request => 
      request.name === group.name ? { ...request, declined: true } : request
    ));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ color: 'gray', mb: 2 }}>Friends</Typography>
      
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TextField fullWidth placeholder="Search" variant="outlined" sx={{ mr: 1 }} />
        <IconButton color="primary" aria-label="add">
          <AddIcon />
        </IconButton>
      </Box>

      {/* Add New Friends Section */}
      <Box sx={sectionStyle}>
        <Button fullWidth sx={{ textAlign: 'left', color: 'black' }} onClick={() => setShowFriendRequests(!showFriendRequests)}>
          Add New Friends
        </Button>
        {showFriendRequests && (
          <List>
            {friendRequests.map((request, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'green', mr: 2 }}>{request.avatarLetter}</Avatar>
                  <Box>
                    <Typography variant="body1">{request.name}</Typography>
                    <Typography variant="caption">{request.message}</Typography>
                  </Box>
                </Box>
                <Box>
                  {request.declined ? (
                    <Typography variant="caption" color="error">Declined</Typography>
                  ) : (
                    <>
                      <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleAcceptFriend(request)}>Accept</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeclineFriend(request)}>Decline</Button>
                    </>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Add New Groups Section */}
      <Box sx={sectionStyle}>
        <Button fullWidth sx={{ textAlign: 'left', color: 'black' }} onClick={() => setShowGroupRequests(!showGroupRequests)}>
          Add New Groups
        </Button>
        {showGroupRequests && (
          <List>
            {groupRequests.map((request, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'blue', mr: 2 }}>{request.avatarLetter}</Avatar>
                  <Box>
                    <Typography variant="body1">{request.name}</Typography>
                    <Typography variant="caption">{request.message}</Typography>
                  </Box>
                </Box>
                <Box>
                  {request.declined ? (
                    <Typography variant="caption" color="error">Declined</Typography>
                  ) : (
                    <>
                      <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleAcceptGroup(request)}>Accept</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeclineGroup(request)}>Decline</Button>
                    </>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Friends' Interested Events Section */}
      <Box sx={sectionStyle}>
        <Link to="/friends-interested-events" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button fullWidth sx={{ textAlign: 'left', color: 'black' }}>
            Friends' Interested Events
          </Button>
        </Link>
      </Box>

      {/* Accepted Friends & Groups Section */}
      <Divider sx={{ mb: 2 }} />
      <List>
        {acceptedFriends.map((friend, index) => (
          <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'green', mr: 2 }}>{friend.avatarLetter}</Avatar>
            <Typography variant="body1">{friend.name}</Typography>
          </ListItem>
        ))}
      </List>

      <List>
        {acceptedGroups.map((group, index) => (
          <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'blue', mr: 2 }}>{group.avatarLetter}</Avatar>
            <Typography variant="body1">{group.name}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Friends;
