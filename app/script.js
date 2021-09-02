var ctx = document.getElementById("myChart").getContext("2d");
const data = {
  labels: ["today", "03", "04", "05"],
  datasets: [
    {
      data: [65, 59, 60, 70],
      fill: true,
      backgroundColor: "rgba(132, 172, 233, 0.418)",
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
var myChart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
        beginAtZero: false,
        stepSize: 2,
        grid: {
          display: false,
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  },
});
