/* eslint-disable @typescript-eslint/no-explicit-any */
/* @ts-nocheck */
"use client";

import React, { useEffect, useRef } from "react";

const NeuralNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);

    const opts = {
      range: 180,
      baseConnections: 3,
      addedConnections: 5,
      baseSize: 5,
      minSize: 1,
      dataToConnectionSize: 0.4,
      sizeMultiplier: 0.7,
      allowedDist: 40,
      baseDist: 40,
      addedDist: 30,
      connectionAttempts: 100,
      dataToConnections: 1,
      baseSpeed: 0.04,
      addedSpeed: 0.05,
      baseGlowSpeed: 0.4,
      addedGlowSpeed: 0.4,
      rotVelX: 0.0005,
      rotVelY: 0.0004,
      repaintColor: "#111",
      connectionColor: "hsla(200,60%,light%,alp)",
      rootColor: "hsla(0,60%,light%,alp)",
      endColor: "hsla(160,20%,light%,alp)",
      dataColor: "hsla(40,80%,light%,alp)",
      wireframeWidth: 0.1,
      wireframeColor: "#88f",
      depth: 250,
      focalLength: 250,
      vanishPoint: { x: w / 2, y: h / 2 },
    };

    const squareRange = opts.range * opts.range;
    const squareAllowed = opts.allowedDist * opts.allowedDist;
    const mostDistant = opts.depth + opts.range;
    const Tau = Math.PI * 2;

    let sinX = 0, sinY = 0, cosX = 0, cosY = 0;
    const connections: any[] = [],
      toDevelop: any[] = [],
      data: any[] = [],
      all: any[] = [];
    let tick = 0,
      animating = false;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    function squareDist(a: any, b: any) {
      const x = b.x - a.x,
        y = b.y - a.y,
        z = b.z - a.z;
      return x * x + y * y + z * z;
    }

    function Connection(this: any, x: number, y: number, z: number, size: number) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.size = size;
      this.screen = {};
      this.links = [];
      this.probabilities = [];
      this.isEnd = false;
      this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
    }

    const ConnectionConstructor = Connection as any;

    Connection.prototype.link = function (this: any) {
      if (this.size < opts.minSize) return (this.isEnd = true);
      const links = [],
        connectionsNum = opts.baseConnections + ((Math.random() * opts.addedConnections) | 0);
      let attempt = opts.connectionAttempts;
      while (links.length < connectionsNum && --attempt > 0) {
        const alpha = Math.random() * Math.PI,
          beta = Math.random() * Tau,
          len = opts.baseDist + opts.addedDist * Math.random(),
          cosA = Math.cos(alpha),
          sinA = Math.sin(alpha),
          cosB = Math.cos(beta),
          sinB = Math.sin(beta),
          pos = {
            x: this.x + len * cosA * sinB,
            y: this.y + len * sinA * sinB,
            z: this.z + len * cosB,
          };
        if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
          let passedExisting = true,
            passedBuffered = true;
          for (let i = 0; i < connections.length; ++i)
            if (squareDist(pos, connections[i]) < squareAllowed) passedExisting = false;
          if (passedExisting) for (let i = 0; i < links.length; ++i) if (squareDist(pos, links[i]) < squareAllowed) passedBuffered = false;
          if (passedExisting && passedBuffered) links.push({ x: pos.x, y: pos.y, z: pos.z });
        }
      }
      if (links.length === 0)
        this.isEnd = true;
      else {
        for (let i = 0; i < links.length; ++i) {
          const pos = links[i],
            connection = new ConnectionConstructor(pos.x, pos.y, pos.z, this.size * opts.sizeMultiplier);
          this.links[i] = connection;
          all.push(connection);
          connections.push(connection);
        }
        for (let i = 0; i < this.links.length; ++i) toDevelop.push(this.links[i]);
      }
    };

    Connection.prototype.step = function (this: any) {
      this.setScreen();
      this.screen.color = (this.isEnd ? opts.endColor : opts.connectionColor)
        .replace("light", String(30 + ((tick * this.glowSpeed) % 30)))
        .replace("alp", String(0.2 + ((1 - this.screen.z / mostDistant) * 0.8)));
      for (let i = 0; i < this.links.length; ++i) {
        ctx.moveTo(this.screen.x, this.screen.y);
        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
      }
    };

    (Connection as any).rootStep = function (this: any) {
      this.setScreen();
      this.screen.color = opts.rootColor
        .replace("light", String(30 + ((tick * this.glowSpeed) % 30)))
        .replace("alp", String((1 - this.screen.z / mostDistant) * 0.8));
      for (let i = 0; i < this.links.length; ++i) {
        ctx.moveTo(this.screen.x, this.screen.y);
        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
      }
    };

    Connection.prototype.draw = function (this: any) {
      ctx.fillStyle = this.screen.color;
      ctx.beginPath();
      ctx.arc(this.screen.x, this.screen.y, (this.screen.scale * this.size) / 2, 0, Tau);
      ctx.fill();
    };

    function Data(this: any, connection: any) {
      this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
      this.speed = opts.baseSpeed + opts.addedSpeed * Math.random();
      this.screen = {};
      this.setConnection(connection);
    }

    const DataConstructor = Data as any;

    Data.prototype.reset = function (this: any) {
      this.setConnection(connections[0]);
      this.ended = 2;
    };

    Data.prototype.step = function (this: any) {
      this.proportion += this.speed;
      if (this.proportion < 1) {
        this.x = this.ox + this.dx * this.proportion;
        this.y = this.oy + this.dy * this.proportion;
        this.z = this.oz + this.dz * this.proportion;
        this.size = (this.os + this.ds * this.proportion) * opts.dataToConnectionSize;
      } else this.setConnection(this.nextConnection);
      this.screen.lastX = this.screen.x;
      this.screen.lastY = this.screen.y;
      this.setScreen();
      this.screen.color = opts.dataColor
        .replace("light", String(40 + ((tick * this.glowSpeed) % 50)))
        .replace("alp", String(0.2 + ((1 - this.screen.z / mostDistant) * 0.6)));
    };

    Data.prototype.draw = function (this: any) {
      if (this.ended) return --this.ended;
      ctx.beginPath();
      ctx.strokeStyle = this.screen.color;
      ctx.lineWidth = (this.screen.scale * this.size) / 2;
      ctx.moveTo(this.screen.lastX, this.screen.lastY);
      ctx.lineTo(this.screen.x, this.screen.y);
      ctx.stroke();
    };

    Data.prototype.setConnection = function (this: any, connection: any) {
      if (connection.isEnd)
        this.reset();
      else {
        this.connection = connection;
        this.nextConnection = connection.links[((connection.links.length * Math.random()) | 0)];
        this.ox = connection.x;
        this.oy = connection.y;
        this.oz = connection.z;
        this.os = connection.size;
        this.nx = this.nextConnection.x;
        this.ny = this.nextConnection.y;
        this.nz = this.nextConnection.z;
        this.ns = this.nextConnection.size;
        this.dx = this.nx - this.ox;
        this.dy = this.ny - this.oy;
        this.dz = this.nz - this.oz;
        this.ds = this.ns - this.os;
        this.proportion = 0;
      }
    };

    Connection.prototype.setScreen = Data.prototype.setScreen = function (this: any) {
      let x = this.x,
        y = this.y,
        z = this.z;
      const Y = y;
      y = y * cosX - z * sinX;
      z = z * cosX + Y * sinX;
      const Z = z;
      z = z * cosY - x * sinY;
      x = x * cosY + Z * sinY;
      this.screen.z = z;
      z += opts.depth;
      this.screen.scale = opts.focalLength / z;
      this.screen.x = opts.vanishPoint.x + x * this.screen.scale;
      this.screen.y = opts.vanishPoint.y + y * this.screen.scale;
    };

    function init() {
      connections.length = 0;
      data.length = 0;
      all.length = 0;
      toDevelop.length = 0;
      const connection = new ConnectionConstructor(0, 0, 0, opts.baseSize);
      (connection as any).step = (Connection as any).rootStep;
      connections.push(connection);
      all.push(connection);
      connection.link();
      while (toDevelop.length > 0) {
        toDevelop[0].link();
        toDevelop.shift();
      }
      if (!animating) {
        animating = true;
        anim();
      }
    }

    function anim() {
      window.requestAnimationFrame(anim);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = opts.repaintColor;
      ctx.fillRect(0, 0, w, h);
      ++tick;
      const rotX = tick * opts.rotVelX,
        rotY = tick * opts.rotVelY;
      cosX = Math.cos(rotX);
      sinX = Math.sin(rotX);
      cosY = Math.cos(rotY);
      sinY = Math.sin(rotY);
      if (data.length < connections.length * opts.dataToConnections) {
        const datum = new DataConstructor(connections[0]);
        data.push(datum);
        all.push(datum);
      }
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      ctx.lineWidth = opts.wireframeWidth;
      ctx.strokeStyle = opts.wireframeColor;
      all.map(function (item) {
        item.step();
      });
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      all.sort(function (a, b) {
        return b.screen.z - a.screen.z;
      });
      all.map(function (item) {
        item.draw();
      });
    }

    init();

    const handleResize = () => {
      opts.vanishPoint.x = (w = c.width = window.innerWidth) / 2;
      opts.vanishPoint.y = (h = c.height = window.innerHeight) / 2;
      ctx.fillRect(0, 0, w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />;
};

export default NeuralNetworkBackground;
