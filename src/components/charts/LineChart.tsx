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
  borderColor: string;
  backgroundColor: string;
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

  render() {
    try {
      const data: ChartData = JSON.parse(this.props.dataJSON);
      console.log(this.props.dataJSON)

      // Ensure data format is valid
      if (!data.datasets) {
        throw new Error("Invalid data format");
      }

      for (let dataset of data.datasets) {
        if (!dataset.label || !Array.isArray(dataset.data) || !dataset.borderColor || !dataset.backgroundColor) {
          throw new Error("Invalid dataset format");
        }
      }

      return <Line maxwidth={"100%"} options={LineChart.options} data={data} />;
    } catch (error) {
      console.error("Error parsing or validating chart data:", error);
      return <div>Unusable data</div>;
    }
  }
}

export default LineChart;
