import { db } from './db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setupDatabase() {
  try {
    // สร้างตาราง users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified TIMESTAMP,
        image TEXT,
        password VARCHAR(255),
        points INTEGER DEFAULT 0,
        background_image TEXT,
        avatar TEXT,
        company VARCHAR(255),
        bio TEXT,
        role VARCHAR(50),
        line_contact TEXT,
        followers INTEGER DEFAULT 0,
        properties INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // สร้างตาราง properties
    await db.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        zip_code VARCHAR(20),
        bedrooms INTEGER,
        bathrooms INTEGER,
        square_feet INTEGER,
        status VARCHAR(50) DEFAULT 'active',
        phone VARCHAR(20),
        line_id VARCHAR(100),
        google_map_link TEXT,
        co_agent_commission DECIMAL(5,2),
        co_agent_incentive TEXT,
        co_agent_notes TEXT,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // สร้างตาราง property_images
    await db.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        is_main BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // สร้างตาราง property_votes
    await db.query(`
      CREATE TABLE IF NOT EXISTS property_votes (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vote_type INTEGER CHECK (vote_type IN (-1, 1)),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(property_id, user_id)
      );
    `);

    // สร้างตาราง user_points_history
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_points_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        points INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // สร้างตาราง user_follows
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      );
    `);

    // สร้างตาราง user_reviews
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        reviewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // สร้างตาราง comments
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE
      );
    `);

    // สร้างตาราง likes
    await db.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        UNIQUE(user_id, property_id)
      );
    `);

    // สร้าง indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
      CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
      CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
      CREATE INDEX IF NOT EXISTS idx_property_votes_property_id ON property_votes(property_id);
      CREATE INDEX IF NOT EXISTS idx_property_votes_user_id ON property_votes(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
    `);

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await db.end();
  }
}

setupDatabase();
