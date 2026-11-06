import { Player, RoomState, VideoState, ChatMessage, EmoteEvent } from '../types.js';

export class CinemaRoom {
  public roomId: string;
  public hostId: string = '';
  public players: Map<string, Player> = new Map();
  public takenSeats: Map<string, string> = new Map(); // seatId -> playerId
  public video: VideoState = {
    videoId: 'kJQP7kiw5Fk', // Default video (Despacito hoặc LCK highlight trailer)
    title: 'LCK Official Highlight Stream',
    status: 'PAUSED',
    mediaTime: 0,
    lastServerTimestamp: Date.now(),
    playbackRate: 1.0,
    updatedBy: 'System',
  };

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  public addPlayer(player: Player): void {
    if (this.players.size === 0) {
      player.isHost = true;
      this.hostId = player.id;
    }
    this.players.set(player.id, player);
  }

  public removePlayer(playerId: string): { newHostId?: string; freedSeatId?: string } {
    const player = this.players.get(playerId);
    let freedSeatId: string | undefined;

    if (player && player.seatId) {
      this.takenSeats.delete(player.seatId);
      freedSeatId = player.seatId;
    }

    this.players.delete(playerId);

    let newHostId: string | undefined;
    if (this.hostId === playerId) {
      const remaining = Array.from(this.players.values());
      if (remaining.length > 0) {
        remaining[0].isHost = true;
        this.hostId = remaining[0].id;
        newHostId = this.hostId;
      } else {
        this.hostId = '';
      }
    }

    return { newHostId, freedSeatId };
  }

  public updatePlayerTransform(playerId: string, transform: Player['transform'], animation: string): void {
    const p = this.players.get(playerId);
    if (p) {
      p.transform = transform;
      p.animation = animation;
    }
  }

  public updatePlayerJersey(
    playerId: string,
    teamId: string,
    variant: string,
    number: number,
    customName: string
  ): void {
    const p = this.players.get(playerId);
    if (p) {
      p.teamId = teamId;
      p.jerseyVariant = variant;
      p.jerseyNumber = number;
      p.customName = customName;
    }
  }

  public sitSeat(playerId: string, seatId: string): boolean {
    const currentOccupant = this.takenSeats.get(seatId);
    if (currentOccupant && currentOccupant !== playerId) {
      return false; // Ghế đã có người
    }

    const player = this.players.get(playerId);
    if (!player) return false;

    // Rời ghế cũ nếu có
    if (player.seatId) {
      this.takenSeats.delete(player.seatId);
    }

    player.seatId = seatId;
    player.animation = 'sit';
    this.takenSeats.set(seatId, playerId);
    return true;
  }

  public standUp(playerId: string): string | null {
    const player = this.players.get(playerId);
    if (!player || !player.seatId) return null;

    const oldSeatId = player.seatId;
    this.takenSeats.delete(oldSeatId);
    player.seatId = null;
    player.animation = 'idle';
    return oldSeatId;
  }

  public setOxygen(playerId: string, isUsing: boolean): void {
    const p = this.players.get(playerId);
    if (p) {
      p.isUsingOxygen = isUsing;
      p.animation = isUsing ? 'oxygen' : (p.seatId ? 'sit' : 'idle');
    }
  }

  // --- VIDEO CONTROLS ---
  public getCurrentMediaTime(): number {
    if (this.video.status === 'PLAYING') {
      const elapsedSeconds = (Date.now() - this.video.lastServerTimestamp) / 1000;
      return this.video.mediaTime + elapsedSeconds * this.video.playbackRate;
    }
    return this.video.mediaTime;
  }

  public playVideo(updatedBy: string): VideoState {
    const currentExactTime = this.getCurrentMediaTime();
    this.video = {
      ...this.video,
      status: 'PLAYING',
      mediaTime: currentExactTime,
      lastServerTimestamp: Date.now(),
      updatedBy,
    };
    return this.video;
  }

  public pauseVideo(updatedBy: string): VideoState {
    const currentExactTime = this.getCurrentMediaTime();
    this.video = {
      ...this.video,
      status: 'PAUSED',
      mediaTime: currentExactTime,
      lastServerTimestamp: Date.now(),
      updatedBy,
    };
    return this.video;
  }

  public seekVideo(targetSeconds: number, updatedBy: string): VideoState {
    this.video = {
      ...this.video,
      mediaTime: Math.max(0, targetSeconds),
      lastServerTimestamp: Date.now(),
      updatedBy,
    };
    return this.video;
  }

  public changeVideo(videoId: string, title: string | undefined, updatedBy: string): VideoState {
    this.video = {
      videoId,
      title: title || 'YouTube Video',
      status: 'PLAYING',
      mediaTime: 0,
      lastServerTimestamp: Date.now(),
      playbackRate: 1.0,
      updatedBy,
    };
    return this.video;
  }

  public getState(): RoomState {
    return {
      roomId: this.roomId,
      hostId: this.hostId,
      video: {
        ...this.video,
        mediaTime: this.getCurrentMediaTime(),
      },
      players: Object.fromEntries(this.players),
      takenSeats: Object.fromEntries(this.takenSeats),
    };
  }
}
