const locationRepository = require('../repositories/location.repository');

const getGeocodeFromAddress = async (address) => {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Google API key not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'ZERO_RESULTS') {
            throw new Error('Address not found');
        }

        if (data.status === 'OVER_QUERY_LIMIT') {
            throw new Error('Geocoding service temporarily unavailable');
        }

        if (data.status !== 'OK') {
            throw new Error(`Geocoding failed: ${data.status}`);
        }

        const location = data.results[0].geometry.location;
        const cityComponent = data.results[0].address_components.find(comp =>
            comp.types.includes('locality')
        );
        const city = cityComponent ? cityComponent.long_name : '';

        return { location, city };
    } catch (error) {
        console.error('Geocoding error:', error.message);
        throw new Error('Unable to geocode address. Please try a different address.');
    }
};

const updateUserLocation = async (userId, address) => {
    const { location, city } = await getGeocodeFromAddress(address);

    const updated = await locationRepository.updateUserLocation(userId, {
        address,
        city,
        location
    });

    return updated;
};

const deleteUserLocation = async (userId) => {
    return await locationRepository.updateUserLocation(userId, {
        address: '',
        city: '',
        location: null
    });
};

const getUsersWithLocation = async (city) => {
    return await locationRepository.getUsersWithLocation(city);
};

module.exports = {
    updateUserLocation,
    deleteUserLocation,
    getUsersWithLocation
};
