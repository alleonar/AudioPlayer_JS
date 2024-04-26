// Utilisation du mode strict pour limiter les expressions utilisées et éviter une partie des erreurs
'use strict';

// ATTENTE DU CHARGEMENT DU DOM
window.onload = () => {


    async function loadPlaylist() {
        try {

            const response = await fetch("../data/playlist.json");
            const data = await response.json();
            const playlist = await data.playlist;
            console.log(playlist);
            return playlist;

        } catch (error) {

            console.error("problem to retrieve playlist")
        }
    };



    let myAudioPlayer = new Audio("./music/epic-hollywood-trailer.mp3");
    // console.log(myAudioPlayer)

    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    playBtn.addEventListener('click', (event) => {
        myAudioPlayer.play()
    });

    pauseBtn.addEventListener('click', (event) => {
        myAudioPlayer.pause()
    });






































































































}