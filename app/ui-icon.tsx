type IconName = "history" | "patient" | "speaker" | "microphone" | "send" | "close";

const paths: Record<IconName, string> = {
  history: "M3 11a9 9 0 1 1 2.5 7M3 4v7h7m2-5v6l4 2",
  patient: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2Z",
  speaker: "m11 5-6 4H2v6h3l6 4Zm4 3 6 8m0-8-6 8",
  microphone: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0Zm-3 6v1a6 6 0 0 0 12 0v-1m-6 7v4m-3 0h6",
  send: "m22 2-7 20-4-9L2 9Zm0 0L11 13",
  close: "m6 6 12 12M6 18 18 6",
};

export default function UiIcon({ name }: { name: IconName }) {
  return (
    <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
