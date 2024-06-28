import { EChartsOption } from 'echarts';
import { DataZoomComponentOption } from "echarts/types/dist/echarts";

export const updateCharts = (
	dates: string[],
	data: number[][],
  startZoom?: number,
): EChartsOption => {
  let dataZoom;

  if (startZoom != null) {
    dataZoom = [
      {
        start: startZoom
      }
    ]
  }

  return ({
    dataZoom,
    xAxis: {
      data: dates,
    },
    series: [
      {
        data,
      },
    ],
  });
}

export const configureCharts = (
	dates: string[],
	data: number[][],
  dataZoom: DataZoomComponentOption = { start: 40 },
): EChartsOption => ({
	tooltip: { show: true },
	xAxis: {
		type: 'category',
		data: dates,
	},
	yAxis: {
		scale: true,
		splitLine: { show: false },
	},
	dataZoom: [
    {
      ...dataZoom,
      brushSelect: false,
    },
    {
      type: 'inside',
    }
  ],
	animation: false,
	series: [
		{
			type: 'candlestick',
			name: 'Day',
			data,
			itemStyle: {
				color: '#0CF49B',
				color0: '#FD1050',
				borderColor: '#0CF49B',
				borderColor0: '#FD1050',
			},
		},
	],
});
