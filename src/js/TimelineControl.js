export class TimelineControl {
  constructor(root, renderPage) {
    this.render = renderPage;
    this.root = root;
    this.isRecording = false;
    this.enableHighAccuracy = true;
    this.lat = null;
    this.long = null;
    this.day = null;
    this.month = null;
    this.year = null;
    this.hours = null;
    this.minutes = null;
    this.messageContainer = null;
    this.btnControlls = null;
    this.updatePosition = () => {
      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    };
    this.activateBtn = () => {
      this.btnControlls.forEach((btn) => {
        btn.disabled = false;
        btn.classList.add("active");
      });
    };
  }

  updateDate() {
    const time = new Date();
    this.day = String(time.getDate()).padStart(2, "0");
    this.hours = time.getHours();
    this.minutes = String(time.getMinutes()).padStart(2, "0");
    this.month = String(time.getMonth() + 1).padStart(2, "0");
    this.year = time.getFullYear();
  }

  start() {
    this.root.appendChild(this.render.mainPage());
    this.bindToDOM();
    if (navigator.geolocation && this.lat === null && this.long === null) {
      navigator.geolocation.getCurrentPosition(
        this.accessPosition.bind(this),
        this.errorPosition.bind(this),
        {
          enableHighAccuracy: this.enableHighAccuracy,
        },
      );
    }
    window.addEventListener("pointerup", this.stopRecording.bind(this));
  }

  bindToDOM() {
    this.messageContainer = document.querySelector(".timeline-container");
    this.btnControlls = document.querySelectorAll(".btn-control");
  }

  submitData(event) {
    event.preventDefault();
    if (this.lat === null || this.long === null) {
      return;
    }
    this.updateDate();
    const text = event.target.querySelector(".timeline-textarea").value;
    const data = {
      text: text,
      day: this.day,
      month: this.month,
      year: this.year,
      hours: this.hours,
      minutes: this.minutes,
      lat: this.lat,
      long: this.long,
    };
    const ourMessage = this.render.textMessage(data);
    this.messageContainer.appendChild(ourMessage);
    this.updatePosition();
  }

  async startRecording(event) {
    if (event.target.disabled) return;
    this.updateDate();
    if (event.target.classList.contains("voice-submit-btn")) {
      await this.Record({ audio: true });
      this.isRecording = true;
    }
    if (event.target.classList.contains("video-submit-btn")) {
      await this.Record({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      });
      this.isRecording = true;
    }
  }

  stopRecording() {
    if (!this.isRecording) return;
    console.log("Отправил обьективку");
    if (!this.streamRecorder) return;
    this.streamRecorder.stop();
    this.stream.getTracks().forEach((track) => {
      track.stop();
    });
    this.isRecording = false;
  }

  accessPosition(position) {
    const coords = position.coords;
    this.lat = Number(coords.latitude.toFixed(6));
    this.long = Number(coords.longitude.toFixed(6));
    this.activateBtn();
  }

  errorPosition() {
    this.modal = this.render.modalPosition(() => this.modal.remove());
    document.body.appendChild(this.modal);
    const input = this.modal.querySelector(".input-coord");
    input.addEventListener("input", () => input.setCustomValidity(""));
    this.modal.addEventListener("submit", this.getUserCoordinate.bind(this));
  }

  getUserCoordinate(event) {
    event.preventDefault();
    const input = event.target.querySelector(".input-coord");
    const text = input.value;
    try {
      const coordinate = this.parseCoordinate(text);
      this.lat = coordinate[1];
      this.long = coordinate[2];
      this.modal.remove();
      this.activateBtn();
      console.log(this.lat, this.long);
      console.log(coordinate);
    } catch (error) {
      input.setCustomValidity(error.message);
      input.reportValidity();
    }
    event.target.querySelector(".input-coord").value = "";
  }

  parseCoordinate(text) {
    const regex = new RegExp(
      "^\\[?([-−]?\\d{1,2}\\.\\d{5}),\\s?([-−]?\\d{1,3}\\.\\d{5})\\]?$",
    );

    const matches = text.match(regex);
    if (matches) {
      return { 1: matches[1], 2: matches[2] };
    } else throw new Error("Could not parse coordinate");
  }

  async Record(data) {
    const chunk = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(data);
      this.streamRecorder = new MediaRecorder(this.stream);
      this.streamRecorder.addEventListener("dataavailable", (event) => {
        chunk.push(event.data);
      });
      this.streamRecorder.addEventListener("stop", () => {
        this.blob = new Blob(chunk);
        if (data.audio) {
          this.submitRecordVoice(this.blob);
        }
        if (data.video) {
          this.submitRecordVideo(this.blob);
        }
      });
      this.streamRecorder.start();
    } catch (error) {
      this.streamRecorder = null;
      console.error(error.message);
    }
  }

  submitRecordVoice(blob) {
    const data = {
      url: blob,
      day: this.day,
      month: this.month,
      year: this.year,
      hours: this.hours,
      minutes: this.minutes,
      lat: this.lat,
      long: this.long,
    };
    const auduoEl = this.render.audioMessage(data);
    this.messageContainer.appendChild(auduoEl);
    this.updatePosition();
  }

  submitRecordVideo(blob) {
    const data = {
      url: blob,
      day: this.day,
      month: this.month,
      year: this.year,
      hours: this.hours,
      minutes: this.minutes,
      lat: this.lat,
      long: this.long,
    };
    const videEl = this.render.videoMessage(data);
    this.messageContainer.appendChild(videEl);
    this.updatePosition();
  }
}
