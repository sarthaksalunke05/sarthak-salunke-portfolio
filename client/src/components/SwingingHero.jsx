import { useEffect, useRef } from "react";
import hero from "../assets/spidey.png";

export default function SwingingHero({ size = 150 }) {
    const imgRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        const line = lineRef.current;
        const g = 0.6;
        let ax = window.innerWidth - 140;
        let L = 240, ang = 0.9, vel = 0;
        let x = ax, y = L, drag = false, raf;

        const frame = () => {
            if (!drag) {
                vel += -(g / L) * Math.sin(ang);
                vel *= 0.998;
                ang += vel;
                x = ax + L * Math.sin(ang);
                y = L * Math.cos(ang);
            }
            img.style.left = x + "px";
            img.style.top = y + "px";
            img.style.transform = "translate(-50%, 0) rotate(" + (-ang * 57.3) + "deg)";
            line.setAttribute("x1", ax);
            line.setAttribute("y1", 0);
            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
            raf = requestAnimationFrame(frame);
        };

        const down = (e) => {
            drag = true;
            img.setPointerCapture(e.pointerId);
        };
        const move = (e) => {
            if (!drag) return;
            x = Math.min(window.innerWidth - 20, Math.max(20, e.clientX));
            y = Math.min(window.innerHeight - size, Math.max(40, e.clientY));
        };
        const up = () => {
            if (!drag) return;
            drag = false;
            L = Math.max(80, Math.hypot(x - ax, y));
            ang = Math.atan2(x - ax, y);
            vel = 0;
        };
        const resize = () => { ax = window.innerWidth - 140; };

        img.addEventListener("pointerdown", down);
        img.addEventListener("pointermove", move);
        img.addEventListener("pointerup", up);
        window.addEventListener("resize", resize);
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            img.removeEventListener("pointerdown", down);
            img.removeEventListener("pointermove", move);
            img.removeEventListener("pointerup", up);
            window.removeEventListener("resize", resize);
        };
    }, [size]);

    return (
        <>
            <svg
                style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 50 }}
            >
                <line ref={lineRef} stroke="#e8e8f0" strokeWidth="2" />
            </svg>
            <img
                ref={imgRef}
                src={hero}
                alt="Swinging hero"
                draggable={false}
                style={{
                    position: "fixed",
                    width: size,
                    cursor: "grab",
                    touchAction: "none",
                    userSelect: "none",
                    transformOrigin: "50% 0",
                    zIndex: 51,
                    filter: "drop-shadow(0 14px 18px rgba(0,0,0,.65))",
                }}
            />
        </>
    );
}