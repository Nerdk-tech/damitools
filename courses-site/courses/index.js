const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Load config
const config = JSON.parse(fs.readFileSync('./config.json'));

// Helper function to load courses
function loadCourses(type) {
    const dir = path.join(__dirname, 'courses', type);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file)));
            return data;
        });
}

// Routes
app.get('/', (req, res) => {
    const freeCourses = loadCourses('free');
    const premiumCourses = loadCourses('premium');
    res.render('index', { config, freeCourses, premiumCourses });
});

app.get('/contact', (req, res) => {
    res.render('contact', { config });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});