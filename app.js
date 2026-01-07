// Core Logic for WTB Redesign
const citiesContainer = document.getElementById('cityRowsContainer');
const template = document.getElementById('cityRowTemplate');
const citySearch = document.getElementById('citySearch');
const searchResults = document.getElementById('searchResults');
const headerDate = document.getElementById('headerDate');
const resetBtn = document.getElementById('resetBtn');

let selectedHour = new Date().getHours(); // 0-23
let currentBaseDate = new Date();

let addedCities = JSON.parse(localStorage.getItem('timebuddy_wtb_cities')) || [
    { name: 'London', country: 'UK', zone: 'Europe/London' },
    { name: 'Cairo', country: 'Egypt', zone: 'Africa/Cairo' },
    { name: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' }
];

const citiesData = [
    { name: 'New York', country: 'USA', zone: 'America/New_York' },
    { name: 'San Francisco', country: 'USA', zone: 'America/Los_Angeles' },
    { name: 'Paris', country: 'France', zone: 'Europe/Paris' },
    { name: 'Dubai', country: 'UAE', zone: 'Asia/Dubai' },
    { name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore' },
    { name: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
    { name: 'Mumbai', country: 'India', zone: 'Asia/Kolkata' },
    { name: 'Berlin', country: 'Germany', zone: 'Europe/Berlin' },
    { name: 'Moscow', country: 'Russia', zone: 'Europe/Moscow' }
];

const saveCities = () => {
    localStorage.setItem('timebuddy_wtb_cities', JSON.stringify(addedCities));
};

const formatCityTime = (date, zone) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: zone
    }).format(date);
};

const getOffset = (zone) => {
    const now = new Date();
    const tzString = now.toLocaleString('en-US', { timeZone: zone });
    const localString = now.toLocaleString('en-US');

    // Simplistic offset calculation for display
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(now);
    const tzName = parts.find(p => p.type === 'timeZoneName').value;
    return tzName;
};

const renderRows = () => {
    citiesContainer.innerHTML = '';
    headerDate.textContent = currentBaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    addedCities.forEach((city, cityIndex) => {
        const clone = template.content.cloneNode(true);
        const row = clone.querySelector('.city-row');

        clone.querySelector('.city-name').textContent = city.name;
        clone.querySelector('.city-meta').textContent = `${city.country}, ${getOffset(city.zone)}`;

        const timeAtCity = formatCityTime(currentBaseDate, city.zone);
        clone.querySelector('.current-city-time').textContent = timeAtCity;

        const grid = clone.querySelector('.hours-grid');

        // Calculate city's local hour to center the timeline
        const cityDate = new Date(currentBaseDate.toLocaleString('en-US', { timeZone: city.zone }));
        const currentHourAtCity = cityDate.getHours();

        for (let i = 0; i < 24; i++) {
            const cell = document.createElement('div');
            cell.className = 'hour-cell';

            // Calculate what hour this cell represents relative to current selection
            // We want the grid to show a 24h block
            const hour = i;
            const isNight = hour < 7 || hour > 19;
            if (isNight) cell.classList.add('night');

            let displayHour = hour % 12 || 12;
            let ampm = hour < 12 ? 'am' : 'pm';
            cell.textContent = hour === 0 ? '12am' : (hour === 12 ? '12pm' : hour % 12);

            if (hour === currentHourAtCity) {
                cell.classList.add('active-highlight');
            }

            cell.addEventListener('mouseenter', () => highlightHour(i));
            grid.appendChild(cell);
        }

        clone.querySelector('.remove-btn').addEventListener('click', () => {
            addedCities.splice(cityIndex, 1);
            saveCities();
            renderRows();
        });

        citiesContainer.appendChild(clone);
    });
};

const highlightHour = (hourIndex) => {
    const allRows = document.querySelectorAll('.city-row');
    allRows.forEach(row => {
        const cells = row.querySelectorAll('.hour-cell');
        cells.forEach((cell, idx) => {
            if (idx === hourIndex) {
                cell.classList.add('active-highlight');
            } else {
                // Keep the "current" time highlight for the city if it's not the hovered one
                // Actually WTB usually moves the highlight bar. Let's simplify.
                cell.classList.remove('active-highlight');
            }
        });
    });
};

// Search logic
citySearch.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    searchResults.innerHTML = '';
    if (val.length < 2) {
        searchResults.style.display = 'none';
        return;
    }

    const filtered = citiesData.filter(c =>
        c.name.toLowerCase().includes(val) ||
        c.country.toLowerCase().includes(val)
    );

    filtered.forEach(city => {
        const div = document.createElement('div');
        div.className = 'search-item';
        div.textContent = `${city.name}, ${city.country}`;
        div.addEventListener('click', () => {
            if (!addedCities.find(c => c.zone === city.zone)) {
                addedCities.push(city);
                saveCities();
                renderRows();
            }
            citySearch.value = '';
            searchResults.style.display = 'none';
        });
        searchResults.appendChild(div);
    });

    searchResults.style.display = filtered.length ? 'block' : 'none';
});

resetBtn.addEventListener('click', () => {
    currentBaseDate = new Date();
    renderRows();
});

// Sync clock every minute
setInterval(() => {
    currentBaseDate = new Date();
    renderRows();
}, 60000);

// Init
renderRows();
