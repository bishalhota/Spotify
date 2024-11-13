let currentsong = new Audio();   // here we defined a variable called current song which take different input when clicked
// declared current song as global variable

let songs;


function convertSecondsToMinutes(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }

    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate the remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);
    // Format the minutes and seconds to always have two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs() {
    let a = await fetch("https://github.com/bishalhota/Spotify/blob/master/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]) // this split function splits the whole array where it detects the songs into 2 parts  
        }

    }
    return songs

}

const playmusic = (track,pause=false)=> {
    // let audio = new Audio("/songs/" + track + ".mp3") //here we have to give the path directory of the audio or file we want to play

    currentsong.src = "/songs/" + track +".mp3"   // here web are updating the current song by changing it src 

    if(!pause){
        currentsong.play()
        // while playing the music for the first time we have to update that play icon to pause so that when we click on the icon it will stop the music
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track).replaceAll(".mp3",'')
    document.querySelector(".songtime").innerHTML="00:00"
}

async function main() {


    
    // Get the list of all the songs
    songs = await getsongs()
    playmusic(songs[0].replaceAll(".mp3",""),true)
    // Show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="music.svg">
                            <div class="details">
                                <div>${song.replaceAll("%20", " ").replaceAll(".mp3","")}</div>  
                                <div>Song artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                            <img class="invert" src="play.svg">
                            </div> </li>`;
    }
    //Attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".details").firstElementChild.innerHTML)
            playmusic(e.querySelector(".details").firstElementChild.innerHTML.trim())
        })
        
    });

    //Attach event listeners to play next prev
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })

    //listen for time update event

    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration) * 100 +"%";

    })


    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        console.log(e.offsetX)
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100
    })


    //add event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    //add event listener for close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    //event listeners for prev and next
    prev.addEventListener("click",()=>{
        let trackUrl = currentsong.src;
        let trackName = trackUrl.split("/").slice(-1)[0]; 
        let index = songs.indexOf(trackName)
        playmusic(songs[index-1].replace(".mp3",''))
    })

    next.addEventListener("click",()=>{
        let trackUrl = currentsong.src;
        let trackName = trackUrl.split("/").slice(-1)[0]; 
        let index = songs.indexOf(trackName)
        playmusic(songs[index+1].replace(".mp3",''))
    })

    //add an event to volume seek
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e)
        currentsong.volume = parseInt(e.target.value)/100;
    })
}

main()

