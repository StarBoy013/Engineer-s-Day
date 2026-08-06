import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import openPeepsImage from "../assets/image.png";

const config = {
  src: openPeepsImage,
  rows: 15,
  cols: 7,
};

const CROWD_OFFSET_Y = 35;
// UTILS
const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;

const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];

const removeItemFromArray = (array: any[], item: any) =>
  removeFromArray(array, array.indexOf(item));

const removeRandomFromArray = (array: any[]) =>
  removeFromArray(array, randomIndex(array));

const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

// CLASSES
class Peep {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  width: number;
  height: number;
  drawArgs: any[];
  x: number = 0;
  y: number = 0;
  anchorY: number = 0;
  scaleX: number = 1;
  walk: gsap.core.Timeline | null = null;

  constructor({ image, rect }: { image: HTMLImageElement; rect: [number, number, number, number] }) {
    this.image = image;
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];
    this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height];
  }

  setRect(rect: [number, number, number, number]) {
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];
    this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height];
  }

  render(ctx: CanvasRenderingContext2D) {
    let scaleY = 1;
    if (ctx.canvas.clientWidth < 960) {
      scaleY = 1.0;
    }

    if (ctx.canvas.clientWidth < 768) {
      scaleY = 0.75;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, scaleY);
    ctx.drawImage(
      this.drawArgs[0] as HTMLImageElement,
      this.drawArgs[1],
      this.drawArgs[2],
      this.drawArgs[3],
      this.drawArgs[4],
      this.drawArgs[5],
      this.drawArgs[6],
      this.drawArgs[7],
      this.drawArgs[8]
    );
    ctx.restore();
  }
}

// TWEEN FACTORIES
const resetPeep = ({ stage, peep }: { stage: { width: number; height: number }; peep: Peep }) => {
  let offsetVarA = 100;
  let offsetVarB = 250;
  let scaleX = 1;

  if (window.innerWidth < 960) {
    offsetVarA = 200;
    offsetVarB = 150;
    scaleX = 1.0;
  }

  if (window.innerWidth < 768) {
    offsetVarA = 100;
    offsetVarB = 250;
    scaleX = 0.75;
  }

  const direction = Math.random() > 0.5 ? 1 : -1;
  // using an ease function to skew random to lower values to help hide that peeps have no legs
  const offsetY =
    offsetVarA - offsetVarB * gsap.parseEase("power2.in")(Math.random());
  const startY = stage.height - peep.height + offsetY + CROWD_OFFSET_Y;
  let startX: number;
  let endX: number;

  if (direction === 1) {
    startX = -peep.width;
    endX = stage.width;
    peep.scaleX = scaleX;
  } else {
    startX = stage.width + peep.width;
    endX = 0;
    peep.scaleX = -1 * scaleX;
  }

  peep.x = startX;
  peep.y = startY;
  peep.anchorY = startY;

  return {
    startX,
    startY,
    endX,
  };
};

const normalWalk = ({ peep, props }: { peep: Peep; props: { startX: number; startY: number; endX: number } }) => {
  const { startY, endX } = props;

  const xDuration = 10;
  const yDuration = 0.25;

  const tl = gsap.timeline();
  tl.timeScale(randomRange(0.5, 1.5));
  tl.to(
    peep,
    {
      duration: xDuration,
      x: endX,
      ease: "none",
    },
    0
  );
  tl.to(
    peep,
    {
      duration: yDuration,
      repeat: xDuration / yDuration,
      yoyo: true,
      y: startY - 10,
    },
    0
  );

  return tl;
};

const walks = [normalWalk];

export const CrowdCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const img = new Image();
    img.src = config.src;

    img.onload = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
      window.addEventListener("resize", resize);
    };

    function createPeeps() {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          new Peep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        );
      }
    }

    function resize() {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * window.devicePixelRatio;
      canvas.height = stage.height * window.devicePixelRatio;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    }

    function initCrowd() {
      while (availablePeeps.length) {
        const peepInstance = addPeepToCrowd();
        if (peepInstance && peepInstance.walk) {
          peepInstance.walk.progress(Math.random());
        }
      }
    }

    function addPeepToCrowd() {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    }

    function removePeepFromCrowd(peep: Peep) {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    }

    function render() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.width; // Clear canvas
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    }

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[50vh] md:min-h-[500px] cursor-pointer block bg-transparent"
    />
  );
};
