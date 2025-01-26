// src/components/AnimatedLogin/AnimatedLogin.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AnimatedLogin.css';

const AnimatedLogin = () => {
  // Animation refs
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const pointsRef = useRef([]);
  const ctxRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const animateHeaderRef = useRef(true);
  const requestRef = useRef();

  // Login state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  class Circle {
    constructor(pos, rad, color) {
      this.pos = pos || null;
      this.radius = rad || null;
      this.color = color || null;
      this.active = 0;
    }

    draw() {
      if (!this.active || !ctxRef.current) return;
      ctxRef.current.beginPath();
      ctxRef.current.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
      ctxRef.current.fillStyle = `rgba(156,217,249,${this.active})`;
      ctxRef.current.fill();
    }
  }

  const getDistance = (p1, p2) => {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  };

  const initHeader = () => {
    widthRef.current = window.innerWidth;
    heightRef.current = window.innerHeight;
    targetRef.current = { x: widthRef.current/2, y: heightRef.current/2 };

    if (headerRef.current) {
      headerRef.current.style.height = heightRef.current+'px';
    }

    if (canvasRef.current) {
      canvasRef.current.width = widthRef.current;
      canvasRef.current.height = heightRef.current;
      ctxRef.current = canvasRef.current.getContext('2d');
    }

    // Create points
    pointsRef.current = [];
    for(let x = 0; x < widthRef.current; x = x + widthRef.current/20) {
      for(let y = 0; y < heightRef.current; y = y + heightRef.current/20) {
        const px = x + Math.random()*widthRef.current/20;
        const py = y + Math.random()*heightRef.current/20;
        const p = {x: px, originX: px, y: py, originY: py };
        pointsRef.current.push(p);
      }
    }

    // For each point find the 5 closest points
    for(let i = 0; i < pointsRef.current.length; i++) {
      const closest = [];
      const p1 = pointsRef.current[i];
      for(let j = 0; j < pointsRef.current.length; j++) {
        const p2 = pointsRef.current[j];
        if(!(p1 === p2)) {
          let placed = false;
          for(let k = 0; k < 5; k++) {
            if(!placed) {
              if(!closest[k]) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for(let k = 0; k < 5; k++) {
            if(!placed) {
              if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // Assign circles to points
    for(let i in pointsRef.current) {
      pointsRef.current[i].circle = new Circle(pointsRef.current[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
    }
  };

  const mouseMove = (e) => {
    let posx = 0;
    let posy = 0;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    targetRef.current = { x: posx, y: posy };
  };

  const scrollCheck = () => {
    animateHeaderRef.current = document.body.scrollTop <= heightRef.current;
  };

  const resize = () => {
    widthRef.current = window.innerWidth;
    heightRef.current = window.innerHeight;
    if (headerRef.current) {
      headerRef.current.style.height = heightRef.current+'px';
    }
    if (canvasRef.current) {
      canvasRef.current.width = widthRef.current;
      canvasRef.current.height = heightRef.current;
    }
  };

  const drawLines = (p) => {
    if(!p.active || !ctxRef.current) return;
    for(let i in p.closest) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(p.x, p.y);
      ctxRef.current.lineTo(p.closest[i].x, p.closest[i].y);
      ctxRef.current.strokeStyle = `rgba(156,217,249,${p.active})`;
      ctxRef.current.stroke();
    }
  };

  const shiftPoint = (p) => {
    gsap.to(p, {
      duration: 1 + Math.random(),
      x: p.originX - 50 + Math.random()*100,
      y: p.originY - 50 + Math.random()*100,
      ease: "circ.inOut",
      onComplete: () => shiftPoint(p)
    });
  };

  const animate = () => {
    if(animateHeaderRef.current) {
      ctxRef.current?.clearRect(0,0,widthRef.current,heightRef.current);
      for(let i in pointsRef.current) {
        const point = pointsRef.current[i];
        if(Math.abs(getDistance(targetRef.current, point)) < 4000) {
          point.active = 0.3;
          point.circle.active = 0.6;
        } else if(Math.abs(getDistance(targetRef.current, point)) < 20000) {
          point.active = 0.1;
          point.circle.active = 0.3;
        } else if(Math.abs(getDistance(targetRef.current, point)) < 40000) {
          point.active = 0.02;
          point.circle.active = 0.1;
        } else {
          point.active = 0;
          point.circle.active = 0;
        }
        drawLines(point);
        point.circle.draw();
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initHeader();
  
    if(!('ontouchstart' in window)) {
      window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
  
    animate();
    pointsRef.current.forEach(point => shiftPoint(point));
  
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('scroll', scrollCheck);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate, initHeader, shiftPoint, mouseMove, scrollCheck, resize, pointsRef, requestRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server response was not JSON');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token) {
        throw new Error('Token not received from server');
      }

      login(data.token);
      setCredentials({ username: '', password: '' });
      navigate('/home');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="large-header" className="large-header" ref={headerRef}>
      <canvas id="demo-canvas" ref={canvasRef}></canvas>
      <div className="main-title form-block">
        <div id="title">
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Wiki Paralegal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            A safe place for Paralegals
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({
                  ...credentials,
                  username: e.target.value
                })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({
                  ...credentials,
                  password: e.target.value
                })}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimatedLogin;