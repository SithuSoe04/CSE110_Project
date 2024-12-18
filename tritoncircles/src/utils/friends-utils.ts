import { API_BASE_URL } from "../constants/constants";

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
    // console.log("Friend requests fetched:", data.data);
    return data.data || [];
  } catch (err) {
    console.error("Unexpected error fetching friend requests:", err);
    return [];
  }
};

export const acceptRequest = async (friendRequestId: number) => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    console.error("User is not logged in.");
    return [];
  }

  try {
    console.log("Accepting request for friend ID:", friendRequestId); // Debug log
    const response = await fetch(`${API_BASE_URL}/friends/requests/${friendRequestId}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }), // user_id for backend validation
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error accepting friend request:`, errorText);
      return [];
    }

    const data = await response.json();
    console.log("Friend request accepted successfully:", data); // Debug log
    return data;
  } catch (err) {
    console.error(`Unexpected error:`, err);
    return [];
  }
};

export const declineRequest = async (id: number) => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    console.error("User is not logged in.");
    return [];
  }

  try {
    // console.log("Sending decline request for ID:", id)
    const response = await fetch(`${API_BASE_URL}/friends/requests/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error declining friend request:`, errorText);
      return [];
    }

    const data = await response.json();
    // console.log(`Friend request declined.`);
    return data.data || [];
  } catch (err) {
    console.error(`Unexpected error declining friend request:`, err);
    return [];
  }
};

export const sendFriendRequest = async (recipientId: string) => {
  const senderId = localStorage.getItem("user_id");
  const senderName = localStorage.getItem("user_name") || "Anonymous"; 

  if (!senderId) {
    console.error("User is not logged in.");
    throw new Error("You must log in before sending friend requests.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/friends/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: senderId,
        sender_name: senderName,
        recipient_id: recipientId,
        message: "Hi! Let's connect.",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error sending friend request:`, errorText);
      throw new Error(errorText || "Failed to send friend request.");
    }

    const data = await response.json();
    console.log("Friend request sent successfully.");
    return data;
  } catch (err) {
    console.error("Unexpected error sending friend request:", err);
    throw err;
  }
};

export const updateFriendsInterestedEvents = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/friends/interested-events/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating friends' interested events:", errorText);
      throw new Error("Failed to update friends' interested events.");
    }

    const data = await response.json();
    console.log("Friends' interested events updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error updating friends' interested events:", err);
    throw err;
  }
};

export const fetchFriendsInterestedEvents = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/friends/interested-events/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching friends' interested events:", errorText);
      throw new Error("Failed to fetch friends' interested events.");
    }

    const data = await response.json();
    console.log("Fetched friends' interested events:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching friends' interested events:", err);
    throw err;
  }
};
