// Utilisation du mode strict pour limiter les expressions utilisées et éviter une partie des erreurs
'use strict';

// ATTENTE DU CHARGEMENT DU DOM
window.onload = async () => {

    //récupération de la playlist
    async function loadPlaylist() {
        try {
            const response = await fetch("../data/playlist.json");
            const data = await response.json();
            const playlist = await data.playlist;
            return playlist;
        } catch (error) {
            console.error("problem to retrieve playlist");
        }
    };

    //chargement de la playlist
    let playlist = await loadPlaylist();

    //création du lecteur
    let myAudioPlayer = new Audio();

    //création de l'index de lecture;
    /*
    * @param {integer} trackIndex - The index of the current playing track 
    */
    let trackIndex = 0;

    checkHour();




    //fonction pour charger la first track
    async function loadFirstTrack(trackNumber) {
        //chargement de la playlist

        myAudioPlayer.src = `./music/${playlist[trackNumber].src}`;
        myAudioPlayer.currentTime = 0;

        document.getElementById('trackImg').src = `./img/${playlist[trackNumber].cover}`;
        document.getElementById('trackTitle').innerHTML = `${playlist[trackNumber].title}`;
        document.getElementById('trackArtist').innerHTML = `${playlist[trackNumber].artist}`;
        document.getElementById('tableList').innerHTML = "";

        playlist.forEach(track => {
            if (playlist.indexOf(track) === trackIndex) {
                document.getElementById('tableList').innerHTML +=
                    `<tr data-index="${playlist.indexOf(track)}" class="playingNow">
                    <td>${track.music}</td>
                    <td>${track.artist}</td>
                    <td>${track.title}</td>
                </tr>`
            } else {
                document.getElementById('tableList').innerHTML +=
                    `<tr data-index="${playlist.indexOf(track)}">
                    <td>${track.music}</td>
                    <td>${track.artist}</td>
                    <td>${track.title}</td>
                </tr>`
            }

        });

        //chargement de la liste de lecture
        let trackList = document.querySelectorAll('tr');


        trackList.forEach(track => {
            track.addEventListener("dblclick", (event) => {
                let targetTrack = event.target.closest('tr');
                trackIndex = parseInt(targetTrack.dataset.index);
                loadTrack(trackIndex);

                const wave01 = document.getElementById('wave01');
                const wave02 = document.getElementById('wave02');

                if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
                    wave01.classList.add('animateWave01');
                    wave02.classList.add('animateWave02');
                }

                if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
                    wave01.classList.remove('closingWave01');
                    wave02.classList.remove('closingWave02');
                }

            })
        })
    }

    //chargement de la première piste
    await loadFirstTrack(trackIndex);

    //fonction de loadingtrack
    async function loadTrack(trackNumber) {

        await loadFirstTrack(trackNumber);

        myAudioPlayer.play();

        if (pauseBtn.classList.contains("hide")) {
            playBtn.classList.add("hide");
            pauseBtn.classList.remove("hide");
        };

    };



    /* CONTROL PANEL */
    //récupération des boutons du control panel
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const previousBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');


    playBtn.addEventListener('click', () => {
        myAudioPlayer.play();
        playBtn.classList.add('hide');
        pauseBtn.classList.remove('hide');

        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    pauseBtn.addEventListener('click', () => {
        myAudioPlayer.pause();
        document.getElementById('wave01').classList.add('closingWave01');
        document.getElementById('wave02').classList.add('closingWave02');
        pauseBtn.classList.add('hide');
        playBtn.classList.remove('hide');
    });

    previousBtn.addEventListener('click', async () => {
        --trackIndex;
        let playlist = await loadPlaylist();
        if (trackIndex < 0) {
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else if (trackIndex > playlist.length - 1) {
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    nextBtn.addEventListener('click', async () => {
        ++trackIndex;
        let playlist = await loadPlaylist();
        if (trackIndex < 0) {
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else if (trackIndex > playlist.length - 1) {
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    //changement de piste après la fin
    myAudioPlayer.addEventListener('ended', async () => {
        ++trackIndex;
        let playlist = await loadPlaylist();
        if (trackIndex < 0) {
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else if (trackIndex > playlist.length - 1) {
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })




    /* VOLUME INTERFACE */
    //recupération des boutons de l'interface volume
    const volumeInput = document.getElementById('volumeInput');
    const muteBtn = document.getElementById('muteBtn');

    //variable de switch mute/unmute
    let trackMuted = false;

    function volumeChange() {

        let currentVolume = parseInt(volumeInput.value) / 100;
        myAudioPlayer.volume = currentVolume;
    }

    muteBtn.addEventListener('click', () => {

        if (trackMuted === false) {
            trackMuted = true;
            myAudioPlayer.volume = 0;
            document.getElementById('muteBtn').innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
        } else {
            trackMuted = false;
            volumeChange();
            document.getElementById('muteBtn').innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        }
    })

    volumeInput.addEventListener('change', () => {
        volumeChange();
    });



    /* TRACK TIME PARAMETERS */

    //recuperation des afficheurs
    let trackCurrentTime = document.getElementById('trackCurrentTime');
    let trackTimeLeft = document.getElementById('trackTimeLeft');
    let trackDuration = document.getElementById('trackDuration');
    let trackProgress = document.getElementById('trackProgress');

    //déclaration des variables
    let playingTrackDuration = 0;

    myAudioPlayer.addEventListener('timeupdate', (event) => {

        //total duration
        let minutes = Math.floor(myAudioPlayer.duration / 60);
        let seconds = Math.floor(myAudioPlayer.duration % 60);

        if (playingTrackDuration === 0 || myAudioPlayer.duration !== playingTrackDuration) {
            if (seconds < 10) {
                trackDuration.innerHTML = `${minutes}: 0${seconds}`;
            } else {
                trackDuration.innerHTML = `${minutes}: ${seconds}`;
            }
        }

        //current time
        let currentTime = myAudioPlayer.currentTime;

        if ((myAudioPlayer.currentTime % 60) < 10) {
            trackCurrentTime.innerHTML = `${Math.floor(currentTime / 60)}: 0${Math.floor(currentTime % 60)}`;
        } else {
            trackCurrentTime.innerHTML = `${Math.floor(currentTime / 60)}: ${Math.floor(currentTime % 60)}`;
        }

        //time remaining
        let timeRemaining = Math.floor(myAudioPlayer.duration - myAudioPlayer.currentTime)

        if ((timeRemaining % 60) < 10) {
            trackTimeLeft.innerHTML = `${Math.floor(timeRemaining / 60)}: 0${Math.floor(timeRemaining % 60)}`;
        } else {
            trackTimeLeft.innerHTML = `${Math.floor(timeRemaining / 60)}: ${Math.floor(timeRemaining % 60)}`;
        }

        //progress bar
        trackProgress.value = Math.floor((myAudioPlayer.currentTime / myAudioPlayer.duration) * 100)

    });

    //changing time
    trackProgress.addEventListener('input', () => {
        let targetTime = Math.floor((myAudioPlayer.duration / 100) * parseInt(trackProgress.value));
        myAudioPlayer.currentTime = targetTime;
    })


    //fonction De changement de background en fonction de l'heure

    function checkHour() {

        const seaBackGround = document.getElementById('mainInterface');
        const now = new Date();


        if (now.getHours() > 7 && now.getHours() < 21) {

            if (seaBackGround.classList.contains('night')) {
                seaBackGround.classList.replace('night', 'day');
            } else if (!seaBackGround.classList.contains('day')) {
                seaBackGround.classList.add('day');
            }
            document.getElementById('mainBadger').innerHTML =
            '<img id="badgerLogo" src="./img/badger-dj-1.jpg" alt="a djying badger">'

        } else {
            if (!seaBackGround.classList.contains('night')) {
                if (seaBackGround.classList.contains('day')) {
                    seaBackGround.classList.replace('day', 'night');
                } else {
                    seaBackGround.classList.add('night');
                }
            }
            document.getElementById('mainBadger').innerHTML =
            '<img id="badgerLogo" src="./img/badger-dj-3.jpg" alt="a djying badger">'
        }
    }

    setInterval(checkHour, 60000)



}




































