"use client";

interface AudioControllerProps {
  isMuted: boolean;
  onMuteToggle: () => void;
}

export default function AudioController({ isMuted, onMuteToggle }: AudioControllerProps) {
  return (
    <div className="absolute top-3 left-3 z-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
        className={`p-2 rounded-full border transition-all ${
          isMuted
            ? "bg-[#1d0a33] border-fuchsia-300/20 opacity-70"
            : "bg-[#1d0a33] border-fuchsia-300/50 shadow-[0_0_16px_rgba(232,121,249,0.35)]"
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          {isMuted ? (
            <path d="M792-56 56-792l56-56 736 736-56 56ZM560-514l-80-80v-246h240v160H560v166ZM400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-62l80 80v120q0 66-47 113t-113 47Z" />
          ) : (
            <path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z" />
          )}
        </svg>
      </button>
    </div>
  );
}
