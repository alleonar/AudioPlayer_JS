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

    //création du lecteur de media audio
    let myAudioPlayer = new Audio();

    //création de l'index de lecture;
    /*
    * @param {integer} trackIndex - The index of the current playing track 
    */
    let trackIndex = 0;

    //fonction de changement de background en fonction de l'heure
    function checkHour() {

        //selection de la section contenant le player audio
        const seaBackGround = document.getElementById('mainInterface');

        //création d'un objet date actualisé
        const now = new Date();

        //vérification de l'heure actuelle
        if (now.getHours() > 6 && now.getHours() < 20) {

            //passage au background 'day' si l'heure se situe entre 7h et 21h
            if (seaBackGround.classList.contains('night')) {
                seaBackGround.classList.replace('night', 'day');
            } else if (!seaBackGround.classList.contains('day')) {
                seaBackGround.classList.add('day');
            }

            //passage à l'image blaireau dj de jour
            document.getElementById('mainBadger').innerHTML =
                '<img id="badgerLogo" src="./img/badger-dj-1.jpg" alt="a djying badger in a studio by day" loading>'

        } else {

            //passage au background 'night' si l'heure se situe entre 21h et 7h
            if (!seaBackGround.classList.contains('night')) {
                if (seaBackGround.classList.contains('day')) {
                    seaBackGround.classList.replace('day', 'night');
                } else {
                    seaBackGround.classList.add('night');
                }
            }

            //passage à l'image blaireau dj de nuit
            document.getElementById('mainBadger').innerHTML =
                '<img id="badgerLogo" src="./img/badger-dj-3.jpg" alt="a djying badger on a stage by night" loading>'
        }
    }

    //chargement des premiers background et image de blaireau au chargement de la page
    checkHour();

    //vérification de l'heure toutes les minutes pour une mise à jour automatique
    setInterval(checkHour, 60000)


    //fonction pour charger le premier morceau (trackNumber correspond à l'index de lecture)
    async function loadFirstTrack(trackNumber) {

        //définition de la source de l'audio en fonction de l'index de lecture (trackindex)
        myAudioPlayer.src = `./music/${playlist[trackNumber].src}`;

        //remise à zéro de la barre de progression(trackProgress)
        myAudioPlayer.currentTime = 0;

        // détermine le rootspace
        let serverPortInUse = 'http://127.0.0.1:5501/';

        //affichage des données du morceau chargé
        if (document.getElementById('trackImg').src === serverPortInUse) {
            document.getElementById('trackImg').src = `./img/${playlist[trackNumber].cover}`;
            document.getElementById('trackTitle').innerHTML = `${playlist[trackNumber].title}`;
            document.getElementById('trackArtist').innerHTML = `${playlist[trackNumber].artist}`;
        }
        
        //remise à zéro de l'affichage du tableau contenant la playlist (tableList)
        document.getElementById('tableList').innerHTML = "";

        //géneration d'un nouvel affichage de la playlist
        playlist.forEach(track => {

            //vérifie si la piste est celle en cours de lecture et lui ajoute la classe playingNow
            //qui lui ajoute des borders
            if (playlist.indexOf(track) === trackIndex) {
                document.getElementById('tableList').innerHTML +=
                    `<tr data-index="${playlist.indexOf(track)}" class="playingNow">
                    <td class="trackListNumber">${track.music}</td>
                    <td>${track.artist}</td>
                    <td>${track.title}</td>
                </tr>`

                //affiche le reste de la playlist
            } else {
                document.getElementById('tableList').innerHTML +=
                    `<tr data-index="${playlist.indexOf(track)}">
                    <td class="trackListNumber">${track.music}</td>
                    <td>${track.artist}</td>
                    <td>${track.title}</td>
                </tr>`
            }

        });

        //selection de l'ensemble des lignes de la liste de lecture
        let trackList = document.querySelectorAll('tr');

        //ajout d'un ecouteur (double click) sur chaque lignes pour sélectionner et lire le morceau correspondant
        trackList.forEach(track => {
            track.addEventListener("dblclick", (event) => {

                //selection de la ligne cible
                let targetTrack = event.target.closest('tr');
                //récuperation de son index et coversion en Integer pour eviter les conflits
                trackIndex = parseInt(targetTrack.dataset.index);
                //lecture de la piste en fonction de son index
                loadTrack(trackIndex);

                //selection des images de vagues pour animation
                const wave01 = document.getElementById('wave01');
                const wave02 = document.getElementById('wave02');

                //vérification de l'état de l'animation
                //si n'est pas en cours lance l'animation
                if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
                    wave01.classList.add('animateWave01');
                    wave02.classList.add('animateWave02');
                }

                //si l'animation est en pause la remet en lecture
                if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
                    wave01.classList.remove('closingWave01');
                    wave02.classList.remove('closingWave02');
                }
            })
        })
    }

    //fonction de loadingtrack (trackNumber correspond à l'index de lecture)
    async function loadTrack(trackNumber) {

        await loadFirstTrack(trackNumber);

        // TEST ANIMATION FLIP

        // await loadFirstTrack(trackNumber);

        document.getElementById('trackInfo').animate([
            { transform: 'rotateY(0deg)' },
            { transform: 'rotateY(90deg)' }
        ], {
            duration: 500
        })

        setTimeout(() => {
            document.getElementById('trackImg').src = `./img/${playlist[trackNumber].cover}`;
            document.getElementById('trackTitle').innerHTML = `${playlist[trackNumber].title}`;
            document.getElementById('trackArtist').innerHTML = `${playlist[trackNumber].artist}`;
            document.getElementById('trackInfo').animate([
                { transform: 'rotateY(90deg)' },
                { transform: 'rotateY(0deg)' }
            ], {
                duration: 500
            })
        },
            500
        )

        //mise en lecture automatique
        myAudioPlayer.play();

        // vérification de l'état du bouton pause pour s'assurer qu'il est sur pause
        // puisque la lecture est lancée
        if (pauseBtn.classList.contains("hide")) {
            playBtn.classList.add("hide");
            pauseBtn.classList.remove("hide");
        };

    };

    //chargement de la première piste au chargement de la page
    await loadFirstTrack(trackIndex);


    /* CONTROL PANEL */
    //récupération des boutons du control panel
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const previousBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');


    //édition de la fonction play
    playBtn.addEventListener('click', () => {

        //lance la lecture de la piste
        myAudioPlayer.play();

        //switch de la visibilité des boutons play / pause
        playBtn.classList.add('hide');
        pauseBtn.classList.remove('hide');

        //selection des images de vagues pour animation
        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        //vérification de l'état de l'animation
        // lance l'animation si à l'arrêt
        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        // remet l'animation en lecture si en pause
        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    //édition de la fonction pause
    pauseBtn.addEventListener('click', () => {

        //met la lecture de la piste en pause
        myAudioPlayer.pause();

        //selection des images de vagues pour animation
        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        //mise en pause des animations des vagues
        wave01.classList.add('closingWave01');
        wave02.classList.add('closingWave02');

        //switch de la visibilité des boutons play / pause
        pauseBtn.classList.add('hide');
        playBtn.classList.remove('hide');
    });

    //édition de la fonction précédent
    previousBtn.addEventListener('click', async () => {

        //diminution du trackIndex
        --trackIndex;

        // réinstanciation d'une playlist pour vérifier les informations
        let playlist = await loadPlaylist();

        //verification de l'index pour repartir de la fin de la playlist s'il est inférieur à 0
        if (trackIndex < 0) {
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        // recuperation des images de vagues
        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        //vérification de l'état de l'animation
        // lance l'animation si à l'arrêt
        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        // remet l'animation en lecture si en pause
        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    //édition de la fonction suivant
    nextBtn.addEventListener('click', async () => {

        //augmentation du trackIndex
        ++trackIndex;

        // réinstanciation d'une playlist pour vérifier les informations
        let playlist = await loadPlaylist();


        //verification de l'index pour repartir du début de la playlist s'il est supérieur 
        // à la longueur de la playlist
        if (trackIndex > playlist.length - 1) {
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        // recuperation des images de vagues
        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        //vérification de l'état de l'animation
        // lance l'animation si à l'arrêt
        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        // remet l'animation en lecture si en pause
        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })

    //changement de piste après la fin
    myAudioPlayer.addEventListener('ended', async () => {

        //augmentation du trackIndex
        ++trackIndex;

        // réinstanciation d'une playlist pour vérifier les informations
        let playlist = await loadPlaylist();


        //verification de l'index pour repartir du début de la playlist s'il est supérieur 
        // à la longueur de la playlist
        if (trackIndex > playlist.length - 1) {
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }

        // recuperation des images de vagues
        const wave01 = document.getElementById('wave01');
        const wave02 = document.getElementById('wave02');

        //vérification de l'état de l'animation
        // lance l'animation si à l'arrêt
        if (!wave01.classList.contains('animateWave01') || !wave02.classList.contains('animateWave02')) {
            wave01.classList.add('animateWave01');
            wave02.classList.add('animateWave02');
        }

        // remet l'animation en lecture si en pause
        if (wave01.classList.contains('closingWave01') || wave02.classList.contains('closingWave02')) {
            wave01.classList.remove('closingWave01');
            wave02.classList.remove('closingWave02');
        }
    })


    /* VOLUME INTERFACE */
    //recupération des boutons de l'interface volume
    const volumeInput = document.getElementById('volumeInput');
    const muteBtn = document.getElementById('muteBtn');

    // variable de switch mute/unmute
    let trackMuted = false;

    // édition de la fonction de changement de volume de l'élément audio
    function volumeChange() {
        //recuperation de la valeur de la barre de volume(volumeInput) et conversion en float
        let currentVolume = parseInt(volumeInput.value) / 100;

        //ajustement du volume de l'élément audio avec la nouvelle valeur
        myAudioPlayer.volume = currentVolume;
    }

    // édition de la fonction mute
    muteBtn.addEventListener('click', () => {

        // vérification de l'état de la variable trackMuted
        if (trackMuted === false) {

            // passe trackMuted à true pour le suivit
            trackMuted = true;

            // met le volume de l'élément audio à 0
            myAudioPlayer.volume = 0;

            //switch l'affichage du bouton pour aider l'utilisateur à se repérer
            document.getElementById('muteBtn').innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;

        } else {
            // passe trackMuted à false pour le suivit
            trackMuted = false;

            // retablit le volume en fonction de la valeur du volumeInput
            volumeChange();

            //switch l'affichage du bouton pour aider l'utilisateur à se repérer
            document.getElementById('muteBtn').innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        }
    })

    // edition de la fonction de changement de volume
    volumeInput.addEventListener('change', () => {

        // vérification de l'état de trackMuted avant d'effectuer le changement
        if (trackMuted === false) {

            // retablit le volume en fonction de la valeur du volumeInput
            volumeChange();
        }
    });



    /* TRACK TIME PARAMETERS */

    //recuperation des afficheurs
    let trackCurrentTime = document.getElementById('trackCurrentTime');
    let trackTimeLeft = document.getElementById('trackTimeLeft');
    let trackDuration = document.getElementById('trackDuration');
    let trackProgress = document.getElementById('trackProgress');

    //déclaration des variables
    let playingTrackDuration = 0;

    // suivit du currentTime de l'élément audio et mise à jour des infos temporelles
    myAudioPlayer.addEventListener('timeupdate', (event) => {

        function updateTrackTime() {

            //vérification de donnée utilisable
            if (!isNaN(myAudioPlayer.duration)) {

                //récupération et affichage du temps total de l'élément audio sous le format minutes secondes
                let minutes = Math.floor(myAudioPlayer.duration / 60);
                let seconds = Math.floor(myAudioPlayer.duration % 60);

                //vérification du temps total l'élément audio chargé
                if (playingTrackDuration === 0 || myAudioPlayer.duration !== playingTrackDuration) {

                    //affichage du temps total du morceau(trackDuration)
                    if (seconds < 10) {
                        trackDuration.innerHTML = `${minutes}: 0${seconds}`;
                    } else {
                        trackDuration.innerHTML = `${minutes}: ${seconds}`;
                    }
                }

                // récupération du currentTime de l'élément audio chargé
                let currentTime = myAudioPlayer.currentTime;

                // affichage du temps écoulé du morceau(trackCurrentTime)
                if ((myAudioPlayer.currentTime % 60) < 10) {
                    trackCurrentTime.innerHTML = `${Math.floor(currentTime / 60)}: 0${Math.floor(currentTime % 60)}`;
                } else {
                    trackCurrentTime.innerHTML = `${Math.floor(currentTime / 60)}: ${Math.floor(currentTime % 60)}`;
                }

                // récupération du temps restant de l'élément audio chargé
                let timeRemaining = Math.floor(myAudioPlayer.duration - myAudioPlayer.currentTime)

                // affichage du temps restant du morceau(timeRemaining)
                if ((timeRemaining % 60) < 10) {
                    trackTimeLeft.innerHTML = `${Math.floor(timeRemaining / 60)}: 0${Math.floor(timeRemaining % 60)}`;
                } else {
                    trackTimeLeft.innerHTML = `${Math.floor(timeRemaining / 60)}: ${Math.floor(timeRemaining % 60)}`;
                }

                // mise à jour de la progress bar
                trackProgress.value = Math.floor((myAudioPlayer.currentTime / myAudioPlayer.duration) * 100)
            }
        }

        updateTrackTime();


    });

    // Edition de la fonction de changement de position temporelle de l'élément audio chargé
    // ecouteur de modification de la progressbar par l'utilisateur
    trackProgress.addEventListener('input', () => {

        // conversion et assignation de la nouvelle position de lecture
        let targetTime = Math.floor((myAudioPlayer.duration / 100) * parseInt(trackProgress.value));
        myAudioPlayer.currentTime = targetTime;
    })

}




































