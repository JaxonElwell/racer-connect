const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./devdb.sqlite');

db.serialize(() => {
    // create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS StudentOrganizations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            president TEXT,
            president_email TEXT,
            advisor TEXT,
            advisor_email TEXT
        );`,
        (err) => {
            if(err) {
                console.error('Error creating StudentOrganizations table:', err.message);
            } else {
                console.log('StudentOrganizations table created successfully');
            }
        }
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS EventAttendees (
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (event_id, user_id),  
            FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );`,
        (err) => {
            if(err) {
                console.error('Error creating EventAttendees table:', err.message);
            } else {
                console.log('EventAttendees table created successfully');
            }
        }
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );`,
        (err) => {
            if(err) {
                console.error('Error creating Users table:', err.message);
            } else {
                console.log('Users table created successfully');
            }
        }
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS Events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            organization_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            event_date TEXT NOT NULL,  
            location TEXT NOT NULL,
            description TEXT,
            image TEXT,  
            FOREIGN KEY (organization_id) REFERENCES StudentOrganizations(id) ON DELETE CASCADE
        );`,
        (err) => {
            if(err) {
                console.error('Error creating Events table:', err.message);
            } else {
                console.log('Events table created successfully');
            }
        }
    );
})

db.close();