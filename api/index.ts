 const express = require('express');
        const app = express();

        app.get('/', (req, res) => {
          res.send('Welcome to the Express API on Vercel!');
        });

        // Add other routes and middleware here

module.exports = app; // Export the Express app instance