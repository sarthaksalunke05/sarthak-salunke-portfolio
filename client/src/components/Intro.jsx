import { useRef, useState } from "react";
import "./Intro.css";

const VIDEOS = {
    mobile: "/intro-mobile.mp4",
    desktop: "/intro-desktop.mp4",
};

// 768px पेक्षा लहान किंवा उभी screen = mobile
const getVideoSrc = () =>
    window.matchMedia("(max-width: 768px), (max-aspect-ratio: 1/1)").matches
        ? VIDEOS.mobile
        : VIDEOS.desktop;

export default function Intro({ onDone }) {
    const videoRef = useRef(null);
    const [videoSrc] = useState(getVideoSrc);
    const [started, setStarted] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const finish = () => {
        if (leaving) return;
        setLeaving(true);
        setTimeout(onDone, 800);
    };

    const start = () => {
        setStarted(true);
        const v = videoRef.current;
        v.currentTime = 0;
        v.muted = false;
        v.play().catch(finish);
    };

    return (
        <div className={`intro ${leaving ? "leaving" : ""}`}>
            <video
                ref={videoRef}
                src={videoSrc}
                className="intro-video"
                playsInline
                preload="auto"
                onEnded={finish}
                onError={finish}
            />
            {!started && (
                <button className="enter-btn" onClick={start}>Click to enter</button>
            )}
            {started && (
                <button className="skip-btn" onClick={finish}>Skip</button>
            )}
        </div>
    );
}