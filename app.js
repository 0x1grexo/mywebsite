  const dialUpAudio = new Audio('sounds/dialup_screech.mp3'); // I forgot this existed, went off page to make something else and got confused by my own easter egg...
  dialUpAudio.loop = true;

  let sessionStart = sessionStorage.getItem('sessionStartTime');
  if (!sessionStart) {
    sessionStart = Date.now();
    sessionStorage.setItem('sessionStartTime', sessionStart);
  }

  function updateTimer() {
    const now = Date.now();
    const totalSeconds = Math.floor((now - sessionStart) / 1000);
    
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${mins}:${secs}`;

    if (totalSeconds === 1800 && document.hidden) {
      dialUpAudio.play().catch(err => console.log("Audio play blocked until user interaction."));
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      dialUpAudio.pause();
      dialUpAudio.currentTime = 0;
    }
  });

  updateTimer();
  setInterval(updateTimer, 1000);

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.altKey && e.key === 't') {
    window.location.href = 'terminal.html';
  }
});
  
function playMailSound(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const originalText = link.innerHTML;
    const audio = document.getElementById('mailSound');
    
    link.style.opacity = '0.5';
    link.innerText = 'Opening...'; 

    audio.play().catch(err => console.log("Audio play blocked"));

    setTimeout(() => {
        const hiddenLink = document.createElement('a');
        hiddenLink.href = link.href;
        hiddenLink.target = '_blank'; 
        
        document.body.appendChild(hiddenLink);
        hiddenLink.click();
        document.body.removeChild(hiddenLink);

        setTimeout(() => {
            link.style.opacity = '1';
            link.innerHTML = originalText;
        }, 2000);
    }, 800);
}


function setLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
    });
    localStorage.setItem('preferred-lang', lang);
}

const savedLang = localStorage.getItem('preferred-lang') || 'et';
setLanguage(savedLang);

document.getElementById('current-year').textContent = new Date().getFullYear();

function updateDarkModeUI(isDark) {
    const icon = document.getElementById('mode-icon');
    const etText = document.getElementById('mode-text');
    const enText = document.getElementById('mode-text-en');
    
    if (isDark) {
        document.body.classList.add('dark-mode');
        icon.textContent = '☀️';
        etText.textContent = 'Hele režiim';
        enText.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        icon.textContent = '🌙';
        etText.textContent = 'Tume režiim';
        enText.textContent = 'Dark Mode';
    }
}

function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeUI(isDark);
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') updateDarkModeUI(true);

const bttButton = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        bttButton.style.display = "block";
    } else {
        bttButton.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered! Scope:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

async function sharePortfolio() {
    const shareData = {
        title: 'Gregor Opmann – Portfoolio',
        text: 'Vaata Gregor Opmanni IT-portfooliot!',
        url: 'https://gregoropmann.github.io/aboutme/'
    };

    const msgEl = document.getElementById('share-msg');
    const lang = localStorage.getItem('preferred-lang') || 'et';

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText('https://gregoropmann.github.io/aboutme/');
            msgEl.innerText = lang === 'et' ? 'Link kopeeritud lõikelauale!' : 'Link copied to clipboard!';
            msgEl.style.opacity = '1';
            
            setTimeout(() => {
                msgEl.style.opacity = '0';
            }, 2000);
        }
    } catch (err) {
        console.log('Sharing failed', err);
    }
}
