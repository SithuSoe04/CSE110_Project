import { API_BASE_URL } from "../constants/constants";

export const fetchUpcomingEvents = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        console.error("User is not logged in.");
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/upcomingevents?user_id=${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (response.ok) {
        return data.data; 
    } else {
        console.error("Error:", data.error);
        return [];
    }
}

export const fetchUpcomingNonFavoriteEvents = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        console.error("User is not logged in.");
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/nonfavoriteevents?user_id=${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (response.ok) {
        return data.data; 
    } else {
        console.error("Error:", data.error);
        return [];
    }
}

export const fetchFavoriteEvents = async () => {
    const user_id = localStorage.getItem("user_id");
    console.log(user_id);
    if (!user_id) {
        console.error("User is not logged in.");
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/favoriteevents?user_id=${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (response.ok) {
        console.log(data.data);
        return data.data; 
    } else {
        console.error("Error:", data.error);
        return [];
    }
}
