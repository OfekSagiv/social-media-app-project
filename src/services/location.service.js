const locationRepository = require('../repositories/location.repository');

const getGeocodeFromAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error('Invalid address');
    }

    const location = data.results[0].geometry.location;
    const cityComponent = data.results[0].address_components.find(comp =>
        comp.types.includes('locality')
    );
    const city = cityComponent ? cityComponent.long_name : '';

    return { location, city };
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

module.exports = {
    updateUserLocation
};
