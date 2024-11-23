import { API_BASE_URL } from "../constants/constants";

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
