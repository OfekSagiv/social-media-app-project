function initMap() {
    const mapContainer = document.getElementById('map');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'map-loading';
    loadingDiv.innerHTML = '<p>Loading user locations...</p>';
    mapContainer.appendChild(loadingDiv);


    const defaultCenter = { lat: 32.0853, lng: 34.7818 };

    const map = new google.maps.Map(mapContainer, {
        zoom: 12,
        center: defaultCenter,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    const addCityFilter = (cities) => {
        if (cities.length <= 1) return;

        const filterContainer = document.createElement('div');
        filterContainer.className = 'city-filter';
        filterContainer.innerHTML = `
            <label for="city-select">Filter by city:</label>
            <select id="city-select">
                <option value="">All cities</option>
                ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
            </select>
        `;

        const feedContainer = document.querySelector('.feed-container');
        feedContainer.insertBefore(filterContainer, mapContainer);
    };

    fetch('/api/location/with-location', {
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch locations`);
            return res.json();
        })
        .then(users => {
            loadingDiv.remove();

            if (!users || users.length === 0) {
                const noUsersDiv = document.createElement('div');
                noUsersDiv.className = 'no-users-message';
                noUsersDiv.innerHTML = '<p>No users have shared their locations yet.</p>';
                mapContainer.appendChild(noUsersDiv);
                return;
            }

            const cities = [...new Set(users.filter(u => u.city).map(u => u.city))].sort();
            addCityFilter(cities);

            const bounds = new google.maps.LatLngBounds();
            const markers = [];

            users.forEach(user => {
                if (!user.location || !user.location.lat || !user.location.lng) return;

                const position = { lat: user.location.lat, lng: user.location.lng };
                bounds.extend(position);

                const marker = new google.maps.Marker({
                    position,
                    map,
                    title: user.fullName,
                    animation: google.maps.Animation.DROP
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="map-info-window">
                            <h4>${user.fullName}</h4>
                            <p><i class="bi bi-geo-alt"></i> ${user.city || 'Unknown city'}</p>
                            <a href="/profile/${user._id}" class="glass-button">View Profile</a>
                        </div>
                    `
                });

                marker.addListener('click', () => {

                    markers.forEach(m => m.infoWindow?.close());
                    infoWindow.open(map, marker);
                });

                markers.push({ marker, infoWindow, user });
            });


            if (markers.length > 0) {
                map.fitBounds(bounds);

                const listener = google.maps.event.addListener(map, 'idle', () => {
                    if (map.getZoom() > 15) map.setZoom(15);
                    google.maps.event.removeListener(listener);
                });
            }


            const citySelect = document.getElementById('city-select');
            if (citySelect) {
                citySelect.addEventListener('change', (e) => {
                    const selectedCity = e.target.value;
                    const newBounds = new google.maps.LatLngBounds();
                    let visibleMarkers = 0;

                    markers.forEach(({ marker, user }) => {
                        const shouldShow = !selectedCity || user.city === selectedCity;
                        marker.setVisible(shouldShow);

                        if (shouldShow) {
                            newBounds.extend(marker.getPosition());
                            visibleMarkers++;
                        }
                    });

                    if (visibleMarkers > 0) {
                        map.fitBounds(newBounds);
                        const listener = google.maps.event.addListener(map, 'idle', () => {
                            if (map.getZoom() > 15) map.setZoom(15);
                            google.maps.event.removeListener(listener);
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.error('Failed to load user locations:', err);
            loadingDiv.innerHTML = `
                <div class="map-error">
                    <p><i class="bi bi-exclamation-triangle"></i> Failed to load user locations</p>
                    <button onclick="location.reload()" class="glass-button">Retry</button>
                </div>
            `;
        });
}

window.gm_authFailure = function() {
    console.error('Google Maps authentication failed');
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-error">
                <p><i class="bi bi-exclamation-triangle"></i> Google Maps failed to load</p>
                <p>Please check the API key configuration.</p>
            </div>
        `;
    }
};

window.initMap = initMap;
