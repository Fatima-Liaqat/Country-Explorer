document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENT REFERENCES ---
    // Pop-ups and Overlays
    const pageBackdrop = document.getElementById('page-backdrop');
    const agePopup = document.querySelector('.age-popup-validator');
    const dobPopup = document.querySelector('.dob');
    const mainContent = document.querySelector('main');
    const confirmationDialog = document.getElementById('confirmation-dialog');

    // Restriction Messages
    const simpleRestriction = document.getElementById('restricted');
    const dobRestriction = document.getElementById('restrict');

    // Buttons
    const ageSubmitBtn = document.getElementById('submit');
    const dobSubmitBtn = document.querySelector('.submit-dob');
    const resetBtn = document.getElementById("reset");
    const yesButton = document.getElementById('yesbtn');
    const noButton = document.getElementById('nobtn');
    
    // Inputs and Forms
    const ageInput = document.getElementById('age-input');
    const daySelect = document.getElementById('day-select');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const searchForm = document.getElementById('country-search-form');
    const searchInput = document.getElementById('country-search-input');
    
    // Display Areas
    const ipDisplay = document.querySelector(".current-ip");
    const countryDisplay = document.querySelector(".current-country");
    const ageDisplay = document.querySelector('.present-age');
    const flagImg = document.getElementById('flagImage');
    const errorP = document.getElementById('errorMsg');
    const nameP = document.querySelector('.name');
    const capitalP = document.querySelector('.capital');
    const factP = document.querySelector('.fact');
    const startP = document.querySelector('.start');
    const confirmationText = document.querySelector('.confirmation');

    
    
    let homeCountryName = '';

    //IP Address and Country

    function fetchAndDisplayIP() 
    {
        ipDisplay.textContent = "Loading...";
        countryDisplay.textContent = "Loading...";
        fetch("https://api.2ip.io?token=fbgmp6r9uzeqc34f")
            .then(res => res.json())
            .then(data => 
            {
                localStorage.setItem("ip_address", data.ip);
                localStorage.setItem("country_name", data.country);
                ipDisplay.textContent = data.ip;
                countryDisplay.textContent = data.country;
                homeCountryName = data.country;
            })
            .catch(error => 
            {
                ipDisplay.textContent = "Not found";
                countryDisplay.textContent = "Not found";
                console.error("Error fetching IP data:", error);
            });
    }
    //Age Calculation Function
    function calculateAge(dob) 
    {
        const now = new Date();
        let ageYears = now.getFullYear() - dob.getFullYear();
        let ageMonths = now.getMonth() - dob.getMonth();
        let ageDays = now.getDate() - dob.getDate();
        if (ageDays < 0) 
        {
            ageMonths--;
            ageDays += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (ageMonths < 0) 
        {
            ageYears--;
            ageMonths += 12;
        }
        return { years: ageYears, months: ageMonths, days: ageDays };
    }
    //Country name, Flag, Capital, Area Display Function
    function fetchCountryData(countryName) 
    {
        nameP.textContent = 'Loading...';
        capitalP.textContent = '';
        factP.textContent = '';
        errorP.textContent = '';
        flagImg.style.display = 'none';
        startP.style.display = 'none';

        fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
            .then(res => 
            {
                if (!res.ok) throw new Error(`Country "${countryName}" not found.`);
                return res.json();
            })
            .then(data => 
            {
                searchInput.value = '';
                const countryData = data[0];
                flagImg.src = countryData.flags.svg || countryData.flags.png;
                flagImg.style.display = 'inline';
                nameP.innerHTML = `<strong>Name:</strong> ${countryData.name.common}`;
                 capitalP.innerHTML = `<strong>Capital:</strong> ${countryData.capital[0]}`; // Change to .innerHTML and add <strong>
                factP.innerHTML = `<strong>Area:</strong> ${countryData.area.toLocaleString()} km²`;
            })
            .catch(err => 
            {
                nameP.textContent = '';
                errorP.textContent = `⚠️ ${err.message}`;
                console.error(err);
            });
    }
    //Function to show Age Pop-up Validator
    
    function showSimpleAgePopup() 
    {
        pageBackdrop.style.display = 'block';
        agePopup.style.display = 'flex';
    }
    //Function to hide Age Pop-up and show Date of Birth Validator
    function showDobPopup() 
    {
        agePopup.style.display = 'none';
        dobPopup.style.display = 'flex';
    }
    //Function to show restriction
    function showRestriction(type) 
    {
        pageBackdrop.style.display = 'block';
        agePopup.style.display = 'none';
        dobPopup.style.display = 'none';
        if (type === 'simple') 
        {
            simpleRestriction.style.display = 'block';
        } 
        else 
        {
            dobRestriction.style.display = 'block';
        }
        localStorage.setItem('validationState', 'restricted');
    }
    //Function to show main Web App
    function showMainApplication() 
    {
        pageBackdrop.style.display = 'none';
        dobPopup.style.display = 'none';
        mainContent.style.display = 'block';

        fetchAndDisplayIP();

        const savedDay = localStorage.getItem("dob_day");
        const savedMonth = localStorage.getItem("dob_month");
        const savedYear = localStorage.getItem("dob_year");
        
        if(savedDay && savedMonth && savedYear) 
        {
            const dob = new Date(savedYear, savedMonth - 1, savedDay);
            const age = calculateAge(dob);
            ageDisplay.textContent = `${age.years} years, ${age.months} months, ${age.days} days`;
        }
    }
    //Function to Reset Local Storage
    function resetApplication() 
    {
        localStorage.clear();
        
        mainContent.style.display = 'none';
        dobPopup.style.display = 'none';
        simpleRestriction.style.display = 'none';
        dobRestriction.style.display = 'none';
        confirmationDialog.style.display = 'none';
        
        ageInput.value = '';
        searchInput.value = '';

        showSimpleAgePopup();
    }
    
   
    // Age Pop-up input Listener
    ageSubmitBtn.addEventListener('click', () => 
    {
        const age = parseInt(ageInput.value);
        if (isNaN(age)) return;

        localStorage.setItem('simpleAge', age);

        if (age < 18) 
        {
            showRestriction('simple');
        } 
        else 
        {
            showDobPopup();
        }
    });
    
    //Date of Birth Input Listener
    dobSubmitBtn.addEventListener('click', () => 
    {
        const day = parseInt(daySelect.value);
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        if (!day || !month || !year) 
        {
            alert("Please select a valid date.");
            return;
        }

        const dob = new Date(year, month - 1, day);
        const age = calculateAge(dob);
        
        if (age.years < 18) 
        {
            showRestriction('dob');
        } 
        else 
        {
            localStorage.setItem("dob_day", day);
            localStorage.setItem("dob_month", month);
            localStorage.setItem("dob_year", year);
            localStorage.setItem('validationState', 'validated');
            showMainApplication();
        }
    });

    // Country Search Input Listener
    searchForm.addEventListener('submit', (event) => 
    {
        event.preventDefault();
        const countryQuery = searchInput.value.trim();
        if (!countryQuery) 
            return;

        if (homeCountryName && countryQuery.toLowerCase() !== homeCountryName.toLowerCase()) 
        {
            confirmationText.textContent = `Your current country is ${homeCountryName}. Are you sure you want to search for ${countryQuery}?`;
            confirmationDialog.style.display = 'block';
        } 
        else 
        {
            fetchCountryData(countryQuery);
        }
    });
    // Confirmation accepted input Listener
    yesButton.addEventListener('click', () => 
    {
        confirmationDialog.style.display = 'none';
        const countryQuery = searchInput.value.trim();
        fetchCountryData(countryQuery);
    });
    // Confirmation denied input Listener
    noButton.addEventListener('click', () => 
    {
        confirmationDialog.style.display = 'none';
        searchInput.value = '';
    });

    resetBtn.addEventListener("click", resetApplication);
    
    
    
    // Populating DOB dropdowns 
    for (let d = 1; d <= 31; d++) 
    { 
        daySelect.add(new Option(d, d)); 
    }
    const monthNames = ["January", "February", "March", 
        "April", "May", "June", "July", "August", 
        "September", "October", "November", "December"];
    monthNames.forEach((month, index) => 
    { 
        monthSelect.add(new Option(month, index + 1)); 
    });
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 100; y--) 
    { 
        yearSelect.add(new Option(y, y)); 
    }

    //Local Storage Validation
    const validationState = localStorage.getItem('validationState');
    if (validationState === 'validated') 
    {
        showMainApplication();
    } 
    else if (validationState === 'restricted') 
    {
        showRestriction('simple'); 
    } 
    else 
    {
        showSimpleAgePopup();
    }
    //Dark/Light Theme Toogle
    const lightThemeBtn = document.querySelector('.light.theme');
    const darkThemeBtn = document.querySelector('.dark.theme');
    const body = document.body;

    darkThemeBtn.style.display = 'none';
    lightThemeBtn.addEventListener('click', () => 
    {    
        body.classList.add('dark-theme');   
        lightThemeBtn.style.display = 'none';
        darkThemeBtn.style.display = 'block';
    });

    darkThemeBtn.addEventListener('click', () => 
    {
        body.classList.remove('dark-theme');
        darkThemeBtn.style.display = 'none';
        lightThemeBtn.style.display = 'block';
    });
});