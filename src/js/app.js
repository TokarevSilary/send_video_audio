import { TimelineControl } from "./TimelineControl";
import { RenderPage } from "./RenderPage";

const root = document.getElementById("root");
let timelineControl;

const renderPage = new RenderPage(
  root,
  (submit) => timelineControl.submitData(submit),
  (recording) => timelineControl.startRecording(recording),
);

timelineControl = new TimelineControl(root, renderPage);

timelineControl.start();
