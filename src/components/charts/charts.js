import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';

Chart.defaults.global.maintainAspectRatio = false;

export const LineChart = ({ inputs }) => {
  const [chartRef] = useState(React.createRef());
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    const myOptions = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: inputs.xTitle,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: inputs.yTitle,
            },
            ticks: {
              beginAtZero: true,
            }
          },
        ],
      },
      title: {
        display: (inputs.title !== undefined ? true : false),
        text: inputs.title,
        fontSize: 16,
      },
      tooltips: {
        enabled: true,
        mode: inputs.ttMode,
        intersect: inputs.ttIntersect,
        position: inputs.ttPosition,
        callbacks: {
          title: function(tooltipItems, data) {
            if(inputs.ttTitle) {
              return inputs.ttTitle[tooltipItems[0].index];
            }
            return data.labels[tooltipItems[0].index];
          },
          afterTitle: function(tooltipItems, data) {
            if(inputs.ttAfterTitle) {
              return inputs.ttAfterTitle[tooltipItems[0].index];
            }
            return null;
          },
          beforeBody: function(tooltipItems, data) {
            if(inputs.ttBeforeBody) {
              return inputs.ttBeforeBody[tooltipItems[0].index];
            }
            return null;
          },
        }
      },
      annotation: inputs.annotation,
    }

    if(!myChart) {
      setMyChart(new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: inputs.labels,
          datasets: inputs.datasets,
        },
        options: myOptions,
      }));
    } else {
      myChart.data.labels = inputs.labels;
      myChart.data.datasets = inputs.datasets;
      myChart.options = myOptions;
      myChart.update();
    }
  }, [inputs]);

  return <canvas ref={chartRef} />;
}

export const BarChart = ({ inputs }) => {
  const [chartRef, setChartRef] = useState(React.createRef());
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    const myOptions = {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: inputs.xTitle,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: inputs.yTitle,
            },
            ticks: {
              beginAtZero: true,
              max: inputs.maxY,
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItems, data) {
            if(inputs.tooltipTitles) {
              return inputs.tooltipTitles[tooltipItems[0].index];
            }
            return data.labels[tooltipItems[0].index];
          }
        }
      },
      title: {
        display: true,
        text: inputs.title,
        fontSize: 16,
      }
    };

    if(!myChart) {
      setMyChart(new Chart(chartRef.current, 
        {
          type: 'bar',
          data: {
            labels: inputs.labels,
            datasets: inputs.datasets,
          },
          options: myOptions,
        }
      ));
    } else {
      myChart.data.labels = inputs.labels;
      myChart.data.datasets = inputs.datasets;
      myChart.options = myOptions;
      myChart.update();
    }
  }, [inputs]);

  return (
    <canvas ref={chartRef} />
  );
}