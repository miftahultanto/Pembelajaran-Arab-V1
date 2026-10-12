/* ============================================================
   Widget Pemutar Musik Latar — "Belajar Bersama"
   Dibuat otomatis di setiap halaman tanpa perlu edit HTML.

   CATATAN: Daftar lagu di bawah memakai lagu instrumental demo
   GRATIS dari SoundHelix (https://www.soundhelix.com) sebagai
   placeholder. Untuk memakai lagu Anda sendiri, letakkan file
   mp3 di folder audio/ lalu ganti nilai `src` di bawah, misal:
       src: 'audio/lagu-1.mp3'
   ============================================================ */
(function () {
    'use strict';

    /* ===== Daftar lagu (playlist) ===== */
    var PLAYLIST = [
        { title: 'Lembut Pagi',   artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { title: 'Senja di Pasar', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { title: 'Langkah Pasti',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ];

    /* ===== Bangun elemen widget ===== */
    var wrap = document.createElement('div');
    wrap.className = 'music-player';
    wrap.id = 'musicPlayer';

    var listItems = PLAYLIST.map(function (t, i) {
        return '<li class="music-item" data-index="' + i + '"><span class="music-item-num">' + (i + 1) + '</span><span class="music-item-title">' + t.title + '</span></li>';
    }).join('');

    wrap.innerHTML =
        '<div class="music-card" id="musicCard">' +
            '<div class="music-head">' +
                '<div class="music-cover"><i class="fa-solid fa-music"></i></div>' +
                '<div class="music-info">' +
                    '<span class="music-now">Daftar putar latar</span>' +
                    '<strong class="music-title" id="musicTitle">' + PLAYLIST[0].title + '</strong>' +
                    '<span class="music-artist" id="musicArtist">' + PLAYLIST[0].artist + '</span>' +
                '</div>' +
                '<div class="music-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
            '</div>' +
            '<div class="music-controls">' +
                '<button class="mp-btn" id="mpPrev" aria-label="Lagu sebelumnya"><i class="fa-solid fa-backward-step"></i></button>' +
                '<button class="mp-btn mp-play" id="mpPlay" aria-label="Putar atau jeda"><i class="fa-solid fa-play" id="mpPlayIcon"></i></button>' +
                '<button class="mp-btn" id="mpNext" aria-label="Lagu berikutnya"><i class="fa-solid fa-forward-step"></i></button>' +
                '<button class="mp-btn mp-list-toggle" id="mpListBtn" aria-label="Tampilkan daftar lagu"><i class="fa-solid fa-list-ul"></i></button>' +
            '</div>' +
            '<div class="music-volume">' +
                '<i class="fa-solid fa-volume-low"></i>' +
                '<input type="range" id="mpVolume" min="0" max="100" value="60" aria-label="Volume">' +
            '</div>' +
            '<ul class="music-list" id="mpList">' + listItems + '</ul>' +
        '</div>' +
        '<button class="music-mini" id="mpMini" aria-label="Buka pemutar musik"><i class="fa-solid fa-music"></i></button>';

    document.body.appendChild(wrap);

    /* ===== Elemen & state ===== */
    var audio     = new Audio();
    var card      = document.getElementById('musicCard');
    var mini      = document.getElementById('mpMini');
    var playBtn   = document.getElementById('mpPlay');
    var playIcon  = document.getElementById('mpPlayIcon');
    var prevBtn   = document.getElementById('mpPrev');
    var nextBtn   = document.getElementById('mpNext');
    var listBtn   = document.getElementById('mpListBtn');
    var listEl    = document.getElementById('mpList');
    var titleEl   = document.getElementById('musicTitle');
    var artistEl  = document.getElementById('musicArtist');
    var volumeEl  = document.getElementById('mpVolume');

    var current = 0;
    audio.volume = 0.6;
    audio.preload = 'none';

    /* ===== Fungsi bantu ===== */
    function loadTrack(i, autoplay) {
        current = (i + PLAYLIST.length) % PLAYLIST.length;
        audio.src = PLAYLIST[current].src;
        titleEl.textContent = PLAYLIST[current].title;
        artistEl.textContent = PLAYLIST[current].artist;
        // Tandai lagu aktif di daftar
        var items = listEl.querySelectorAll('.music-item');
        items.forEach(function (el, idx) {
            el.classList.toggle('active', idx === current);
        });
        if (autoplay) play();
    }

    function play() {
        var p = audio.play();
        if (p && p.catch) p.catch(function () { /* autoplay diblokir browser — biarkan */ });
    }

    function setPlayingUI(isPlaying) {
        card.classList.toggle('playing', isPlaying);
        playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }

    /* ===== Kontrol ===== */
    playBtn.addEventListener('click', function () {
        if (audio.paused) {
            if (!audio.src) loadTrack(current, false);
            play();
        } else {
            audio.pause();
        }
    });

    prevBtn.addEventListener('click', function () { loadTrack(current - 1, true); });
    nextBtn.addEventListener('click', function () { loadTrack(current + 1, true); });

    listBtn.addEventListener('click', function () {
        var open = listEl.classList.toggle('open');
        listBtn.classList.toggle('active', open);
    });

    listEl.addEventListener('click', function (e) {
        var item = e.target.closest('.music-item');
        if (item) loadTrack(parseInt(item.dataset.index, 10), true);
    });

    volumeEl.addEventListener('input', function () {
        audio.volume = volumeEl.value / 100;
    });

    /* Ciutkan ke tombol mini */
    document.getElementById('mpMini').addEventListener('click', function () {
        card.hidden = false;
        mini.hidden = true;
    });

    /* Sembunyikan card → tampilkan mini (tombol collapse di head card) */
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'mp-btn mp-collapse';
    collapseBtn.setAttribute('aria-label', 'Ciutkan pemutar');
    collapseBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    wrap.querySelector('.music-head').appendChild(collapseBtn);

    collapseBtn.addEventListener('click', function () {
        card.hidden = true;
        mini.hidden = false;
    });

    /* ===== Event audio ===== */
    audio.addEventListener('play',  function () { setPlayingUI(true); });
    audio.addEventListener('pause', function () { setPlayingUI(false); });
    audio.addEventListener('ended', function () { loadTrack(current + 1, true); });

    /* Jika satu lagu gagal dimuat, coba lagu berikutnya */
    audio.addEventListener('error', function () {
        if (PLAYLIST.length > 1) loadTrack(current + 1, false);
    });

    /* ===== Mulai: muat lagu pertama (tanpa autoplay) ===== */
    loadTrack(0, false);
})();
