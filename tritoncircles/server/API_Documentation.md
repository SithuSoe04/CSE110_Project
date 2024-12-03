# API Documentation
This API provides a set of endpoints designed to manage user interactions with events, clubs, and other members in the system. The primary functionality is organized into several sections: Recruitment, Users, Events, Clubs, and Friends.

# Recruitment
---

## Function: `createRecruitment`

### Description
Creates a new recruitment post for a club. The post includes details like the club's ID, title, posting date, deadline, and application link.

### Parameters
- `req: Request` - The HTTP request object containing the recruitment details in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Expected Request Body
```
{
  "club_id": number,       // ID of the club creating the recruitment post
  "title": string,         // Title of the recruitment post
  "date_posted": string?,  // (Optional) Date the post was created; defaults to current timestamp
  "deadline": string,      // Deadline for applications
  "application_link": string // URL link to the application form
}
```

### Responses
-  201 Created: Recruitment post successfully created.
```{
  "club_id": number,
  "title": string,
  "date_posted": string,
  "deadline": string,
  "application_link": string
}
```
-  400 Bad Request: Missing required fields.
```
{ "error": "Missing required fields" }
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Recruitment could not be created: <error message>" }
```

## Function: `deleteRecruitment`

### Description
Deletes an existing recruitment post by its unique ID.

### Parameters
- `req: Request` - The HTTP request object with recruitment_id as a route parameter.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- recruitment_id (string): Unique ID of the recruitment post to delete.

### Responses
-  200 OK: Recruitment post successfully deleted.
```
{ "message": "Recruitment deleted successfully" }
```
-  400 Bad Request: Missing required recruitment_id parameter.
```
{ "error": "Missing required field: recruitment_id" }
```
- 404 Not Found: Recruitment post not found.
```
{ "error": "Recruitment not found" }
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Error deleting recruitment: <error message>" }
```

## Function: `getUserRecruitment`

### Description
Retrieves all recruitment posts for a user, filtered by the clubs they have marked as favorites.

### Parameters
- `req: Request` - The HTTP request object with user_id in the query string.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- user_id (string): Unique ID of the user to filter recruitment posts.

### Responses
-  200 OK: Successfully retrieved recruitment posts.
```
{
  "data": [
    {
      "recruitment_id": number,
      "club_id": number,
      "title": string,
      "date_posted": string,
      "deadline": string,
      "application_link": string,
      "club_name": string
    },
    ...
  ]
}
```
-  500 Internal Server Error: Database or server error.
```
{ "error": "Error getting recruitment posts: <error message>" }
```

# Events
---

## Function: `createEvent`

### Description
Creates a new event for a club. The event includes details such as the club's ID, title, date, room, and optional incentives.

### Parameters
- `req: Request` - The HTTP request object containing the event details in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Expected Request Body
```
{
  "club_id": number,         // ID of the club hosting the event
  "title": string,           // Title of the event
  "date": string,            // Date of the event
  "room": string,            // Location of the event
  "incentives": string?      // (Optional) Incentives for attending the event
}
```

### Responses
-  201 Created: Event successfully created
```
{
  "club_id": number,
  "title": string,
  "date": string,
  "room": string,
  "incentives": string | null
}
```
- 400 Bad Request: Missing required fields.
```
{ "error": "Missing required fields" }
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Event could not be created, + <error message>" }
```

## Function: `deleteEvent`

### Description
Creates a new event for a club. The event includes details such as the club's ID, title, date, room, and optional incentives.

### Parameters
- `req: Request` - The HTTP request object with event_id as a route parameter.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- `event_id: string` - Unique ID of the event to delete.

### Responses
-  200 OK: Event successfully deleted.
```
{ "message": "Event deleted successfully" }
```
- 400 Bad Request: Missing event_id parameter.
```
{ "error": "Missing required field: event_id" }
```
- 404 Not Found: Event not found.
```
{ "error": "Event not found" }
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Error deleting event: <error message>" }
```

## Function: `getAllClubEvents`

### Description
Fetches all events for all clubs.

### Parameters
- `req: Request` - The HTTP request object.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- `event_id: string` - Unique ID of the event to delete.

### Responses
-  200 OK: Successfully retrieved all events.
```
{
"data": [
  {
  "club_id": number,
  "title": string,
  "date": string,
  "room": string,
  "incentives": string | null
  },
  ...
  ]
}
```
## Function: `getAllClubEvents`

### Description
Fetches all events for all clubs.

### Parameters
- `req: Request` - The HTTP request object.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- `event_id: string` - Unique ID of the event to delete.

### Responses
-  200 OK: Successfully retrieved all events.
```
{
  "data": [
    {
    "club_id": number,
    "title": string,
    "date": string,
    "room": string,
    "incentives": string | null
    },
    ...
    ]
}
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Error getting events: <error message>" }
```
## Function: `deleteEvent`

### Description
Creates a new event for a club. The event includes details such as the club's ID, title, date, room, and optional incentives.

### Parameters
- `req: Request` - The HTTP request object with event_id as a route parameter.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
- `event_id: string` - Unique ID of the event to delete.

### Responses
-  200 OK: Event successfully deleted.
```
{ "message": "Event deleted successfully" }
```
- 400 Bad Request: Missing event_id parameter.
```
{ "error": "Missing required field: event_id" }
```
- 404 Not Found: Event not found.
```
{ "error": "Event not found" }
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Error deleting event: <error message>" }
```

## Function: `getUserUpcomingEvents`

### Description
Fetches all upcoming events for a specific user based on their club preferences.

### Parameters
- `req: Request` - The HTTP request object containing user_id in the query.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
-  `user_id: string - ID` of the user whose upcoming events are to be retrieved.

### Responses
-  200 OK: Successfully retrieved all events.
```
{
  "data": [
    {
    "club_id": number,
    "title": string,
    "date": string,
    "room": string,
    "incentives": string | null
    },
    ...
    ]
}
```
-  500 Internal Server Error: Database or server error during fetching.
```
{ "error": "Error getting user upcoming events: <error message>" }
```

## Function: `getUserNonFavoriteEvents`

### Description
Fetches all non-favorite events for a user based on their club preferences.

### Parameters
- `req: Request` - The HTTP request object containing user_id in the query.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
-  `user_id: string - ID` of the user whose non-favorite events are to be retrieved.

### Responses
-  200 OK: Successfully retrieved all events.
```
{
  "data": [
    {
    "club_id": number,
    "title": string,
    "date": string,
    "room": string,
    "incentives": string | null
    },
    ...
    ]
}
```
-  500 Internal Server Error: Database or server error during fetching.
```
{ "error": "Error getting user upcoming non-favorite events: <error message>" }
```

## Function: `getUserFavoriteEvents`

### Description
Fetches all favorite events for a user based on their club preferences.

### Parameters
- `req: Request` - The HTTP request object containing user_id in the query.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Route Parameters
-  `user_id: string - ID` of the user whose non-favorite events are to be retrieved.

### Responses
-  200 OK: Successfully retrieved all events.
```
{
  "data": [
    {
    "club_id": number,
    "title": string,
    "date": string,
    "room": string,
    "incentives": string | null
    },
    ...
    ]
}
```
-  500 Internal Server Error: Database or server error during fetching.
```
{ "error": "Error getting user favorite events: <error message>" }
```

# User
---
## Function: `getAllUsers`

### Description
Fetches all users from the database.

### Parameters
- `req: Request` - The HTTP request object.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Responses
-  200 OK: Successfully retrieved all users.
```
[
  {
    "user_id": number,
    "name": string,
    "email": string,
    "college": string | null,
    "major": string | null,
    "year": string | null,
    "minor": string | null,
    "securityQuestion": string | null,
    "securityAnswer": string | null
  },
  ...
]
```
- 500 Internal Server Error: Database or server error.
```
{ "error": "Failed to fetch users" }
```

## Function: `userSignUp`

### Description
Registers a new temporary user in the database.

### Parameters
- `req: Request` - The HTTP request object containing the name, email, and password fields in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.

### Responses
-  201 Created: Successfully created a temporary user.
```
{ "message": "Temporary user created", "tempId": number }
```
-  400 Bad Request: Missing required fields (name, email, password).
```
{ "error": "Missing required fields" }
```
-  409 Conflict: The email is already registered.
```
{ "error": "Email is already registered" }
```
-  500 Internal Server Error: Database or server error during registration.
```
{ "error": "Error registering user: <error message>" }
```

## Function: `updateUserProfile`

### Description
Updates the profile information of a temporary user.

### Parameters
- `req: Request` - The HTTP request object containing the tempId, college, major, year, and minor fields in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully updated the temporary user's profile.
```
{ "message": "Temporary profile updated successfully" }
```
-  400 Bad Request: Missing required tempId.
```
{ "error": "Missing required temp ID" }
```
-  500 Internal Server Error: Database or server error during update
```
{ "error": "Error updating profile: <error message>" }
```

## Function: `updateUserSecurity`

### Description
Updates the security question and answer of a temporary user.

### Parameters
- `req: Request` - The HTTP request object containing the tempId, securityQuestion, and securityAnswer fields in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully updated the user's security information.
```
{ "message": "Security information updated successfully" }
```
-  400 Bad Request: Missing required fields (tempId, securityQuestion, securityAnswer).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Database or server error during update.
```
{ "error": "Error updating security information: <error message>" }
```

## Function: `finalizeUser`

### Description
Finalizes user registration by moving data from the temporary user table to the main users table.

### Parameters
- `req: Request` - The HTTP request object containing the tempId field in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  201 Created: Successfully finalized user registration.
```
{ "message": "User registration finalized", "user_id": number }
```
-  400 Bad Request: Missing required tempId.
```
{ "error": "Missing required temp ID" }
```
-  404 Not Found: The temporary user was not found.
```
{ "error": "Temporary user not found" }
```
-  500 Internal Server Error: Database or server error during finalization.
```
{ "error": "Error finalizing user registration: <error message>" }
```

## Function: `userLogIn`

### Description
Logs a user into the system by verifying their email and password.

### Parameters
- `req: Request` - The HTTP request object containing the email and password fields in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully logged in.
```
{ "message": "Logged in successfully", "user_id": number }
```
-  400 Bad Request: Missing required fields (email, password).
```
{ "error": "Missing required fields" }
```
-  401 Unauthorized: Incorrect username or password.
```
{ "message": "Username or password does not match" }
```
-  500 Internal Server Error: Database or server error during login.
```
{ "error": "Log in unsuccessful: <error message>" }
```

## Function: `verifySecurity`

### Description
Verifies the security question and answer for a user during a password recovery process.

### Parameters
- `req: Request` - The HTTP request object containing the email, securityQuestion, and securityAnswer fields in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Security details match.
```
{ "message": "Verification successful", "verified": true }
```
-  401 Unauthorized: Security details do not match.
```
{ "error": "Security details do not match", "verified": false }
```
-  404 Not Found: User not found.
```
{ "error": "User not found" }
```
-  500 Internal Server Error: Database or server error during verification.
```
{ "error": "Server error: <error message>" }
```

## Function: `updatePassword`

### Description
Updates the password for a user identified by their email.

### Parameters
- `req: Request` - The HTTP request object containing email and newPassword in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully updated the user's password.
```
{ "message": "Password updated successfully" }
```
-  400 Bad Request: Missing required fields (email, newPassword).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error updating the password in the database.
```
{ "error": "Server error: <error message>" }
```

## Function: `userFavoriteEvent`

### Description
Adds an event to the list of favorite events for a user.

### Parameters
- `req: Request` - The HTTP request object containing user_id and event_id in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully favorited the event.
```
{ "message": "Event favorited successfully", "user_id": number, "event_id": number }
```
-  400 Bad Request: Missing required fields (user_id, event_id).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error favoriting the event.
```
{ "error": "Event could not be favorited: <error message>" }
```

## Function: `userUnfavoriteEvent`

### Description
Removes an event from the user's list of favorite events.

### Parameters
- `req: Request` - The HTTP request object containing user_id and event_id in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully unfavorited the event.
```
{ "message": "Event unfavorited successfully", "user_id": number, "event_id": number }
```
-  400 Bad Request: Missing required fields (user_id, event_id).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error unfavoriting the event.
```
{ "error": "Event could not be unfavorited: <error message>" }
```

## Function: `userFavoriteClub`

### Description
Adds a club to the list of favorite clubs for a user.

### Parameters
- `req: Request` - The HTTP request object containing user_id and club_id in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully favorited the club.
```
{ "message": "Club favorited successfully", "user_id": number, "club_id": number }
```
-  400 Bad Request: Missing required fields (user_id, club_id).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error favoriting the club.
```
{ "error": "Club could not be favorited: <error message>" }
```

## Function: `userUnfavoriteClub`

### Description
Removes a club from the user's list of favorite clubs.

### Parameters
- `req: Request` - The HTTP request object containing user_id and club_id in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully unfavorited the club.
```
{ "message": "Club unfavorited successfully", "user_id": number, "club_id": number }
```
-  400 Bad Request: Missing required fields (user_id, club_id).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error unfavoriting the club.
```
{ "error": "Club could not be unfavorited: <error message>" }
```

## Function: `updatePrivacy`

### Description
Updates the privacy setting for a user.

### Parameters
- `req: Request` - The HTTP request object containing user_id and newPrivacyState in the body.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully updated the privacy setting.
```
{ "message": "Privacy setting updated successfully" }
```
-  400 Bad Request: Missing required fields (user_id, newPrivacyState).
```
{ "error": "Missing required fields" }
```
-  500 Internal Server Error: Error updating the privacy setting in the database.
```
{ "error": "Error updating privacy setting: <error message>" }
```

## Function: `getUser`

### Description
Fetches the user data for a given user ID.

### Parameters
- `req: Request` - The HTTP request object containing the user_id in the query.
- `res: Response` - The HTTP response object.
- `db: Database` - The SQLite database instance.
  
### Responses
-  200 OK: Successfully retrieved the user data.
```
{
  "user_id": number,
  "name": string,
  "email": string,
  "college": string | null,
  "major": string | null,
  "year": string | null,
  "minor": string | null,
  "private": number
}
```
-  400 Bad Request: Missing required user_id.
```
{ "error": "Missing required user_id" }
```
-  500 Internal Server Error: Error fetching the user data.
```
{ "error": "Failed to fetch user" }
```
