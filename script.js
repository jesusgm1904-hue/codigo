// Animaciones al hacer scroll
const faders = document.querySelectorAll(".fade-in, .podcast, .info");

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
// Gráfica: Crecimiento e Impacto Ambiental
const ctx = document.getElementById('imaChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Estudiantes de Manufactura Avanzada',
        data: [100, 150, 230, 310, 420, 500],
        borderColor: '#00b0ff',
        backgroundColor: 'rgba(0,176,255,0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Eficiencia Ambiental (%)',
        data: [60, 65, 70, 76, 83, 90],
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0,255,136,0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#eaeaea' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' }
      },
      y: {
        ticks: { color: '#ccc' },
        grid: { color: '#333' }
      }
    }
  }
});
