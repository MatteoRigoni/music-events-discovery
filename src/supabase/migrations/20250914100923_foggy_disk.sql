/*
  # Add columns to events table

  1. New Columns Added
    - `title` (text) - Event title
    - `date` (date) - Event date
    - `time` (time) - Event start time
    - `duration` (text) - Event duration (e.g., "3 hours")
    - `venue` (text) - Event venue name
    - `price_range` (text) - Price range (e.g., "$45 - $120")
    - `capacity` (integer) - Maximum attendees
    - `organizer` (text) - Event organizer name
    - `description` (text) - Event description
    - `rating` (decimal) - Event rating (0-5 scale)
    - `available` (boolean) - Ticket availability status
    - `category` (text) - Event category/genre
    - `image` (text) - Image URL or file path

  2. Security
    - Maintain existing RLS on events table
    - Add policies for authenticated users to manage events
*/

-- Add new columns to events table
DO $$
BEGIN
  -- Add title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'title'
  ) THEN
    ALTER TABLE events ADD COLUMN title text NOT NULL DEFAULT '';
  END IF;

  -- Add date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'date'
  ) THEN
    ALTER TABLE events ADD COLUMN date date;
  END IF;

  -- Add time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'time'
  ) THEN
    ALTER TABLE events ADD COLUMN time time;
  END IF;

  -- Add duration column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'duration'
  ) THEN
    ALTER TABLE events ADD COLUMN duration text DEFAULT '';
  END IF;

  -- Add venue column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'venue'
  ) THEN
    ALTER TABLE events ADD COLUMN venue text DEFAULT '';
  END IF;

  -- Add price_range column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'price_range'
  ) THEN
    ALTER TABLE events ADD COLUMN price_range text DEFAULT '';
  END IF;

  -- Add capacity column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE events ADD COLUMN capacity integer DEFAULT 0;
  END IF;

  -- Add organizer column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'organizer'
  ) THEN
    ALTER TABLE events ADD COLUMN organizer text DEFAULT '';
  END IF;

  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text DEFAULT '';
  END IF;

  -- Add rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'rating'
  ) THEN
    ALTER TABLE events ADD COLUMN rating decimal(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5);
  END IF;

  -- Add available column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'available'
  ) THEN
    ALTER TABLE events ADD COLUMN available boolean DEFAULT true;
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'category'
  ) THEN
    ALTER TABLE events ADD COLUMN category text DEFAULT '';
  END IF;

  -- Add image column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'image'
  ) THEN
    ALTER TABLE events ADD COLUMN image text DEFAULT '';
  END IF;
END $$;

-- Add RLS policies for events management
CREATE POLICY "Users can view all events"
  ON events
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for event images
CREATE POLICY "Anyone can view event images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can update event images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can delete event images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-images');