import { API_BASE_URL } from "../constants/constants";

export const fetchUserData = async (user_id: number) => {
    const response = await fetch(`${API_BASE_URL}/user?user_id=${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
	if (!response.ok) {
    	throw new Error("Failed to fetch user data");
	}
	return response.json();
}

export const userFavoriteEvent = async (user_id: number, event_id: number) => {
    const data = {user_id, event_id}
    const response = await fetch(`${API_BASE_URL}/favoriteevent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
	if (!response.ok) {
    	throw new Error("Failed to favorite event");
	}
	return response.json();
}

export const userUnfavoriteEvent = async (user_id: number, event_id: number) => {
    const data = {user_id, event_id}
    const response = await fetch(`${API_BASE_URL}/unfavoriteevent`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
	if (!response.ok) {
    	throw new Error("Failed to unfavorite event");
	}
	return response.json();
}

export const updateUserPrivacy = async (user_id: number, newPrivacyState: number) => {
    const data = {user_id, newPrivacyState};
    try {
        const response = await fetch(`${API_BASE_URL}/updateprivacy`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("Privacy updated successfully");
        } else {
            const errorData = await response.json();
            console.error("Error:", errorData.error);
        }
    } catch (error) {
        console.error("Failed to update privacy:", error);
    }
};