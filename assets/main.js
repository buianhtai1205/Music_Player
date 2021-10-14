// Music Player
// 1. Render
// 2. Scroll top;
// 3. Play / Pause / Seek
// 4. Rotate CD
// 5. Next / Prev 
// 6. Ramdom
// 7. Next, Repeat khi ended
// 8. Active Song
// 9. Scroll Active Song into view
// 10.play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd .cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const playList = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone ft Cozi Zuehlsdorff",
            path: "./assets/music/Nevada.mp3",
            image: "https://i.ytimg.com/vi/oFk7FXjt4uo/maxresdefault.jpg"
        },
        {
            name: "A Little Love",
            singer: "Fiona Fung",
            path: "./assets/music/ALittleLove.mp3",
            image:
              "https://home-starthampshire.org.uk/wp-content/uploads/2020/12/GALL-Featured-Image.png"
        },
        {
            name: "Fly Away",
            singer: "The Fat Rat",
            path:
              "./assets/music/FlyAway.mp3",
            image: "https://i.ytimg.com/vi/cMg8KaMdDYo/maxresdefault.jpg"
        },
        {
            name: "Sunlight",
            singer: "The Fat Rat",
            path: "./assets/music/Sunlight.mp3",
            image:
              "https://images.rxlist.com/images/slideshow/xl-sq-promos/sunlight-and-your-health.jpg"
        },
        {
            name: "The Right Journey",
            singer: "GDucky",
            path: "./assets/music/TheRightJourney.mp3",
            image:
                "https://i.ytimg.com/vi/I8YKXTTwL5U/maxresdefault.jpg"
        },
        {
            name: "We'll meet again",
            singer: "TheFatRat & Laura Brehm",
            path:
                "./assets/music/Wewillmeetagain.mp3",
            image:
                "https://i.ytimg.com/vi/hJqYc62NCKo/maxresdefault.jpg"
        },
        {
            name: "Windfall",
            singer: "The Fat Rat",
            path: "./assets/music/Windfall.mp3",
            image:
                "https://i.ytimg.com/vi/jqkPqfOFmbY/maxresdefault.jpg"
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join("");
    },
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents : function() {
        const cdWidth = cd.offsetWidth ;
        const _this = this;

        // Xử lý animate quay của cd
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;   
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        //Xử lý khi nhấn play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                 audio.pause();
            } else {
                audio.play();
            }
            
        };

        // khi song play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        //khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        }
        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        }
        //Xử lý khi nhấn next/prev
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }           
            audio.play();
            _this.render();
            _this.scrollIntoViewForActive();
        }
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollIntoViewForActive();
        }
        //Xử lý Random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        }
        //Xử lý repeat 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }
        //Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Xử lý hành vi click vào  playList 
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                //Xử lý click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xử lý click vào option
                if(e.target.closest('.option')) {

                }
            }
        }
        
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newCurrent;
        do {
            newCurrent = Math.floor(Math.random()*(this.songs.length));
        } while (newCurrent == this.currentIndex);
        this.currentIndex = newCurrent;
        this.loadCurrentSong();
    },
    scrollIntoViewForActive: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200)
    },
    start: function() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperty();

        //Lắng nghe và xử lý các sự kiện (DOM events) 
        this.handleEvents();

        //load thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render Playlist
        this.render();
    }
}


app.start();
