import { API_BASE_URL } from "../constants/constants";

// Fetch all friend requests
export const fetchFriendRequests = async () => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    console.error("User is not logged in.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/friends/requests?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Fallback to text if JSON fails
      console.error("Error fetching friend requests:", errorText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Unexpected error fetching friend requests:", err);
    return [];
  }
};

// Accept a friend request
export const acceptRequest = async (type: "friend", id: number) => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    console.error("User is not logged in.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${type}s/requests/${id}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error accepting ${type} request:`, errorText);
      return [];
    }

    const data = await response.json();
    console.log(`${type} request accepted.`);
    return data.data || [];
  } catch (err) {
    console.error(`Unexpected error accepting ${type} request:`, err);
    return [];
  }
};

// Decline a friend request
export const declineRequest = async (type: "friend", id: number) => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    console.error("User is not logged in.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${type}s/requests/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error declining ${type} request:`, errorText);
      return [];
    }

    const data = await response.json();
    console.log(`${type} request declined.`);
    return data.data || [];
  } catch (err) {
    console.error(`Unexpected error declining ${type} request:`, err);
    return [];
  }
};

export const fetchFriendsInterestedEvents = async () => {
    const user_id = localStorage.getItem("user_id");
  
    if (!user_id) {
      console.error("User is not logged in.");
      return [];
    }
  
    const response = await fetch(`${API_BASE_URL}/friends/interested-events?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await response.json();
    if (response.ok) {
      return data.data; 
    } else {
      console.error("Error fetching friends' interested events:", data.error);
      return [];
    }
  };