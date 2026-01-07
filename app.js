// Utility for formatting time
const formatTime = (date, timezone = 'local', showSeconds = true) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        hour12: false
    };
    if (timezone !== 'local') options.timeZone = timezone;
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Utility for formatting date
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

const getOffset = (timezone) => {
    const date = new Date();
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const diff = (targetDate - localDate) / (1000 * 60 * 60);
    return `GMT ${diff >= 0 ? '+' : ''}${diff}`;
};

// UI Elements
const currentTimeEl = document.getElementById('currentTime');
const currentDateEl = document.getElementById('currentDate');
const currentZoneEl = document.getElementById('currentZone');
const timeSlider = document.getElementById('timeSlider');
const resetSlider = document.getElementById('resetSlider');
const citySearch = document.getElementById('citySearch');
const searchResults = document.getElementById('searchResults');
const clocksGrid = document.getElementById('worldClocks');
const template = document.getElementById('clockCardTemplate');

let addedCities = JSON.parse(localStorage.getItem('timebuddy_cities')) || [
    { name: 'London', country: 'UK', zone: 'Europe/London' },
    { name: 'New York', country: 'USA', zone: 'America/New_York' },
    { name: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' }
];

let baseDate = new Date();
let sliderOffsetMinutes = 0;

// Update Hero Clock
const updateHeroClock = () => {
    const displayDate = new Date(baseDate.getTime() + (sliderOffsetMinutes * 60 * 1000));
    currentTimeEl.textContent = formatTime(displayDate);
    currentDateEl.textContent = formatDate(displayDate);
    currentZoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ');
};

// Update World Cards
const updateWorldCards = () => {
    clocksGrid.innerHTML = '';
    const displayDate = new Date(baseDate.getTime() + (sliderOffsetMinutes * 60 * 1000));

    addedCities.forEach((city, index) => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.clock-card');
        
        clone.querySelector('.city-name').textContent = city.name;
        clone.querySelector('.country-name').textContent = city.country;
        clone.querySelector('.city-time').textContent = formatTime(displayDate, city.zone, false);
        clone.querySelector('.city-offset').textContent = getOffset(city.zone);
        
        clone.querySelector('.remove-btn').addEventListener('click', () => {
            addedCities.splice(index, 1);
            saveCities();
            updateWorldCards();
        });

        clocksGrid.appendChild(clone);
    });
};

const saveCities = () => {
    localStorage.setItem('timebuddy_cities', JSON.stringify(addedCities));
};

// Slider logic
timeSlider.addEventListener('input', (e) => {
    const totalMinutesSinceMidnight = parseInt(e.target.value);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const targetDate = new Date(startOfDay.getTime() + (totalMinutesSinceMidnight * 60 * 1000));
    
    sliderOffsetMinutes = (targetDate.getTime() - now.getTime()) / (60 * 1000);
    updateHeroClock();
    updateWorldCards();
});

resetSlider.addEventListener('click', () => {
    sliderOffsetMinutes = 0;
    const now = new Date();
    const minutesSinceMidnight = (now.getHours() * 60) + now.getMinutes();
    timeSlider.value = minutesSinceMidnight;
    updateHeroClock();
    updateWorldCards();
});

// Search functionality (Simple static list for demo, ideally uses a timezone API)
const citiesData = [
    { name: 'Paris', country: 'France', zone: 'Europe/Paris' },
    { name: 'Dubai', country: 'UAE', zone: 'Asia/Dubai' },
    { name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore' },
    { name: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
    { name: 'San Francisco', country: 'USA', zone: 'America/Los_Angeles' },
    { name: 'Berlin', country: 'Germany', zone: 'Europe/Berlin' },
    { name: 'Mumbai', country: 'India', zone: 'Asia/Kolkata' },
    { name: 'Seoul', country: 'South Korea', zone: 'Asia/Seoul' },
    { name: 'Toronto', country: 'Canada', zone: 'America/Toronto' }
];

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

    if (filtered.length > 0) {
        filtered.forEach(city => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.textContent = `${city.name}, ${city.country}`;
            div.addEventListener('click', () => {
                if (!addedCities.find(c => c.zone === city.zone)) {
                    addedCities.push(city);
                    saveCities();
                    updateWorldCards();
                }
                citySearch.value = '';
                searchResults.style.display = 'none';
            });
            searchResults.appendChild(div);
        });
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
});

// Close search if clicking outside
document.addEventListener('click', (e) => {
    if (!citySearch.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Initialization
const init = () => {
    const now = new Date();
    const minutesSinceMidnight = (now.getHours() * 60) + now.getMinutes();
    timeSlider.value = minutesSinceMidnight;

    setInterval(() => {
        baseDate = new Date();
        if (sliderOffsetMinutes === 0) {
            updateHeroClock();
            updateWorldCards();
        }
    }, 1000);

    updateHeroClock();
    updateWorldCards();
};

init();
