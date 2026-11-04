"use client";
import { useCallback, useEffect, useRef, useState } from "react";
const W = 800;
const H = 260;
const GROUND = 210;
type Obstacle = {
  x: number;
  width: number;
  height: number;
};
export default function DinoRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    running: false,
    over: false,
    started: false,
    frame: 0,
    score: 0,
    speed: 5,
    dinoY: GROUND - 42,
    velocity: 0,
    obstacles: [] as Obstacle[],
    distance: 0,
  });

  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(Number(localStorage.getItem("baclogged-dino-best") || 0));
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;

    g.running = true;
    g.over = false;
    g.started = true;
    g.frame = 0;
    g.score = 0;
    g.speed = 5;
    g.dinoY = GROUND - 42;
    g.velocity = 0;
    g.obstacles = [];
    g.distance = 0;

    setScore(0);
    setStatus("playing");
  }, []);

  const jump = useCallback(() => {
    const g = gameRef.current;

    if (!g.started || g.over) {
      startGame();
      return;
    }

    if (g.running && g.dinoY >= GROUND - 43) {
      g.velocity = -12.5;
    }
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let raf = 0;
    let lastTime = 0;
    let scoreFrame = 0;

    const drawDino = (x: number, y: number, frame: number) => {
      ctx.fillStyle = "#c7f36b";

      ctx.fillRect(x + 5, y + 12, 28, 23);
      ctx.fillRect(x + 23, y + 3, 20, 18);

      ctx.fillRect(x + 32, y, 17, 16);

    
      ctx.fillStyle = "#101510";
      ctx.fillRect(x + 40, y + 5, 4, 4);

      
      ctx.fillStyle = "#c7f36b";
      ctx.fillRect(x, y + 18, 9, 7);

      
      if (gameRef.current.running &&
          gameRef.current.dinoY >= GROUND - 43) {
        ctx.fillRect(x + 10, y + 32, 7, frame % 2 ? 10 : 5);
        ctx.fillRect(x + 29, y + 32, 7, frame % 2 ? 5 : 10);
      } else {
        ctx.fillRect(x + 10, y + 32, 7, 8);
        ctx.fillRect(x + 29, y + 32, 7, 8);
      }
    };

    const draw = () => {
      const g = gameRef.current;

      ctx.fillStyle = "#11151b";
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(
        590, 80, 5, 590, 80, 220
      );
      glow.addColorStop(0, "rgba(177,126,53,0.12)");
      glow.addColorStop(1, "rgba(17,21,27,0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 24; i++) {
        const x = (i * 137 + 30) % W;
        const y = 25 + (i * 47) % 115;

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(x, y, 2, 2);
      }

      ctx.fillStyle = "#d8c38c";
      ctx.beginPath();
      ctx.arc(690, 62, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#11151b";
      ctx.beginPath();
      ctx.arc(700, 53, 19, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#202a30";
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(130, 100);
      ctx.lineTo(220, GROUND);
      ctx.lineTo(350, 125);
      ctx.lineTo(460, GROUND);
      ctx.lineTo(580, 112);
      ctx.lineTo(710, GROUND);
      ctx.lineTo(800, 145);
      ctx.lineTo(800, GROUND);
      ctx.fill();

      // Ground
      ctx.fillStyle = "#d1aa62";
      ctx.fillRect(0, GROUND, W, 2);

      ctx.fillStyle = "rgba(209,170,98,0.35)";

      for (let i = 0; i < 25; i++) {
        const x = (i * 47 - g.distance * 1.2) % W;
        ctx.fillRect((x + W) % W, GROUND + 13, 13, 2);
      }

      g.obstacles.forEach((ob) => {
        ctx.fillStyle = "#8dbb66";

        const x = ob.x;
        const y = GROUND - ob.height;

        ctx.fillRect(x + 9, y, 10, ob.height);
        ctx.fillRect(x, y + 13, 10, 8);
        ctx.fillRect(x, y + 5, 6, 16);
        ctx.fillRect(x + 19, y + 22, 9, 8);
        ctx.fillRect(x + 22, y + 12, 6, 18);

        ctx.fillStyle = "#c7f36b";
        ctx.fillRect(x + 12, y + 4, 2, 7);
      });

      drawDino(95, g.dinoY, g.frame);

      ctx.fillStyle = "#c7f36b";
      ctx.font = "bold 15px monospace";
      ctx.fillText(`SCORE ${Math.floor(g.score).toString().padStart(5, "0")}`, 22, 30);

      ctx.fillStyle = "#999999";
      ctx.fillText(`BEST ${best.toString().padStart(5, "0")}`, 22, 52);

      if (!g.running) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = "center";

        ctx.fillStyle = "#c7f36b";
        ctx.font = "bold 25px monospace";

        ctx.fillText(
          g.over ? "GAME OVER" : "DINO RUNNER",
          W / 2, 105
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px monospace";

        ctx.fillText(
          g.over
            ? "YOUR RUN HAS ENDED"
            : "PRESS START TO ENTER THE DESERT",
          W / 2, 132
        );

        ctx.textAlign = "left";
      }
    };

    const loop = (time: number) => {
      const g = gameRef.current;

      const delta = lastTime
        ? Math.min((time - lastTime) / 16.67, 2)
        : 1;

      lastTime = time;
      g.frame++;

      if (g.running) {
        g.score += delta * 0.15;
        g.speed = Math.min(5 + g.score / 80, 13);

        g.velocity += 0.65 * delta;
        g.dinoY += g.velocity * delta;

        if (g.dinoY >= GROUND - 42) {
          g.dinoY = GROUND - 42;
          g.velocity = 0;
        }

        if (
          g.obstacles.length === 0 ||
          g.obstacles[g.obstacles.length - 1].x < 470
        ) {
          if (g.frame % 70 === 0) {
            const height = 30 + Math.random() * 20;

            g.obstacles.push({
              x: W + 20,
              width: 29,
              height,
            });
          }
        }

        g.obstacles.forEach((ob) => {
          ob.x -= g.speed * delta;
        });

        g.obstacles = g.obstacles.filter(
          (ob) => ob.x > -50
        );

        g.distance += g.speed * delta;

        const player = {
          x: 105,
          y: g.dinoY + 5,
          width: 30,
          height: 34,
        };

        for (const ob of g.obstacles) {
          const hit =
            player.x + player.width - 7 > ob.x + 3 &&
            player.x + 7 < ob.x + ob.width - 3 &&
            player.y + player.height > GROUND - ob.height + 4;

          if (hit) {
            g.running = false;
            g.over = true;

            const finalScore = Math.floor(g.score);

            setScore(finalScore);
            setStatus("over");

            const previousBest = Number(
              localStorage.getItem("baclogged-dino-best") || 0
            );

            if (finalScore > previousBest) {
              localStorage.setItem(
                "baclogged-dino-best",
                String(finalScore)
              );
              setBest(finalScore);
            }

            break;
          }
        }

        scoreFrame++;

        if (scoreFrame % 8 === 0) {
          setScore(Math.floor(g.score));
        }
      }

      draw();
      raf = requestAnimationFrame(loop);
    };

    const onKey = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();

        if (!e.repeat) jump();
      }

      if (e.code === "Enter" && !gameRef.current.running) {
        startGame();
      }
    };

    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [jump, startGame, best]);

  return (
    <section className="overflow-hidden border border-[#343d35] bg-[#111713] shadow-2xl">

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[9px] font-bold tracking-[0.3em] text-[#9bbd70]">
            BACLOGGED ARCADE // SIDE QUEST 001
          </p>
          <h3 className="mt-1 text-lg font-black tracking-wider text-white">
            DINO RUNNER
          </h3>
        </div>

        <div className="text-right">
          <p className="text-[9px] tracking-widest text-gray-500">
            PERSONAL BEST
          </p>
          <p className="font-mono text-xl font-bold text-[#c7f36b]">
            {best.toString().padStart(5, "0")}
          </p>
        </div>
      </div>

      <div className="relative bg-[#11151b]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={jump}
          className="block w-full touch-none cursor-pointer"
          aria-label="Dino Runner game. Tap or press Space to jump."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-5">

        <div>
          <p className="text-[9px] tracking-[0.2em] text-gray-500">
            CURRENT SCORE
          </p>
          <p className="font-mono text-2xl font-bold text-[#c7f36b]">
            {score.toString().padStart(5, "0")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden text-[9px] tracking-widest text-gray-500 sm:block">
            SPACE / ↑ TO JUMP
          </span>

          <button
            onClick={status === "playing" ? jump : startGame}
            className="border border-[#c7f36b]/50 bg-[#c7f36b] px-6 py-3 text-[10px] font-black tracking-[0.2em] text-black transition hover:bg-white"
          >
            {status === "playing"
              ? "JUMP!"
              : status === "over"
                ? "PLAY AGAIN ↻"
                : "START GAME →"}
          </button>
        </div>
      </div>

      <div className="flex justify-between border-t border-white/5 px-5 py-3 text-[9px] tracking-widest text-gray-600">
        <span>AVOID THE CACTI. BEAT YOUR RECORD.</span>
        <span className="text-[#9bbd70]">INSERT COIN: FREE</span>
      </div>
    </section>
  );
}
