import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initDB = async () => {
  // Open the database connection
  const db = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`

   DROP TABLE IF EXISTS clubs;
   CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(50) NOT NULL,
      private INTEGER DEFAULT 0,
      college VARCHAR(50),
      major VARCHAR(50),
      year VARCHAR(50),
      minor VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS clubs (
      club_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(256) NOT NULL,
      description TEXT,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER,
      title VARCHAR(256),
      date DATETIME,
      room VARCHAR(256),
      incentives TEXT,
      FOREIGN KEY(club_id) REFERENCES clubs(club_id)
    );

    CREATE TABLE IF NOT EXISTS recruitment (
      recruitment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id INTEGER,
      title VARCHAR(256),
      date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline DATETIME,
      application_link TEXT,
      FOREIGN KEY(club_id) REFERENCES clubs(club_id)
    );

    CREATE TABLE IF NOT EXISTS event_favorites (
      user_id INTEGER,
      event_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(user_id),
      FOREIGN KEY(event_id) REFERENCES events(event_id),
      PRIMARY KEY(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS club_favorites (
      user_id INTEGER,
      club_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(user_id),
      FOREIGN KEY(club_id) REFERENCES clubs(club_id),
      PRIMARY KEY(user_id, club_id)
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      request_id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      sender_name VARCHAR(50),
      user_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending', 
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      UNIQUE(sender_id, user_id) 
    );

    CREATE TABLE IF NOT EXISTS friends (
      connection VARCHAR(255) PRIMARY KEY, -- Combined user_id and friend_id
      friendship_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );      

    CREATE TABLE IF NOT EXISTS friends_interested_events (
      friend_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      FOREIGN KEY(friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE,
      PRIMARY KEY(friend_id, event_id)
    );
  `);

  // Seed the clubs table with 100 clubs
  const clubs = [
    { name: "4N01 Dance Team", description: "A dance team that performs various styles and participates in competitions.", link: "https://studentorg.ucsd.edu/Home/Details/17001" },
    { name: "528 @UC San Diego", description: "A community service organization focused on local outreach programs.", link: "https://studentorg.ucsd.edu/Home/Details/17002" },
    { name: "A Friend in Me at UC San Diego", description: "Provides companionship and support to individuals in need within the community.", link: "https://studentorg.ucsd.edu/Home/Details/17003" },
    { name: "A Lutheran Ministry Social (ALMS)", description: "A faith-based group offering social and spiritual activities.", link: "https://studentorg.ucsd.edu/Home/Details/17004" },
    { name: "Academic Enrichment for Relocated Students (AERS)", description: "Supports students who have relocated, providing academic resources and community.", link: "https://studentorg.ucsd.edu/Home/Details/17005" },
    { name: "Academy of Managed Care Pharmacy (AMCP at UC San Diego)", description: "Focuses on the practice of managed care pharmacy, offering educational events.", link: "https://studentorg.ucsd.edu/Home/Details/17006" },
    { name: "Acamazing", description: "An a cappella group performing a variety of musical genres.", link: "https://studentorg.ucsd.edu/Home/Details/17007" },
    { name: "Active Minds", description: "Promotes mental health awareness and education among students.", link: "https://studentorg.ucsd.edu/Home/Details/17008" },
    { name: "Acts 2 Fellowship", description: "A Christian fellowship group offering Bible studies and community service.", link: "https://studentorg.ucsd.edu/Home/Details/17009" },
    { name: "Advanced Professional Degree Consulting Club at UC San Diego", description: "Provides consulting experience and networking for advanced degree students.", link: "https://studentorg.ucsd.edu/Home/Details/17010" },
    { name: "Aequora Ballet Company", description: "A ballet company that performs classical and contemporary pieces.", link: "https://studentorg.ucsd.edu/Home/Details/17011" },
    { name: "Afghan Student Association (ASA)", description: "Promotes Afghan culture and heritage through various events.", link: "https://studentorg.ucsd.edu/Home/Details/17012" },
    { name: "Ahlul-Bayt Student Association", description: "Aims to educate about the teachings of the Ahlul-Bayt.", link: "https://studentorg.ucsd.edu/Home/Details/17013" },
    { name: "AI Sphere", description: "Focuses on artificial intelligence research and projects.", link: "https://studentorg.ucsd.edu/Home/Details/17014" },
    { name: "AIDS Awareness Alliance at UC San Diego", description: "Raises awareness about HIV/AIDS through education and events.", link: "https://studentorg.ucsd.edu/Home/Details/17015" },
    { name: "Airsoft at UC San Diego", description: "A club for airsoft enthusiasts to organize games and events.", link: "https://studentorg.ucsd.edu/Home/Details/17016" },
    { name: "All Peoples Church at UC San Diego", description: "A Christian community offering worship services and fellowship.", link: "https://studentorg.ucsd.edu/Home/Details/17017" },
    { name: "Alpha", description: "Explores the basics of the Christian faith through discussions.", link: "https://studentorg.ucsd.edu/Home/Details/17018" },
    { name: "Alpha Chi Omega", description: "A women's fraternity promoting friendship, leadership, and service.", link: "https://studentorg.ucsd.edu/Home/Details/17019" },
    { name: "Alpha Epsilon Delta Pre-Health Professional Honor Society", description: "A society for students pursuing careers in healthcare.", link: "https://studentorg.ucsd.edu/Home/Details/17020" },
    { name: "Alpha Gamma Alpha", description: "A sorority promoting sisterhood and Armenian culture.", link: "https://studentorg.ucsd.edu/Home/Details/17021" },
    { name: "Alpha Kappa Alpha Sorority, Inc.", description: "The first African American sorority promoting service and sisterhood.", link: "https://studentorg.ucsd.edu/Home/Details/17022" },
    { name: "Alpha Kappa Psi", description: "A co-ed business fraternity focused on leadership and professional development.", link: "https://studentorg.ucsd.edu/Home/Details/17023" },
    { name: "Alpha Omicron Pi", description: "A womens fraternity focusing on sisterhood, scholarship, and philanthropy.", link: "https://studentorg.ucsd.edu/Home/Details/17024" },
    { name: "Alpha Phi Alpha Fraternity, Inc.", description: "The first intercollegiate historically Black fraternity promoting scholarship and service.", link: "https://studentorg.ucsd.edu/Home/Details/17025" },
    { name: "Alpha Phi International Fraternity", description: "A sorority encouraging sisterhood, scholarship, and leadership.", link: "https://studentorg.ucsd.edu/Home/Details/17026" },
    { name: "Alpha Pi Sigma", description: "A Latina-based sorority empowering women through sisterhood and service.", link: "https://studentorg.ucsd.edu/Home/Details/17027" },
    { name: "Alpha Psi Omega", description: "A national honorary theatre society supporting the dramatic arts.", link: "https://studentorg.ucsd.edu/Home/Details/17028" },
    { name: "Alpine Club", description: "A club for outdoor enthusiasts focused on climbing and mountaineering.", link: "https://studentorg.ucsd.edu/Home/Details/17029" },
    { name: "Alternative Breaks @ UC San Diego", description: "Provides service-learning trips focused on social justice.", link: "https://studentorg.ucsd.edu/Home/Details/17030" },
    { name: "American Advertising Federation (AAF)", description: "Supports students interested in careers in advertising and marketing.", link: "https://studentorg.ucsd.edu/Home/Details/17031" },
    { name: "American Institute of Aeronautics and Astronautics (AIAA)", description: "Promotes interest and development in aerospace engineering.", link: "https://studentorg.ucsd.edu/Home/Details/17032" },
    { name: "American Medical Women's Association (AMWA)", description: "Supports and empowers women in medicine and healthcare.", link: "https://studentorg.ucsd.edu/Home/Details/17033" },
    { name: "American Red Cross Club at UC San Diego", description: "Partners with the Red Cross to organize blood drives and community events.", link: "https://studentorg.ucsd.edu/Home/Details/17034" },
    { name: "American Society of Civil Engineers (ASCE)", description: "Provides networking and resources for civil engineering students.", link: "https://studentorg.ucsd.edu/Home/Details/17035" },
    { name: "American Society of Mechanical Engineers (ASME)", description: "Supports students in mechanical engineering with career and project resources.", link: "https://studentorg.ucsd.edu/Home/Details/17036" },
    { name: "Amnesty International at UC San Diego", description: "Advocates for human rights through campaigns and education.", link: "https://studentorg.ucsd.edu/Home/Details/17037" },
    { name: "Anime and Manga Club", description: "Connects fans of anime and manga through events and discussions.", link: "https://studentorg.ucsd.edu/Home/Details/17038" },
    { name: "Anthropology Club", description: "Explores topics in anthropology through guest speakers and field trips.", link: "https://studentorg.ucsd.edu/Home/Details/17039" },
    { name: "Applied Math Club", description: "Supports students interested in applied mathematics and its applications.", link: "https://studentorg.ucsd.edu/Home/Details/17040" },
    { name: "Aquatics Club", description: "A club for students interested in swimming, diving, and other water sports.", link: "https://studentorg.ucsd.edu/Home/Details/17041" },
    { name: "Arab Student Union (ASU)", description: "Celebrates Arab culture and heritage through events and activities.", link: "https://studentorg.ucsd.edu/Home/Details/17042" },
    { name: "Armenian Student Association (ASA)", description: "Promotes Armenian culture and heritage among the student body.", link: "https://studentorg.ucsd.edu/Home/Details/17043" },
    { name: "ArtPower! Student Engagement", description: "Engages students with the performing arts through events and workshops.", link: "https://studentorg.ucsd.edu/Home/Details/17044" },
    { name: "Asian American Student Alliance (AASA)", description: "Advocates for Asian American students and fosters cultural awareness.", link: "https://studentorg.ucsd.edu/Home/Details/17045" },
    { name: "Asian Pacific Islander Student Alliance (APISA)", description: "Focuses on issues affecting the API student community.", link: "https://studentorg.ucsd.edu/Home/Details/17046" },
    { name: "Astronomy Club", description: "Offers stargazing events and discussions about astronomy.", link: "https://studentorg.ucsd.edu/Home/Details/17047" },
    { name: "Athletes for Action (AIA)", description: "Supports athletes in developing leadership skills and community service.", link: "https://studentorg.ucsd.edu/Home/Details/17048" },
    { name: "Audio Engineering Society (AES)", description: "Connects students interested in sound design and engineering.", link: "https://studentorg.ucsd.edu/Home/Details/17049" },
    { name: "Aviation Club", description: "Promotes aviation and flight training opportunities for students.", link: "https://studentorg.ucsd.edu/Home/Details/17050" },
    { name: "Ballet Folklorico La Joya de Mexico", description: "Celebrates Mexican heritage through traditional dance performances.", link: "https://studentorg.ucsd.edu/Home/Details/17051" },
    { name: "Bangladesh Student Association (BSA)", description: "Promotes Bangladeshi culture and community at UCSD.", link: "https://studentorg.ucsd.edu/Home/Details/17052" },
    { name: "Beach Volleyball Club", description: "Connects students with a passion for beach volleyball.", link: "https://studentorg.ucsd.edu/Home/Details/17053" },
    { name: "Biomedical Engineering Society (BMES)", description: "Supports students in biomedical engineering with networking and resources.", link: "https://studentorg.ucsd.edu/Home/Details/17054" },
    { name: "Black Student Union (BSU)", description: "Fosters community and advocates for the needs of Black students.", link: "https://studentorg.ucsd.edu/Home/Details/17055" },
    { name: "Blockchain and Cryptocurrency Club", description: "Explores blockchain technology and cryptocurrency innovation.", link: "https://studentorg.ucsd.edu/Home/Details/17056" },
    { name: "Book Club at UCSD", description: "Encourages reading and discussions on a variety of literary works.", link: "https://studentorg.ucsd.edu/Home/Details/17057" },
    { name: "Business Council", description: "Supports aspiring business professionals through events and mentorship.", link: "https://studentorg.ucsd.edu/Home/Details/17058" },
    { name: "Caledonian Society", description: "Celebrates Scottish culture through events and traditions.", link: "https://studentorg.ucsd.edu/Home/Details/17059" },
    { name: "Cambodian Student Association (CSA)", description: "Promotes Cambodian culture and history on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17060" },
    { name: "Cancer Awareness and Outreach (CAO)", description: "Raises awareness about cancer prevention and supports patients.", link: "https://studentorg.ucsd.edu/Home/Details/17061" },
    { name: "Career Services Peer Educators", description: "Helps students prepare for their careers with resume workshops and more.", link: "https://studentorg.ucsd.edu/Home/Details/17062" },
    { name: "Caribbean Student Association (CSA)", description: "Celebrates Caribbean culture and fosters community.", link: "https://studentorg.ucsd.edu/Home/Details/17063" },
    { name: "Caving Club", description: "Explores caves and teaches safe caving practices.", link: "https://studentorg.ucsd.edu/Home/Details/17064" },
    { name: "Chess Club at UCSD", description: "Connects chess enthusiasts for casual and competitive play.", link: "https://studentorg.ucsd.edu/Home/Details/17065" },
    { name: "Chinese American Student Association (CASA)", description: "Fosters connections and celebrates Chinese culture.", link: "https://studentorg.ucsd.edu/Home/Details/17066" },
    { name: "Chinese Dance Association", description: "Showcases Chinese culture through traditional and modern dance.", link: "https://studentorg.ucsd.edu/Home/Details/17067" },
    { name: "Circle K International", description: "Promotes leadership, fellowship, and service through community projects.", link: "https://studentorg.ucsd.edu/Home/Details/17068" },
    { name: "Climbing Club", description: "Provides opportunities for climbing enthusiasts to connect and train.", link: "https://studentorg.ucsd.edu/Home/Details/17069" },
    { name: "Coding for Social Good", description: "Focuses on creating software solutions for nonprofit organizations.", link: "https://studentorg.ucsd.edu/Home/Details/17070" },
    { name: "College Democrats at UCSD", description: "Engages students in Democratic Party politics and campaigns.", link: "https://studentorg.ucsd.edu/Home/Details/17071" },
    { name: "College Republicans at UCSD", description: "Encourages political discourse and involvement in Republican Party initiatives.", link: "https://studentorg.ucsd.edu/Home/Details/17072" },
    { name: "Comedy Club", description: "Provides a platform for students to practice and perform stand-up comedy.", link: "https://studentorg.ucsd.edu/Home/Details/17073" },
    { name: "Community Garden Club", description: "Promotes sustainability and gardening on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17074" },
    { name: "Computer Science and Engineering Society (CSES)", description: "Supports CSE students with professional development and projects.", link: "https://studentorg.ucsd.edu/Home/Details/17075" },
    { name: "Cooking Club", description: "Brings together students to learn and share recipes.", link: "https://studentorg.ucsd.edu/Home/Details/17076" },
    { name: "Creative Writing Club", description: "Fosters a community for writers to share and develop their work.", link: "https://studentorg.ucsd.edu/Home/Details/17077" },
    { name: "Cyber Security Club", description: "Teaches students about cybersecurity principles and practices.", link: "https://studentorg.ucsd.edu/Home/Details/17078" },
    { name: "Dance Dance Revolution Club", description: "For fans of the iconic arcade dance game.", link: "https://studentorg.ucsd.edu/Home/Details/17079" },
    { name: "Data Science Student Society (DSSS)", description: "Supports students pursuing data science careers and research.", link: "https://studentorg.ucsd.edu/Home/Details/17080" },
    { name: "Debate Society", description: "Encourages students to develop public speaking and debate skills.", link: "https://studentorg.ucsd.edu/Home/Details/17081" },
    { name: "Design for America (DFA)", description: "Focuses on social innovation through human-centered design.", link: "https://studentorg.ucsd.edu/Home/Details/17082" },
    { name: "Disability Advocates", description: "Promotes accessibility and inclusion on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17083" },
    { name: "Disney Fan Club", description: "Connects students who love Disney movies, parks, and culture.", link: "https://studentorg.ucsd.edu/Home/Details/17084" },
    { name: "Dragon Boat Club", description: "A team-based water sport promoting fitness and teamwork.", link: "https://studentorg.ucsd.edu/Home/Details/17085" },
    { name: "Economics Club", description: "Engages students with an interest in economics through events and networking.", link: "https://studentorg.ucsd.edu/Home/Details/17086" },
    { name: "Education Studies Student Association (ESSA)", description: "Supports students pursuing careers in education.", link: "https://studentorg.ucsd.edu/Home/Details/17087" },
    { name: "Electric Racing Team", description: "Designs and builds electric race cars for competition.", link: "https://studentorg.ucsd.edu/Home/Details/17088" },
    { name: "Environmental Club", description: "Advocates for sustainability and environmental awareness.", link: "https://studentorg.ucsd.edu/Home/Details/17089" },
    { name: "Esports Club", description: "Connects gamers and organizes competitive gaming events.", link: "https://studentorg.ucsd.edu/Home/Details/17090" },
    { name: "Ethnic Studies Graduate Student Association (ESGSA)", description: "Supports graduate students in ethnic studies with resources and networking.", link: "https://studentorg.ucsd.edu/Home/Details/17091" },
    { name: "Exercise is Medicine", description: "Promotes physical activity as part of a healthy lifestyle.", link: "https://studentorg.ucsd.edu/Home/Details/17092" },
    { name: "Fantasy Sports Club", description: "Brings together fans of fantasy sports for leagues and discussions.", link: "https://studentorg.ucsd.edu/Home/Details/17093" },
    { name: "Fashion Forward", description: "Explores fashion trends and design.", link: "https://studentorg.ucsd.edu/Home/Details/17094" },
    { name: "Filipino Student Association (FSA)", description: "Celebrates Filipino culture and community.", link: "https://studentorg.ucsd.edu/Home/Details/17095" },
    { name: "Finance Club", description: "Supports students pursuing careers in finance with resources and mentorship.", link: "https://studentorg.ucsd.edu/Home/Details/17096" },
    { name: "Fire Spinners Club", description: "Teaches and performs the art of fire spinning and flow arts.", link: "https://studentorg.ucsd.edu/Home/Details/17097" },
    { name: "Formula SAE", description: "Designs and builds race cars for national competitions.", link: "https://studentorg.ucsd.edu/Home/Details/17098" },
    { name: "Ballet Folklorico La Joya de Mexico", description: "Celebrates Mexican heritage through traditional dance performances.", link: "https://studentorg.ucsd.edu/Home/Details/17051" },
    { name: "Bangladesh Student Association (BSA)", description: "Promotes Bangladeshi culture and community at UCSD.", link: "https://studentorg.ucsd.edu/Home/Details/17052" },
    { name: "Beach Volleyball Club", description: "Connects students with a passion for beach volleyball.", link: "https://studentorg.ucsd.edu/Home/Details/17053" },
    { name: "Biomedical Engineering Society (BMES)", description: "Supports students in biomedical engineering with networking and resources.", link: "https://studentorg.ucsd.edu/Home/Details/17054" },
    { name: "Black Student Union (BSU)", description: "Fosters community and advocates for the needs of Black students.", link: "https://studentorg.ucsd.edu/Home/Details/17055" },
    { name: "Blockchain and Cryptocurrency Club", description: "Explores blockchain technology and cryptocurrency innovation.", link: "https://studentorg.ucsd.edu/Home/Details/17056" },
    { name: "Book Club at UCSD", description: "Encourages reading and discussions on a variety of literary works.", link: "https://studentorg.ucsd.edu/Home/Details/17057" },
    { name: "Business Council", description: "Supports aspiring business professionals through events and mentorship.", link: "https://studentorg.ucsd.edu/Home/Details/17058" },
    { name: "Caledonian Society", description: "Celebrates Scottish culture through events and traditions.", link: "https://studentorg.ucsd.edu/Home/Details/17059" },
    { name: "Cambodian Student Association (CSA)", description: "Promotes Cambodian culture and history on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17060" },
    { name: "Cancer Awareness and Outreach (CAO)", description: "Raises awareness about cancer prevention and supports patients.", link: "https://studentorg.ucsd.edu/Home/Details/17061" },
    { name: "Career Services Peer Educators", description: "Helps students prepare for their careers with resume workshops and more.", link: "https://studentorg.ucsd.edu/Home/Details/17062" },
    { name: "Caribbean Student Association (CSA)", description: "Celebrates Caribbean culture and fosters community.", link: "https://studentorg.ucsd.edu/Home/Details/17063" },
    { name: "Caving Club", description: "Explores caves and teaches safe caving practices.", link: "https://studentorg.ucsd.edu/Home/Details/17064" },
    { name: "Chess Club at UCSD", description: "Connects chess enthusiasts for casual and competitive play.", link: "https://studentorg.ucsd.edu/Home/Details/17065" },
    { name: "Chinese American Student Association (CASA)", description: "Fosters connections and celebrates Chinese culture.", link: "https://studentorg.ucsd.edu/Home/Details/17066" },
    { name: "Chinese Dance Association", description: "Showcases Chinese culture through traditional and modern dance.", link: "https://studentorg.ucsd.edu/Home/Details/17067" },
    { name: "Circle K International", description: "Promotes leadership, fellowship, and service through community projects.", link: "https://studentorg.ucsd.edu/Home/Details/17068" },
    { name: "Climbing Club", description: "Provides opportunities for climbing enthusiasts to connect and train.", link: "https://studentorg.ucsd.edu/Home/Details/17069" },
    { name: "Coding for Social Good", description: "Focuses on creating software solutions for nonprofit organizations.", link: "https://studentorg.ucsd.edu/Home/Details/17070" },
    { name: "College Democrats at UCSD", description: "Engages students in Democratic Party politics and campaigns.", link: "https://studentorg.ucsd.edu/Home/Details/17071" },
    { name: "College Republicans at UCSD", description: "Encourages political discourse and involvement in Republican Party initiatives.", link: "https://studentorg.ucsd.edu/Home/Details/17072" },
    { name: "Comedy Club", description: "Provides a platform for students to practice and perform stand-up comedy.", link: "https://studentorg.ucsd.edu/Home/Details/17073" },
    { name: "Community Garden Club", description: "Promotes sustainability and gardening on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17074" },
    { name: "Computer Science and Engineering Society (CSES)", description: "Supports CSE students with professional development and projects.", link: "https://studentorg.ucsd.edu/Home/Details/17075" },
    { name: "Cooking Club", description: "Brings together students to learn and share recipes.", link: "https://studentorg.ucsd.edu/Home/Details/17076" },
    { name: "Creative Writing Club", description: "Fosters a community for writers to share and develop their work.", link: "https://studentorg.ucsd.edu/Home/Details/17077" },
    { name: "Cyber Security Club", description: "Teaches students about cybersecurity principles and practices.", link: "https://studentorg.ucsd.edu/Home/Details/17078" },
    { name: "Dance Dance Revolution Club", description: "For fans of the iconic arcade dance game.", link: "https://studentorg.ucsd.edu/Home/Details/17079" },
    { name: "Data Science Student Society (DSSS)", description: "Supports students pursuing data science careers and research.", link: "https://studentorg.ucsd.edu/Home/Details/17080" },
    { name: "Debate Society", description: "Encourages students to develop public speaking and debate skills.", link: "https://studentorg.ucsd.edu/Home/Details/17081" },
    { name: "Design for America (DFA)", description: "Focuses on social innovation through human-centered design.", link: "https://studentorg.ucsd.edu/Home/Details/17082" },
    { name: "Disability Advocates", description: "Promotes accessibility and inclusion on campus.", link: "https://studentorg.ucsd.edu/Home/Details/17083" },
    { name: "Disney Fan Club", description: "Connects students who love Disney movies, parks, and culture.", link: "https://studentorg.ucsd.edu/Home/Details/17084" },
    { name: "Dragon Boat Club", description: "A team-based water sport promoting fitness and teamwork.", link: "https://studentorg.ucsd.edu/Home/Details/17085" },
    { name: "Economics Club", description: "Engages students with an interest in economics through events and networking.", link: "https://studentorg.ucsd.edu/Home/Details/17086" },
    { name: "Education Studies Student Association (ESSA)", description: "Supports students pursuing careers in education.", link: "https://studentorg.ucsd.edu/Home/Details/17087" },
    { name: "Electric Racing Team", description: "Designs and builds electric race cars for competition.", link: "https://studentorg.ucsd.edu/Home/Details/17088" },
    { name: "Environmental Club", description: "Advocates for sustainability and environmental awareness.", link: "https://studentorg.ucsd.edu/Home/Details/17089" },
    { name: "Esports Club", description: "Connects gamers and organizes competitive gaming events.", link: "https://studentorg.ucsd.edu/Home/Details/17090" },
    { name: "Ethnic Studies Graduate Student Association (ESGSA)", description: "Supports graduate students in ethnic studies with resources and networking.", link: "https://studentorg.ucsd.edu/Home/Details/17091" },
    { name: "Exercise is Medicine", description: "Promotes physical activity as part of a healthy lifestyle.", link: "https://studentorg.ucsd.edu/Home/Details/17092" },
    { name: "Fantasy Sports Club", description: "Brings together fans of fantasy sports for leagues and discussions.", link: "https://studentorg.ucsd.edu/Home/Details/17093" },
    { name: "Fashion Forward", description: "Explores fashion trends and design.", link: "https://studentorg.ucsd.edu/Home/Details/17094" },
    { name: "Filipino Student Association (FSA)", description: "Celebrates Filipino culture and community.", link: "https://studentorg.ucsd.edu/Home/Details/17095" },
    { name: "Finance Club", description: "Supports students pursuing careers in finance with resources and mentorship.", link: "https://studentorg.ucsd.edu/Home/Details/17096" },
    { name: "Fire Spinners Club", description: "Teaches and performs the art of fire spinning and flow arts.", link: "https://studentorg.ucsd.edu/Home/Details/17097" },
    { name: "Formula SAE", description: "Designs and builds race cars for national competitions.", link: "https://studentorg.ucsd.edu/Home/Details/17098" },
    { name: "French Club", description: "Celebrates French culture and language with events and activities.", link: "https://studentorg.ucsd.edu/Home/Details/17099" },
    { name: "Game Development Club", description: "Connects students interested in designing and building video games.", link: "https://studentorg.ucsd.edu/Home/Details/17100" }
  ];

  for (const club of clubs) {
    await db.run(
      "INSERT INTO clubs (name, description, link) VALUES (?, ?, ?)",
      [club.name, club.description, club.link]
    );
  }

  console.log("Seeded 100 clubs into the database");

  // Log tables created
  console.log("Database initialized with tables:");
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  tables.forEach((table) => console.log(`- ${table.name}`));

  return db;
};

export default initDB;
