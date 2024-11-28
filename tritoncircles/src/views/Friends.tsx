import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, List, ListItem, Avatar, TextField, Divider,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../constants/constants";
import { fetchFriendRequests, acceptRequest, declineRequest, sendFriendRequest } from "../utils/friends-utils";

const Friends: React.FC = () => {
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [acceptedFriends, setAcceptedFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await fetchFriendRequests();
      setFriendRequests(requests || []);
      const accepted = requests.filter((req: any) => req.status === "accepted");
      setAcceptedFriends(accepted || []);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      setError("Failed to load friend requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAccept = async (request: any) => {
    // console.log("Accept request with ID:", request.request_id); 
    try {
      await acceptRequest(request.request_id);
  
      // Update frontend state immediately
      setFriendRequests((prev) =>
        prev.filter((req) => req.request_id !== request.request_id)
      );
      setAcceptedFriends((prev) => [...prev, { ...request, status: "accepted" }]);
  
      console.log("Friend request accepted successfully.");
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Failed to accept friend request. Please refresh and try again.");
    }
  };
  
 
  const handleDecline = async (request: any) => {
    // console.log("Decline request with ID:", request.request_id); // Debug log
    try {
      await declineRequest(request.request_id);
  
      // Update frontend state immediately
      setFriendRequests((prev) =>
        prev.map((req) =>
          req.request_id === request.request_id
            ? { ...req, status: "declined", declined: true }
            : req
        )
      );
  
      console.log("Friend request declined.");
    } catch (err) {
      console.error("Error declining friend request:", err);
      setError("Failed to decline friend request. Please refresh and try again.");
    }
  };


  const handleSearch = async () => {
    setSearchError(null);
    setSearchResult(null);

    if (!searchValue.trim()) {
      setSearchError("Please enter a valid username or ID.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/search?query=${searchValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setSearchError(errorText || "Failed to fetch search results.");
        return;
      }

      const data = await response.json();
      setSearchResult(data.user || null);
    } catch (err) {
      console.error("Error searching for user:", err);
      setSearchError("An unexpected error occurred while searching.");
    }
  };


  const handleSendRequest = async (recipientId: string) => {
    try {
      await sendFriendRequest(recipientId);
      alert("Friend request sent successfully!");
      setSearchResult(null);
      setSearchValue("");
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("Failed to send friend request.");
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
      <Typography variant="h4" sx={{ color: "black", mb: 2 }}>
        Friends
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <TextField fullWidth 
        placeholder="Search by username or user ID" 
        variant="outlined" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ mr: 1 }} />
        <IconButton color="primary" onClick={handleSearch} aria-label="add">
          <AddIcon />
        </IconButton>
      </Box>

      {searchError && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #f44336",
            borderRadius: 1,
            backgroundColor: "#fdecea",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography color="error" sx={{ fontWeight: "bold", mr: 1 }}>
            ⚠️
          </Typography>
          <Typography color="error" sx={{ fontSize: "0.9rem" }}>
            {searchError}
          </Typography>
        </Box>
      )}


      {searchResult && (
        <Box
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "blue", mr: 2 }}>
              {searchResult.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body1">{searchResult.name}</Typography>
              <Typography variant="caption">ID: {searchResult.id}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSendRequest(searchResult.id)}
          >
            Add Friend
          </Button>
        </Box>
      )}


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
          New Friends
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
                    {request.status === "declined" ? (
                      <Typography variant="body2" color="error">
                        Declined
                      </Typography>
                    ) : request.status === "accepted" ? (
                      <Typography variant="body2" color="primary">
                        Accepted
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