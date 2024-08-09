document.addEventListener('DOMContentLoaded', function() {
    // Load content from JSON file
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            // Populate content
            populateContent(data);
        })
        .catch(error => console.error('Error loading content:', error));

    function populateContent(content) {
        document.documentElement.style.setProperty('--color-dark-gray', content.color1);
        document.documentElement.style.setProperty('--color-light-gray', content.color2);
        document.documentElement.style.setProperty('--color-medium-gray', content.color3);
        document.documentElement.style.setProperty('--color-off-white', content.color4);
        document.documentElement.style.setProperty('--color-dark-gray-transparent', content.color5);
        // Set page title
        document.title = content.siteTitle;
        document.querySelector('.logo').textContent = content.siteTitle;

        // Populate navigation
        const navUl = document.querySelector('nav ul');
        content.navigation.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.link}">${item.label}</a>`;
            navUl.appendChild(li);
        });

        addSmoothScrolling();

        // Set hero content
        document.querySelector('#hero h1').textContent = content.hero.title;
        document.querySelector('#hero .date').textContent = content.hero.date;
        document.querySelector('#hero .cta-button').textContent = content.hero.ctaButton.text;
        document.querySelector('#hero').style.backgroundImage = `url(${content.hero.backgroundImage})`;

        // Set introduction content
        document.querySelector('#intro h2').textContent = content.introduction.title;
        document.querySelector('#intro p').textContent = content.introduction.content;
        document.querySelector('#agenda img').src = content.agenda.image;

        // Populate speakers
        const speakerGrid = document.querySelector('.speaker-grid');
        content.speakers.list.forEach(speaker => {
            const speakerCard = document.createElement('div');
            speakerCard.className = 'speaker-card';
            speakerCard.innerHTML = `
                <img src="${speaker.photo}" alt="${speaker.name}">
                <h3>${speaker.name}</h3>
                <p class="title">${speaker.title}</p>
                <div class="description">
                    <p>${speaker.description}</p>
                </div>
            `;
            speakerGrid.appendChild(speakerCard);
        });


        // Populate Documents
        const documentsContent = document.querySelector('.documents-content');
        content.documents.items.forEach(item => {
            const documentItem = document.createElement('a');
            documentItem.href = `./documents/${item.no}.html`;
            documentItem.target = "_blank";
            documentItem.innerHTML = `
                <div class="documents-item"><h3>${item.titles}</h3><p class="author">- ${item.author}</p></div> 
            `;
            documentsContent.appendChild(documentItem);
        });

        // Populate FAQ
        const faqContent = document.querySelector('.faq-content');
        content.faq.items.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <h3>${item.question}</h3>
                <p>${item.answer}</p>
            `;
            faqContent.appendChild(faqItem);
        });

        // Set registration content
        document.querySelector('#register h2').textContent = content.registration.title;
        const registerOptions = document.querySelector('.register-options');
        content.registration.options.forEach(option => {
            const registerButton = document.createElement('a');
            registerButton.href = option.link;
            registerButton.className = 'register-button';
            registerButton.innerHTML = `<img src="${option.image}" alt="Sign Up Website">`;
            registerOptions.appendChild(registerButton);
        });

        const footerGrid = document.querySelector('.footer-grid');

        // Organizer (always show)
        const organizerSection = document.createElement('div');
        organizerSection.className = 'organizers';
        organizerSection.innerHTML = `
            <h3>${content.footer.organizer.title}</h3>
            <img src="${content.footer.organizer.image}" alt="Organizer">
        `;
        footerGrid.appendChild(organizerSection);

        // Co-organizer (show only if image is not empty)
        if (content.footer.coOrganizer.image !== "") {
            const coOrganizerSection = document.createElement('div');
            coOrganizerSection.className = 'co-organizers';
            coOrganizerSection.innerHTML = `
                <h3>${content.footer.coOrganizer.title}</h3>
                <img src="${content.footer.coOrganizer.image}" alt="Co-organizer">
            `;
            footerGrid.appendChild(coOrganizerSection);
        }

        // Sponsor (show only if image is not empty)
        if (content.footer.sponsor.image !== "") {
            const sponsorSection = document.createElement('div');
            sponsorSection.className = 'sponsors';
            sponsorSection.innerHTML = `
                <h3>${content.footer.sponsor.title}</h3>
                <img src="${content.footer.sponsor.image}" alt="Sponsor">
            `;
            footerGrid.appendChild(sponsorSection);
        }

        // Contact (always show)
        const contactSection = document.createElement('div');
        contactSection.className = 'contact';
        contactSection.innerHTML = `
            <h3>${content.footer.contact.title}</h3>
            <p>Phone: ${content.footer.contact.phone}</p>
            <p>Address: ${content.footer.contact.address}</p>
        `;
        footerGrid.appendChild(contactSection);

        // Set event date for countdown
        const eventDate = new Date(content.registration.eventDate).getTime();
        updateCountdown(eventDate);
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    function addSmoothScrolling() {
        document.querySelector('nav').addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Countdown timer
    function updateCountdown(eventDate) {
        const countdownElement = document.getElementById('countdown');

        function update() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `Event starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

            if (distance < 0) {
                clearInterval(countdownTimer);
                countdownElement.innerHTML = "Event has started!";
            }
        }

        const countdownTimer = setInterval(update, 1000);
        update(); // Initial call to avoid delay
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        document.querySelector('#hero').style.backgroundPositionY = scrollPosition * 0.7 + 'px';
    });
});