function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 32.0853, lng: 34.7818 }
    });

    fetch('/api/location/with-location', {
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch locations');
            return res.json();
        })
        .then(users => {
            users.forEach(user => {
                if (!user.location) return;

                const marker = new google.maps.Marker({
                    position: user.location,
                    map,
                    title: user.fullName
                });

                const info = new google.maps.InfoWindow({
                    content: `
            <strong>${user.fullName}</strong><br/>
            ${user.city}<br/>
            <a href="/users/${user._id}">View Profile</a>
          `
                });

                marker.addListener('click', () => info.open(map, marker));
            });
        })
        .catch(err => {
            console.error('Failed to load user locations:', err);
        });
}

window.initMap = initMap;
