import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, List, ListItem, Avatar, TextField, Divider,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { fetchFriendRequests, acceptRequest, declineRequest,} from "../utils/friends-utils";

const Friends: React.FC = () => {
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [acceptedFriends, setAcceptedFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedRequests = JSON.parse(localStorage.getItem("friend_requests") || "[]");
        if (cachedRequests.length > 0) {
          setFriendRequests(cachedRequests);
        } else {
          const friends = await fetchFriendRequests();
          setFriendRequests(friends || []);
        }
      } catch (err) {
        console.error("Error fetching friend requests:", err);
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  const handleAccept = async (request: any) => {
    try {
      await acceptRequest(request.request_id); // Use the correct property (request_id)
      setAcceptedFriends((prev) => [...prev, request]);
      setFriendRequests((prev) =>
        prev.filter((req) => req.request_id !== request.request_id) // Filter out the accepted request
      );
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  const handleDecline = async (request: any) => {
    try {
      await declineRequest(request.request_id); // Use the correct property (request_id)
      setFriendRequests((prev) =>
        prev.map((req) =>
          req.request_id === request.request_id
            ? { ...req, declined: true }
            : req
        )
      );
    } catch (err) {
      console.error("Error declining friend request:", err);
    }
  };

  if (loading) {
    return <Typography>Loading requests...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ color: "gray", mb: 2 }}>
        Friends
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TextField fullWidth placeholder="Search" variant="outlined" sx={{ mr: 1 }} />
        <IconButton color="primary" aria-label="add">
          <AddIcon />
        </IconButton>
      </Box>

      {/* Add New Friends Section */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Button
          fullWidth
          sx={{ textAlign: "left", color: "black" }}
          onClick={() => setShowFriendRequests(!showFriendRequests)}
        >
          Add New Friends
        </Button>
        {showFriendRequests && (
          <List>
            {friendRequests.length === 0 ? (
              <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                No friend requests at the moment.
              </Typography>
            ) : (
              friendRequests.map((request) => (
                <ListItem
                  key={request.request_id} // Use request_id as the key
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "green", mr: 2 }}>
                      {request.sender_name?.[0]} {/* Show the first letter of sender_name */}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{request.sender_name}</Typography> {/* Show sender_name */}
                      <Typography variant="caption">{request.message}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    {request.declined ? (
                      <Typography variant="body2" color="error">
                        Declined
                      </Typography>
                    ) : (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => handleAccept(request)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDecline(request)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>

      {/* Friends' Interested Events Section */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Link
          to="/friends-interested-events"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button fullWidth sx={{ textAlign: "left", color: "black" }}>
            Friends' Interested Events
          </Button>
        </Link>
      </Box>

      {/* Accepted Friends Section */}
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6">My Friends</Typography>
      {acceptedFriends.length > 0 ? (
        <List>
          {acceptedFriends.map((friend) => (
            <ListItem
              key={friend.request_id} // Use request_id as the key
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Avatar sx={{ bgcolor: "green", mr: 2 }}>
                {friend.sender_name?.[0]} {/* Show the first letter of sender_name */}
              </Avatar>
              <Typography variant="body1">{friend.sender_name}</Typography> {/* Show sender_name */}
            </ListItem>
          ))}
        </List>
        
      ) : (
        <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
          No accepted friends yet.
        </Typography>
      )}
    </Box>
  );
};

export default Friends;