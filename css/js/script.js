let animationSpeed = 1000;
      let isAnimating = false;
      let animationInterval;
      let packetCount = 0;
      let throughputInterval;

      const serviceInfo = {
        'mt5': 'MetaTrader 5 Server - Core trading platform handling positions, equity, and margin data',
        'connector': 'High-frequency connector polling MT5 API every 1-5 seconds using native DLLs',
        'kafka': 'Message queue for decoupled async data streaming - eliminates ingestion lag',
        'risk-service': 'Core business engine calculating Net Exposure, VaR, and executing risk rules',
        'redis': 'In-memory cache for ultra-fast real-time data access',
        'postgres': 'PostgreSQL with TimescaleDB for historical analytics and audit logs',
        'clickhouse': 'Columnar database optimized for analytical queries on large datasets',
        'api': 'API Gateway with REST, WebSocket, and gRPC endpoints for client communication',
        'keycloak': 'Identity and access management with OAuth2/OIDC authentication',
        'browser': 'Next.js-based admin dashboard with real-time WebSocket updates',
        'monitoring': 'Observability stack with Prometheus metrics, Grafana dashboards, and Loki logs'
      }

        ;

      const flowSequence = [{
        from: 'mt5', to: 'connector', phase: 1
      }

        ,
      {
        from: 'connector', to: 'kafka', phase: 1
      }

        ,
      {
        from: 'kafka', to: 'risk-service', phase: 2
      }

        ,
      {
        from: 'risk-service', to: 'redis', phase: 2
      }

        ,
      {
        from: 'risk-service', to: 'postgres', phase: 2
      }

        ,
      {
        from: 'risk-service', to: 'clickhouse', phase: 2
      }

        ,
      {
        from: 'risk-service', to: 'api', phase: 3
      }

        ,
      {
        from: 'api', to: 'keycloak', phase: 3
      }

        ,
      {
        from: 'api', to: 'browser', phase: 3
      }

      ];

      function showInfo(serviceId) {
        const info = serviceInfo[serviceId];

        if (info) {
          alert(info);
        }
      }

      function getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        const containerRect = document.getElementById('flowCanvas').getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top
        }

          ;
      }

      function createDataParticle(fromEl, toEl) {
        const particle = document.createElement('div');
        particle.className = 'data-particle';
        document.getElementById('flowCanvas').appendChild(particle);

        const start = getElementCenter(fromEl);
        const end = getElementCenter(toEl);

        particle.style.left = start.x + 'px';
        particle.style.top = start.y + 'px';

        const duration = animationSpeed * 0.8;
        const startTime = Date.now();

        function animate() {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function for smooth movement
          const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentX = start.x + (end.x - start.x) * easeProgress;
          const currentY = start.y + (end.y - start.y) * easeProgress;

          particle.style.left = currentX + 'px';
          particle.style.top = currentY + 'px';

          if (progress < 1) {
            requestAnimationFrame(animate);
          }

          else {
            particle.remove();
            packetCount++;
            document.getElementById('packets-sent').textContent = packetCount;
          }
        }

        animate();
      }

      function animateStep(step) {
        if (step >= flowSequence.length) return;

        const current = flowSequence[step];
        const fromEl = document.getElementById(current.from);
        const toEl = document.getElementById(current.to);

        // Update phase indicator
        document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));

        const phaseEl = document.getElementById(`phase$ {
      current.phase
    }

    `);
        phaseEl.classList.add('active');

        const phaseNames = ['Idle',
          'Data Acquisition',
          'Core Processing',
          'Presentation'];
        document.getElementById('active-phase').textContent = phaseNames[current.phase];

        // Highlight nodes
        fromEl.classList.add('active');
        toEl.classList.add('active');

        // Create animated particle
        createDataParticle(fromEl, toEl);

        setTimeout(() => {
          fromEl.classList.remove('active');
          toEl.classList.remove('active');
        }

          , animationSpeed);
      }

      function startAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        packetCount = 0;
        document.getElementById('packets-sent').textContent = '0';

        let step = 0;
        let throughput = 0;

        // Simulate throughput metrics
        throughputInterval = setInterval(() => {
          throughput = Math.floor(Math.random() * 5000) + 15000;
          document.getElementById('throughput').textContent = throughput.toLocaleString();
        }

          , 500);

        function runSequence() {
          if (step < flowSequence.length && isAnimating) {
            animateStep(step);
            step++;
            setTimeout(runSequence, animationSpeed);
          }

          else if (isAnimating) {
            // Loop the animation
            step = 0;
            setTimeout(runSequence, animationSpeed * 2);
          }
        }

        runSequence();
      }

      function resetAnimation() {
        isAnimating = false;
        clearInterval(throughputInterval);

        document.querySelectorAll('.service-card').forEach(card => {
          card.classList.remove('active');
        });

        document.querySelectorAll('.phase').forEach(p => {
          p.classList.remove('active');
        });

        document.querySelectorAll('.data-particle').forEach(p => {
          p.remove();
        });

        document.getElementById('throughput').textContent = '0';
        document.getElementById('packets-sent').textContent = '0';
        document.getElementById('active-phase').textContent = 'Idle';
        packetCount = 0;
      }

      function toggleSpeed() {
        if (animationSpeed === 1000) {
          animationSpeed = 500;
          document.getElementById('speed-label').textContent = 'Fast';
        }

        else if (animationSpeed === 500) {
          animationSpeed = 250;
          document.getElementById('speed-label').textContent = 'Ultra';
        }

        else {
          animationSpeed = 1000;
          document.getElementById('speed-label').textContent = 'Normal';
        }
      }

      // Auto-start animation after page load
      setTimeout(() => {
        startAnimation();
      }

        , 1500);

      // Add keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();

          if (isAnimating) {
            resetAnimation();
          }

          else {
            startAnimation();
          }
        }

        else if (e.code === 'KeyR') {
          resetAnimation();
        }

        else if (e.code === 'KeyS') {
          toggleSpeed();
        }
      });

      // Responsive particle creation for better performance on mobile
      let lastParticleTime = 0;
      const originalCreateDataParticle = createDataParticle;

      createDataParticle = function (fromEl, toEl) {
        const now = Date.now();

        if (now - lastParticleTime > 100) {
          // Throttle particle creation
          lastParticleTime = now;
          originalCreateDataParticle(fromEl, toEl);
        }
      }