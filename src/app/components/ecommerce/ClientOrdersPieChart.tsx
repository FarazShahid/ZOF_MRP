'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ClientOrder = {
  name: string;
  orders: number;
};

type Props = {
  data: ClientOrder[];
};

const ClientOrdersDonutChart: React.FC<Props> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const chartData = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        type: 'donut',
        events: {
          dataPointSelection: (_event, _chartContext, config) => {
            setActiveIndex(config.dataPointIndex);
          },
        },
      },
      labels: data.map((client) => client.name),
      tooltip: {
        y: {
          formatter: (_val: number, { seriesIndex }: any) => {
            const client = data[seriesIndex];
            return `${client.orders} orders`;
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: false,
              name: {
                show: true,
                fontSize: '16px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 600,
                offsetY: 10,
                formatter: () => `${data[activeIndex]?.orders}`,
              },
              total: {
                show: false,
              },
            },
          },
        },
      },
    };

    return {
      series: data.map((client) => client.orders),
      options,
    };
  }, [data, activeIndex]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={250}
      />
    </div>
  );
};

export default ClientOrdersDonutChart;
