function calculateStdDev(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }
  
  function generateSChart() {
    const rawData = document.getElementById("dataInput").value.trim().split("\n");
    const stdDevs = [];
    const labels = [];
  
    rawData.forEach((line, index) => {
      const values = line.split(",").map(Number).filter(n => !isNaN(n));
      if (values.length > 1) {
        stdDevs.push(calculateStdDev(values));  
        labels.push(`Sample ${index + 1}`);
      }
    });
  
    // Calculate CL, UCL, LCL
    const avgS = stdDevs.reduce((a, b) => a + b, 0) / stdDevs.length;
    const UCL = avgS + 3 * avgS;
    const LCL = Math.max(0, avgS - 3 * avgS);
  
    // Save data in localStorage
    localStorage.setItem('sChartData', document.getElementById("dataInput").value);
  
    const ctx = document.getElementById("sChartCanvas").getContext("2d");
    if (window.sChartInstance) {
      window.sChartInstance.destroy();
    }
  
    window.sChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Standard Deviation (S)',
            data: stdDevs,
            borderColor: 'blue',
            fill: false,
            tension: 0.2
          },
          {
            label: 'UCL',
            data: new Array(stdDevs.length).fill(UCL),
            borderColor: 'red',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          },
          {
            label: 'LCL',
            data: new Array(stdDevs.length).fill(LCL),
            borderColor: 'green',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          },
          {
            label: 'CL (Average S)',
            data: new Array(stdDevs.length).fill(avgS),
            borderColor: 'orange',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'S Chart with Control Limits'
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Standard Deviation'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Sample Number'
            }
          }
        }
      }
    });
  }
  
  function downloadChart() {
    const link = document.createElement('a');
    link.download = 's_chart.png';
    link.href = document.getElementById('sChartCanvas').toDataURL('image/png');
    link.click();
  }
  
  // Load saved data on page load
  window.onload = function () {
    const saved = localStorage.getItem('sChartData');
    if (saved) {
      document.getElementById('dataInput').value = saved;
    }
  };
  