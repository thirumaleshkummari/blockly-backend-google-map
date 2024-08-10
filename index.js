const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 5001;

app.use(cors());

const googleMapsApiKey = `process.env.AIzaSyBtY8hZVBnCjYgC-alV1R4s_8itQYB4sYE`;

const getRoute = async (origin, destination) => {
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleMapsApiKey}`;

    try {
        const response = await axios.get(directionsUrl);

        // Log the full response to check its structure
        console.log('API Response:', response.data);

        if (response.data.routes && response.data.routes.length > 0 && response.data.routes[0].legs && response.data.routes[0].legs.length > 0) {
            const route = response.data.routes[0].legs[0].steps.map(step => ({
                latitude: step.start_location.lat,
                longitude: step.start_location.lng
            }));
            return route;
        } else {
            console.error('No valid route found in the API response');
            return [];
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        return [];
    }
};


app.get('/vehicle-location', async (req, res) => {
    const date = req.query.date || 'today';
    let route = [];

    if (date === 'yesterday') {
        route = await getRoute('17.385044,78.486671', '17.484044,78.456671');
    } else if (date === 'this_week') {
        route = await getRoute('17.385044,78.486671', '17.784044,78.556671');
    } else if (date === 'previous_week') {
        route = await getRoute('17.385044,78.486671', '17.685044,78.606671');
    } else if (date === 'this_month') {
        route = await getRoute('17.385044,78.486671', '18.385044,79.486671');
    } else if (date === 'previous_month') {
        route = await getRoute('17.385044,78.486671', '18.385044,78.986671');
    } else {
        route = await getRoute('17.385044,78.486671', '17.385944,78.486871');
    }

    res.json(route);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
