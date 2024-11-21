import React from 'react';

interface ClubCardProps {
    name: string;
    color: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ name, color }) => {
    return (
        <div className="club-card" style={{ backgroundColor: color }}>
            <p>{name}</p>
        </div>
    );
};

export default ClubCard;