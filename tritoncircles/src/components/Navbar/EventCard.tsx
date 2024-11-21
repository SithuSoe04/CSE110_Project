import React from 'react';

interface EventCardProps {
    title: string;
    date: string;
    description: string;
    imageUrl: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, description, imageUrl }) => {
    return (
        <div className="event-card">
            <img src={imageUrl} alt={title} className="event-image" />
            <div className="event-details">
                <h3>{title}</h3>
                <p>{date}</p>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default EventCard;
