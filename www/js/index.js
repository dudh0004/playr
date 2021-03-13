let app = {
    number: null,
    currentStatus:null,
    mediaPrevious: null,
    mediaCurrent: null,
    mediaTimer: null,
    mediaTime: 0,
    isPlaying: true,
    currentTime: 0,
    tracks: [{
        id:1,
        artist: 'Arijit Singh',
        album: 'Dilbar',
        track: 'Dilbar Dilbar',
        volume: 0.5,
        songLength: 199,
        image:'../www/img/Dilbar.jpg',
        path:'file:///android_asset/www/media/DILBAR_Lyrical___Satyameva_Jayate__John_Abraham_N.mp3',
    },
    {   
        id:2,
        artist: 'Arijit Singh',
        album: 'Gali',
        track: 'Gali gali',
        volume: 0.5,
        songLength: 198,
        image: '../www/img/Gali Gali.jpg',
        path:'file:///android_asset/www/media/Gali_Gali_Full_Video_Song___KGF___Neha_Kakkar___Mo.mp3',
    },
    {
        id:3,
        artist: 'Neha Kakkar',
        album: 'nehu',
        track: 'Happy New Year',
        volume: 0.5,
        songLength: 909,
        image: '../www/img/Happy New Year.jpg',
        path:'file:///android_asset/www/media/Happy_New_Year_2020___Bollywood_Party_Super_Hit_S.mp3',
    },
    {
        id:4,
        artist: 'Neha Kakkar',
        album: 'nehu',
        track: 'New Party Song',
        volume: 0.5,
        songLength: 920,
        image: '../www/img/New Party.jpg',
        path:'file:///android_asset/www/media/New_Party_Songs____New_Year_Special_Bollywood_Part.mp3',
    },
    {
        id:5,
        artist: 'Neha Kakkar',
        album: 'nehu',
        track: 'Item Song',
        volume: 0.5,
        songLength: 193,
        image: '../www/img/Nora Fatehi.jpg',
        path:'file:///android_asset/www/media/Nora_fatehi_item_song_bollywood_new_songs_item_so.mp3',
    },
],
    media:null,
    status:{
        '0':'MEDIA_NONE',
        '1':'MEDIA_STARTING',
        '2':'MEDIA_RUNNING',
        '3':'MEDIA_PAUSED',
        '4':'MEDIA_STOPPED'
    },
    err:{
        '1':'MEDIA_ERR_ABORTED',
        '2':'MEDIA_ERR_NETWORK',
        '3':'MEDIA_ERR_DECODE',
        '4':'MEDIA_ERR_NONE_SUPPORTED'
    },
    init: function() {
        document.addEventListener('deviceready', app.list, false);
    },
    ready: function(ev) {
        let target = ev.target;
        document.getElementById('home').classList.remove('active');
        document.getElementById('details').classList.add('active');
        app.number = target.getAttribute('Number');
        app.addListeners();
        let songName = document.getElementById('title');
        songName.textContent = app.tracks[app.number].track;
        let artist = document.getElementById('artist');
        artist.textContent = app.tracks[app.number].artist;
        let songImage = document.querySelector('.rotateImage');
        songImage.src = app.tracks[app.number].image;
        let src = app.tracks[app.number].path;
        app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        app.play();
    },
    ftw: function(){
        //success creating the media object and playing, stopping, or recording
        console.log('success playing the song');
    },
    wtf: function(err){
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function(status){
        app.media.getCurrentPosition((pos)=>{
            let dur = app.media.getDuration();
            if(pos == -0.001)
            {
                app.number = ((parseInt(app.number) + 1)%(app.tracks.length));
                app.media.release();
                app.media = new Media(app.tracks[app.number].path, app.ftw, app.wtf, app.statusChange);
                app.play();
                let songName = document.getElementById('title');
                songName.textContent = app.tracks[app.number].track;
                let artist = document.getElementById('artist');
                artist.textContent = app.tracks[app.number].artist;
                let songImage = document.querySelector('.rotateImage');
                songImage.src = app.tracks[app.number].image;
            }
        });
        console.log('media status is now ' + app.status[status] );
        app.currentStatus = app.status[status];

    },
    list: function(ev) {
        let target = ev.target
        document.getElementById('home').classList.add('active');
        document.getElementById('details').classList.remove('active');
        let list1 = document.getElementById('list');
        list1.innerHTML = '';
        let i = 0;
        app.tracks.forEach(element =>{
            let div = document.createElement('div');
            let divImg = document.createElement('div');

            let img = document.createElement('img');
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');

            div.setAttribute('Number', i);
            divImg.setAttribute('Number', i);
            img.setAttribute('Number', i);
            p1.setAttribute('Number', i);
            p2.setAttribute('Number', i);
            img.src = element.image;
            p1.textContent = element.track;
            p2.textContent = element.artist;
            
            divImg.setAttribute('class', 'image')
            p1.setAttribute('class', 'para1');
            p2.setAttribute('class', 'para2');
            div.setAttribute('class', 'card');
            divImg.appendChild(img);
            div.append(divImg, p1, p2);
            let list = document.getElementById('list');
            list.appendChild(div);
            i++;
        })
        let cards = document.querySelectorAll('.card')
        cards.forEach(item => {
            item.addEventListener('click', app.ready);
        })
    },
    addListeners: function(){
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.querySelector('#back').addEventListener('click', app.list);
        document.addEventListener('pause', ()=>{
            app.media.release();
        });
    },
    play: function(){
        let img = document.querySelector('.rotateImage');
        img.classList.add('animate');

        let convertTime = (time) => {
            let minutes= Math.floor(time / 60);
            let seconds = time % 60;
                if (seconds >= 10){
                    return `${minutes}:${seconds}`;
                } else {
                return `${minutes}:0${seconds}`;
            }
        }
        
        const maxTime = document.querySelector('.maxTime');
        maxTime.textContent = convertTime(app.tracks[app.number].songLength);
        
        let current = document.querySelector('.currentTime');
        
        if(app.mediaTimer == null) {
            app.mediaTimer = setInterval(function() {
                app.media.getCurrentPosition(
                    function(position) {
                        if(position > -1) {
                            current.textContent = convertTime(app.currentTime);
                            app.currentTime++;
                            position = (app.currentTime / app.tracks[app.number].songLength) * 100;
                            let slider = document.querySelector('.slider');
                            slider.style.background = `linear-gradient(90deg, rgb(81, 117, 128) ${position}%, rgb(4, 13, 15) ${position}%)`;
                }
            },
            function(e) {
                console.log("Error getting pos=" + e);
                setAudioPosition("Error: " + e);
            });
        }, 1000);
    }
        if(app.mediaCurrent == null){           
            app.mediaCurrent = app.media;
            app.mediaCurrent.play();
            app.mediaPrevious = app.media
            let dur = app.media.getDuration();
            app.currentTime = 0;
            app.tracks[app.number].counter = 0;
        } else if((app.mediaCurrent !== null) && (app.currentStatus == app.status[3])){
            app.mediaCurrent.play();
        }
        else{
            console.log('c');
            app.mediaPrevious.stop();
            app.mediaCurrent = app.media;
            app.mediaCurrent.play();
            app.currentTime = 0;
            app.tracks[app.number].counter = 0;
            app.mediaPrevious = app.media
        }
    },
    pause: function(){
        app.isPlaying = false;
        let img = document.querySelector('.rotateImage');
        img.classList.remove('animate');
        app.media.pause();
    },
    stop: function() {
        app.media.stop();
    },
    volumeUp: function(){
        vol = parseFloat(app.tracks[app.number].volume);
        console.log('current volume', vol);
        vol += 0.1;
        if(vol > 1){
            vol = 1.0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.tracks[app.number].volume = vol;
    },
    volumeDown: function(){
        vol = app.tracks[app.number].volume;
        console.log('current volume', vol);
        vol -= 0.1;
        if(vol < 0){
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.tracks[app.number].volume = vol;
    },
    ff: function(){
        app.currentTime = app.currentTime + 10;
        app.media.getCurrentPosition((pos)=>{
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if(pos < dur){
                app.media.seekTo( pos * 1000 );
            }
        });
    },
    rew: function(){
        app.currentTime = app.currentTime - 10;
        app.media.getCurrentPosition((pos)=>{
            pos -= 10;
            if( pos > 0){
                app.media.seekTo( pos * 1000 );
            } else {
                app.media.seekTo(0);
            }
        });
    }
};

app.init();