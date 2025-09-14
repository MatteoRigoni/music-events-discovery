/*
  # Populate sample events data

  1. Sample Data
    - Insert sample events with all required fields
    - Include various categories and ticket statuses
    - Use realistic event data for testing

  2. Data includes:
    - Event titles, descriptions, dates, and times
    - Venue information and capacity
    - Pricing and organizer details
    - Categories and ratings
    - Image URLs from Pexels
*/

INSERT INTO events (
  title, 
  date, 
  time, 
  duration, 
  venue, 
  price_range, 
  capacity, 
  organizer, 
  description, 
  rating, 
  available, 
  category, 
  image
) VALUES 
(
  'Rock Concert',
  '2024-09-10',
  '20:00:00',
  '3 hours',
  'Madison Square Garden',
  '$45 - $120',
  5000,
  'Rock Events NYC',
  'Experience an unforgettable night of rock music with some of the biggest names in the industry. This concert features multiple bands and promises to be an electrifying experience for all rock music enthusiasts.',
  4.8,
  true,
  'rock',
  'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Jazz Night',
  '2024-09-15',
  '19:30:00',
  '2.5 hours',
  'Blue Note LA',
  '$35 - $85',
  800,
  'LA Jazz Society',
  'An intimate evening of smooth jazz featuring renowned musicians from around the world. Perfect for jazz lovers looking for a sophisticated musical experience in an elegant setting.',
  4.9,
  false,
  'jazz',
  'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Indie Rock Fest',
  '2024-07-12',
  '18:00:00',
  '4 hours',
  'Stubb''s Bar-B-Q',
  '$25 - $75',
  2000,
  'Austin Music Collective',
  'Discover the next big indie rock bands at this exciting festival. Featuring up-and-coming artists and established indie favorites, this event is perfect for music discovery enthusiasts.',
  4.6,
  true,
  'indie',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Pop Hits',
  '2024-08-25',
  '20:30:00',
  '2 hours',
  'The Fillmore',
  '$55 - $150',
  3500,
  'Pop Music Productions',
  'Sing along to all your favorite pop hits in this high-energy concert featuring chart-topping artists and the biggest pop anthems of the year.',
  4.7,
  true,
  'pop',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Electronic Beats',
  '2024-10-05',
  '21:00:00',
  '5 hours',
  'Bayfront Park',
  '$40 - $100',
  8000,
  'Miami Electronic Music',
  'Dance the night away to pulsating electronic beats from world-renowned DJs. This outdoor festival promises an immersive audio-visual experience under the Miami stars.',
  4.5,
  true,
  'electronic',
  'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Country Music Night',
  '2024-11-18',
  '19:00:00',
  '3.5 hours',
  'Grand Ole Opry',
  '$30 - $90',
  4000,
  'Nashville Country Events',
  'Experience authentic country music in the heart of Nashville. Featuring both classic country legends and rising stars, this event celebrates the rich tradition of country music.',
  4.8,
  true,
  'country',
  'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=400'
);