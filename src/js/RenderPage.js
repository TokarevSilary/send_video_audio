export class RenderPage {
  constructor(root, onSubmitFunction, recordingFunction) {
    this.submitData = onSubmitFunction;
    this.root = root;
    this.recordingData = recordingFunction;
    this.Modal = ({ title, children }) => {
      return this.createElement(
        "div",
        { className: "modal" },
        this.createElement(
          "div",
          { className: "modal__content" },
          this.createElement("h2", { className: "modal__title" }, title),
          children,
        ),
      );
    };
  }

  createElement(tagName, attrs = {}, ...children) {
    const element = document.createElement(tagName);
    Object.assign(element, attrs);

    element.append(...children);

    return element;
  }

  modalPosition(onCancel) {
    return this.createElement(
      "div",
      { className: "modal" },
      this.createElement(
        "form",
        { className: "modal__content" },
        this.createElement(
          "div",
          { className: "modal-text" },
          "Что-то пошло не так\n" +
            "\n" +
            "К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.\n" +
            "\n" +
            "Широта и долгота через запятую",
        ),
        this.createElement("input", {
          className: "input-coord",
          placeholder: "Введите координаты",
        }),
        this.createElement(
          "div",
          { className: "btn-control-coord" },
          this.createElement(
            "button",
            {
              className: "btn-control-refuse",
              type: "button",
              onclick: onCancel,
            },
            "Отмена",
          ),
          this.createElement(
            "button",
            { className: "btn-control-accept", type: "submit" },
            "Ок",
          ),
        ),
      ),
    );
  }


  mainPage() {
    const onSubmitSet = (event) => {
      this.submitData(event);
    };

    const startRecording = (event) => {
      this.recordingData(event);
    };

    const input = this.createElement("textarea", {
      className: "timeline-textarea",
      placeholder: "Введите текст",
    });

    const onSubmit = (event) => {
      event.preventDefault();
      const { value } = input;
      if (!value) {
        return false;
      }
      onSubmitSet(event);
      input.value = "";
    };

    return this.createElement(
      "div",
      { className: "container" },
      this.createElement("div", { className: "timeline-container" }),
      this.createElement(
        "form",
        { className: "timeline-input", onsubmit: onSubmit },
        input,
        this.createElement(
          "div",
          { className: "controll-container" },
          this.createElement("button", {
            className: "voice-submit-btn btn-control",
            type: "button",
            disabled: true,
            onpointerdown: startRecording,
          }),
          this.createElement("button", {
            className: "video-submit-btn btn-control",
            type: "button",
            disabled: true,
            onpointerdown: startRecording,
          }),
          this.createElement("button", {
            className: "text-submit-btn btn-control",
            type: "submit",
            disabled: true,
          }),
        ),
      ),
    );
  }

  textMessage(data) {
    return this.createElement(
      "div",
      { className: "message-container" },
      this.createElement(
        "div",
        { className: "message-content" },
        `${data.text}`,
      ),
      this.createElement(
        "div",
        { className: "message-date" },
        `${data.day}.${data.month}.${data.year} ${data.hours}:${data.minutes}`,
      ),
      this.createElement(
        "div",
        { className: "message-coordinate" },
        `[${data.lat}, ${data.long}]`,
      ),
    );
  }

  audioMessage(data) {
    return this.createElement(
      "div",
      { className: "message-container" },
      this.createElement("audio", {
        className: "message-content",
        controls: true,
        src: URL.createObjectURL(data.url),
      }),
      this.createElement(
        "div",
        { className: "message-date" },
        `${data.day}.${data.month}.${data.year} ${data.hours}:${data.minutes}`,
      ),
      this.createElement(
        "div",
        { className: "message-coordinate" },
        `[${data.lat}, ${data.long}]`,
      ),
    );
  }

  videoMessage(data) {
    return this.createElement(
      "div",
      { className: "message-container" },
      this.createElement("video", {
        className: "message-content",
        controls: true,
        src: URL.createObjectURL(data.url),
      }),
      this.createElement(
        "div",
        { className: "message-date" },
        `${data.day}.${data.month}.${data.year} ${data.hours}:${data.minutes}`,
      ),
      this.createElement(
        "div",
        { className: "message-coordinate" },
        `[${data.lat}, ${data.long}]`,
      ),
    );
  }
}
