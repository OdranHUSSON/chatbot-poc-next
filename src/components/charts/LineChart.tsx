import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface ChartProps {
  dataJSON: string;
}

class LineChart extends React.Component<ChartProps> {
  static options = {
    responsive: true,
  };

  // Default colors for datasets
  static defaultBorderColors = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(54, 162, 235, 1)'
    // ... add more as needed
  ];

  static defaultBackgroundColors = [
    'rgba(75, 192, 192, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(54, 162, 235, 0.2)'
    // ... add more as needed
  ];

  render() {
    try {
      const data: ChartData = JSON.parse(this.props.dataJSON);

      if (!data.datasets) {
        throw new Error("Invalid data format");
      }

      for (let i = 0; i < data.datasets.length; i++) {
        let dataset = data.datasets[i];

        if (!Array.isArray(dataset.data)) {
          throw new Error("Invalid dataset format");
        }

        // Assign default colors if they are not set
        dataset.borderColor = dataset.borderColor || LineChart.defaultBorderColors[i % LineChart.defaultBorderColors.length];
        dataset.backgroundColor = dataset.backgroundColor || LineChart.defaultBackgroundColors[i % LineChart.defaultBackgroundColors.length];
      }

      return <Line maxwidth={"100%"} options={LineChart.options} data={data} />;
    } catch (error) {
      console.error("Error parsing or validating chart data:", error);
      return <div>Unusable data</div>;
    }
  }
}

export default LineChart;
