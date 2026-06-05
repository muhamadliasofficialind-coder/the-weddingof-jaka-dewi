// ==========================================
// 1. SISTEM PEMBUKA UNDANGAN & MUSIK
// ==========================================
const btnOpenInvitation = document.getElementById("btn-open-invitation");
const coverSection = document.getElementById("cover-section");
const weddingMusic = document.getElementById("wedding-music");
const musicControl = document.getElementById("music-control");

if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener("click", function() {
        // Hilangkan efek locked pada body agar bisa di-scroll
        document.body.classList.remove("locked");
        
        // Geser cover ke atas dan sembunyikan
        if (coverSection) {
            coverSection.style.transform = "translateY(-100%)";
            coverSection.style.opacity = "0";
            setTimeout(() => {
                coverSection.style.display = "none";
            }, 800);
        }

        // Putar musik secara otomatis setelah tombol diklik
        if (weddingMusic) {
            weddingMusic.play().then(() => {
                if (musicControl) {
                    musicControl.style.display = "flex";
                    musicControl.classList.add("playing");
                }
                // Jalankan efek kelopak bunga gugur
                initFlowerFall();
            }).catch(error => {
                console.log("Autoplay musik diblokir oleh browser, memerlukan interaksi manual.");
                if (musicControl) musicControl.style.display = "flex";
            });
        }
    });
}

// Kontrol On/Off Musik Manual lewat Tombol Piringan hitam
if (musicControl && weddingMusic) {
    musicControl.addEventListener("click", function() {
        if (weddingMusic.paused) {
            weddingMusic.play();
            musicControl.classList.add("playing");
        } else {
            weddingMusic.pause();
            musicControl.classList.remove("playing");
        }
    });
}

function handleRsvpSubmit(event) {
    event.preventDefault(); // Mencegah halaman reload

    const nama = document.getElementById('rsvp-name').value;
    const status = document.getElementById('rsvp-status').value;
    const ucapan = document.getElementById('rsvp-message').value;
    const btn = event.target.querySelector('button');

    btn.innerHTML = 'Mengirim...';
    btn.disabled = true;

    // Ganti URL di bawah dengan URL Web App yang Anda dapatkan dari Apps Script tadi
    const scriptURL = 'https://script.google.com/macros/s/AKfycbycsWpf98ybLO-j5ufJn-Cn5dPHtRoK7JCu3dB3OFrYwrVECrStlZrZUemmfFcnwZh1/exec';

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('status', status);
    formData.append('ucapan', ucapan);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            alert('Terima kasih! RSVP Anda telah terkirim.');
            event.target.reset(); // Mengosongkan form
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
            btn.disabled = false;
        })
        .catch(error => {
            alert('Terjadi kesalahan, coba lagi.');
            btn.disabled = false;
        });
}

// ==========================================
// --- LIVE COUNTDOWN TIMERS ---
function runWeddingCountdown() {
    // Set target tanggal: 07 Juni 2026 Jam 09:00 Pagi
    const weddingDate = new Date("Jun 7, 2026 09:00:00").getTime();
    const now = new Date().getTime();
    const timeDiff = weddingDate - now;

    if (timeDiff <= 0) {
        clearInterval(weddingIntervalId);
        // Teks opsional jika acara sudah lewat atau sedang berlangsung
        const countdownBox = document.querySelector(".countdown-container");
        if (countdownBox) countdownBox.innerHTML = "<p style='font-weight:bold; color:var(--primary-color);'>Acara Sedang Berlangsung / Selesai</p>";
        return;
    }

    const daysVal = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursVal = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesVal = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsVal = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    if (dEl) dEl.innerText = daysVal < 10 ? "0" + daysVal : daysVal;
    if (hEl) hEl.innerText = hoursVal < 10 ? "0" + hoursVal : hoursVal;
    if (mEl) mEl.innerText = minutesVal < 10 ? "0" + minutesVal : minutesVal;
    if (sEl) sEl.innerText = secondsVal < 10 ? "0" + secondsVal : secondsVal;
}
const weddingIntervalId = setInterval(runWeddingCountdown, 1000);

// ==========================================
// 3. ANIMASI SCROLL (INTERSECTION OBSERVER)
// ==========================================
function initScrollAnimations() {
    const animationOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, animationOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-popup');
    elementsToAnimate.forEach(element => animationObserver.observe(element));
}

// ==========================================
// 4. BOTTOM NAVIGATION HIGHLIGHTS
// ==========================================
function initBottomNav() {
    const sections = document.querySelectorAll('section, header, .hero');
    const navItems = document.querySelectorAll('.nav-item');

    if (navItems.length === 0) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });

        if (window.scrollY < 300) {
            navItems.forEach(item => item.classList.remove('active'));
            const homeBtn = document.querySelector('.nav-item[href="#hero-section"]');
            if (homeBtn) homeBtn.classList.add('active');
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ==========================================
// 5. ANIMASI EFEK BUNGA GUGUR (FLOWER FALL)
// ==========================================
function initFlowerFall() {
    const flowerImages = [
        'https://i.ibb.co/TDfb3rZK/pngwing-com.png',
        'https://i.ibb.co/TBYF5HMK/pngwing-com.png'
    ];
    
    setInterval(() => {
        if (document.body.classList.contains('locked')) return;

        const flower = document.createElement('div');
        flower.classList.add('flower-fall');
        
        const size = Math.random() * 15 + 10; 
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        flower.style.left = `${Math.random() * 100}vw`;
        flower.style.animationDuration = `${Math.random() * 3 + 4}s`;
        
        const img = document.createElement('img');
        img.src = flowerImages[Math.floor(Math.random() * flowerImages.length)];
        flower.appendChild(img);
        
        document.body.appendChild(flower);
        
        setTimeout(() => {
            flower.remove();
        }, 7000);
    }, 400);
}

// --- FUNGSI SALIN NO REKENING ---
function copyText(elementId, btnElement) {
    const textToCopy = document.getElementById(elementId).innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        btnElement.style.background = '#d4af37';
        btnElement.style.borderColor = '#d4af37';
        btnElement.style.color = '#fff';
        
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.background = 'rgba(255, 255, 255, 0.2)';
            btnElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            btnElement.style.color = 'white';
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
    });
}

// --- INTERAKSI FORM RSVP & LIVE UCAPAN ---
// Gabungan fungsi untuk simpan ke Database & Tampil di Layar secara Live
function handleRsvpSubmit(event) {
    event.preventDefault(); 

    const form = event.target;
    const btn = form.querySelector('button');
    const nama = document.getElementById('rsvp-name').value;
    const status = document.getElementById('rsvp-status').value;
    const ucapan = document.getElementById('rsvp-message').value;
    const wishesBox = document.getElementById('wishes-box');
    const emptyNotice = document.getElementById('empty-wish-notice');

    btn.innerHTML = 'Mengirim...';
    btn.disabled = true;

    // 1. Kirim ke Google Sheets
    // Pastikan URL di bawah adalah Web App URL yang sudah di-deploy sebagai 'Anyone'
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyGzkMYPtkpTKXow23cNGEv7LQ7fyUlYo4kSYs2lbPCRCjwYYqsh9SXXUga_8VbK0Ef/exec';
    
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('status', status);
    formData.append('ucapan', ucapan);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // 2. Jika sukses, tampilkan di layar secara live
            if (emptyNotice) emptyNotice.remove();
            
            let badgeClass = status === 'Hadir' ? 'hadir' : (status === 'Tidak Hadir' ? 'tidak-hadir' : 'tentatif');
            const newWish = document.createElement('div');
            newWish.className = 'wish-item';
            newWish.innerHTML = `
                <div class="wish-header">
                    <strong>${escapeHtml(nama)}</strong>
                    <span class="badge-status ${badgeClass}"><i class="fa-solid fa-circle-check"></i> ${status}</span>
                </div>
                <p>${escapeHtml(ucapan).replace(/\n/g, '<br>')}</p>
            `;
            wishesBox.insertBefore(newWish, wishesBox.firstChild);

            alert('Terima kasih! Ucapan & kehadiran Anda telah tersimpan.');
            form.reset();
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Ucapan';
            btn.disabled = false;
        })
        .catch(error => {
            alert('Terjadi kesalahan, silakan coba lagi.');
            btn.disabled = false;
        });
}

// Fungsi pengaman karakter HTML agar web terhindar dari XSS injection
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Jalankan semua modul ketika dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    runWeddingCountdown();
    initScrollAnimations();
    initBottomNav();
});

// Fungsi untuk memuat ucapan dari Google Sheets saat halaman terbuka
function loadWishes() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyGzkMYPtkpTKXow23cNGEv7LQ7fyUlYo4kSYs2lbPCRCjwYYqsh9SXXUga_8VbK0Ef/exec'; // Gunakan URL yang sama
    const wishesBox = document.getElementById('wishes-box');

    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            const emptyNotice = document.getElementById('empty-wish-notice');
            if (emptyNotice && data.length > 0) emptyNotice.remove();

            data.reverse().forEach(wish => {
                let badgeClass = wish.status === 'Hadir' ? 'hadir' : (wish.status === 'Tidak Hadir' ? 'tidak-hadir' : 'tentatif');
                const newWish = document.createElement('div');
                newWish.className = 'wish-item';
                newWish.innerHTML = `
                    <div class="wish-header">
                        <strong>${escapeHtml(wish.nama)}</strong>
                        <span class="badge-status ${badgeClass}"><i class="fa-solid fa-circle-check"></i> ${wish.status}</span>
                    </div>
                    <p>${escapeHtml(wish.ucapan).replace(/\n/g, '<br>')}</p>
                `;
                wishesBox.appendChild(newWish);
            });
        });
}

// Jalankan fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadWishes);