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


    //fonction de charge des informations
    
    

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
            if(playlist.indexOf(track) === trackIndex){
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


        trackList.forEach(track =>{
            track.addEventListener("dblclick", (event)=>{
                let targetTrack = event.target.closest('tr');
                trackIndex = parseInt(targetTrack.dataset.index);
                loadTrack(trackIndex);
                // targetTrack.classList.add('playingNow');
                // console.log(targetTrack);
                
            })
        })
    }

    //chargement de la première piste
    await loadFirstTrack(trackIndex);

    //fonction de loadingtrack
    async function loadTrack(trackNumber) {
        
        await loadFirstTrack(trackNumber);
        
        myAudioPlayer.play();
        
        if (pauseBtn.classList.contains("hide")){
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
    })

    pauseBtn.addEventListener('click', () => {
        myAudioPlayer.pause();
        pauseBtn.classList.add('hide');
        playBtn.classList.remove('hide');
    });

    previousBtn.addEventListener('click', async ()=>{
        -- trackIndex;
        let playlist = await loadPlaylist();
        if (trackIndex < 0){
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else if (trackIndex > playlist.length - 1){
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
        }
    })

    nextBtn.addEventListener('click', async ()=>{
        ++ trackIndex;
        let playlist = await loadPlaylist();
        if (trackIndex < 0){
            trackIndex = playlist.length - 1;
            loadTrack(trackIndex);
        } else if (trackIndex > playlist.length - 1){
            trackIndex = 0;
            loadTrack(trackIndex);
        } else {
            loadTrack(trackIndex);
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
        } else {
            trackMuted = false;
            volumeChange();
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

}




































