import { useEffect, useRef, useState } from "react";
import "./App.css";

const FRAME_COUNT = 100;

function App() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [viewMode, setViewMode] = useState("frames1");

  const currentFrame = (index, folder) => {
    const frameNumber = String(index).padStart(4, "0");
    return `/${folder}/${frameNumber}.png`;
  };

  useEffect(() => {
    imagesRef.current = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i, viewMode);
      imagesRef.current.push(img);
    }
  }, [viewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function drawImage(img) {
      if (!img || !img.complete) return;

      const canvasRatio = canvas.width / canvas.height;
      const imageRatio = img.width / img.height;

      let drawWidth;
      let drawHeight;
      let offsetX;
      let offsetY;

      if (imageRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawImage(imagesRef.current[0]);
    }

    function updateFrame() {
      const scrollTop = window.scrollY;
      const maxScroll = window.innerHeight * 4;

      const scrollFraction = Math.min(scrollTop / maxScroll, 1);
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );

      requestAnimationFrame(() => {
        drawImage(imagesRef.current[frameIndex]);
      });
    }

    resizeCanvas();
    updateFrame();

    window.addEventListener("scroll", updateFrame);
    window.addEventListener("resize", resizeCanvas);

    const interval = setInterval(updateFrame, 100);

    return () => {
      window.removeEventListener("scroll", updateFrame);
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(interval);
    };
  }, [viewMode]);

  return (
    <main>
      <nav className="navbar">
        <div className="logo">
          <div className="logo-mark">T</div>
          <span>Test Energy</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#category">Category</a>
          <a href="#about">About Us</a>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <canvas ref={canvasRef} className="scroll-canvas" />

        <div className="hero-content">
          <p className="eyebrow">Oil & Gas Engineering</p>
          <h1>Precision drilling systems for modern energy operations.</h1>
          <p className="description">
            Explore our rig assembly through an interactive scroll experience.
          </p>
        </div>

        <div className="view-toggle">
          <p>View mode</p>

          <div className="toggle-buttons">
            <button
              className={viewMode === "frames1" ? "active" : ""}
              onClick={() => setViewMode("frames1")}
            >
              Exterior
            </button>

            <button
              className={viewMode === "frames2" ? "active" : ""}
              onClick={() => setViewMode("frames2")}
            >
              Wireframe
            </button>
          </div>
        </div>
      </section>

      <section id="category" className="info-section">
        <p className="eyebrow">Categories</p>
        <h2>Industrial drilling technology</h2>

        <div className="cards">
          <div className="card">
            <h3>Rig Assembly</h3>
            <p>Heavy-duty structures designed for safe field deployment.</p>
          </div>

          <div className="card">
            <h3>Mechanical Systems</h3>
            <p>High-performance components for demanding environments.</p>
          </div>

          <div className="card">
            <h3>Field Operations</h3>
            <p>Optimized workflows for oil exploration and production.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div>
          <p className="eyebrow">About Us</p>
          <h2>Engineering reliability for the energy industry.</h2>
        </div>

        <p>
          DrillCore Energy builds advanced drilling solutions focused on safety,
          precision, and operational performance across complex oil field
          environments.
        </p>
      </section>

      <footer className="footer">
        <div className="logo">
          <div className="logo-mark">Test</div>
          <span>T Energy</span>
        </div>

        <p>© 2026 Test. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;