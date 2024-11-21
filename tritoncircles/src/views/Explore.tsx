import React from 'react';
import ClubCard from '../components/Navbar/ClubCard';
import EventCard from '../components/Navbar/EventCard';




// Sample data for demonstration purposes
const clubs = [
    { name: 'Club A', color: 'green' },
    { name: 'Club B', color: 'pink' },
    { name: 'Club C', color: 'blue' },
    { name: 'Club D', color: 'orange' },
];

const recommendedEvents = [
    {
        title: 'Introduction to Software Engineering',
        date: 'Jan 20',
        description: 'Learn about software engineering basics',
        imageUrl: 'event-image-url-1',
    },
    {
        title: 'Networking Workshop',
        date: 'Jan 22',
        description: 'Improve your networking skills',
        imageUrl: 'event-image-url-2',
    },
    {
        title: 'Career Fair',
        date: 'Jan 25',
        description: 'Meet recruiters and explore career opportunities',
        imageUrl: 'event-image-url-3',
    },
];

const categories = [
    { name: 'Gaming', color: 'green' },
    { name: 'Social', color: 'blue' },
    { name: 'Networking', color: 'orange' },
    { name: 'Fitness', color: 'red' },
];

const ExplorePage: React.FC = () => {
    return (
        <div className="explore-page">
            <header className="explore-header">
                <h1>Featured Clubs</h1>
                <input type="text" placeholder="Search" className="search-input" />
            </header>
            
            <section className="clubs-section">
                <div className="clubs-list">
                    {clubs.map((club, index) => (
                        <ClubCard key={index} name={club.name} color={club.color} />
                    ))}
                </div>
            </section>

            <section className="events-section">
                <h2>Recommended Events</h2>
                <div className="events-list">
                    {recommendedEvents.map((event, index) => (
                        <EventCard 
                            key={index}
                            title={event.title}
                            date={event.date}
                            description={event.description}
                            imageUrl={event.imageUrl}
                        />
                    ))}
                </div>
            </section>

            <section className="categories-section">
                <h2>Explore by Category</h2>
                <div className="categories-list">
                    {categories.map((category, index) => (
                        <div key={index} className="category" style={{ backgroundColor: category.color }}>
                            {category.name}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ExplorePage;