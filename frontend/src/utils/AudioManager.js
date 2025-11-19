import { createRef } from 'react';
import rainSound from '../assets/audio/rain-sound.mp3';
import cafeSound from '../assets/audio/cafe-sound.mp3';
import streetSound from '../assets/audio/street-sound.mp3';

class AudioManager {
  static audioRef = createRef();
  static rainAudioRef = createRef();
  static cafeAudioRef = createRef();
  static streetAudioRef = createRef();
  static youtubePlayerRef = null;

  static audioVolume = Number(localStorage.getItem("audioVolume")) || 10;
  static youtubeVolume = Number(localStorage.getItem("youtubeVolume")) || 10;
  static rainVolume = Number(localStorage.getItem("rainVolume")) || 10;
  static cafeVolume = Number(localStorage.getItem("cafeVolume")) || 10;
  static streetVolume = Number(localStorage.getItem("streetVolume")) || 10;

  static audioMuted = false;
  static youtubeMuted = false;
  static rainMuted = false;
  static cafeMuted = false;
  static streetMuted = false;

  static initYouTubePlayer(player) {
    this.youtubePlayerRef = player;
    player.setVolume(this.youtubeVolume);
    if (this.youtubeVolume === 0 || this.youtubeMuted) {
      player.mute();
    } else {
      player.unMute();
    }
  }

  static setAudioVolume(volume) {
    this.audioVolume = volume;
    localStorage.setItem("audioVolume", volume);
    if (this.audioRef.current) {
      this.audioRef.current.volume = volume / 100;
      this.audioMuted = volume === 0;
    }
  }

}

export default AudioManager;