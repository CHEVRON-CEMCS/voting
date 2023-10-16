import React, { useEffect, useState } from 'react';
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import axios from 'axios';

import { useAuth } from '@/services/AuthContext';

function ChartComponent() {
  const [chartData, setChartData] = useState([]);

  const { user } = useAuth();

  const userToken = user?.token;
  const userEmail = user?.email;

  useEffect(() => {
    // Replace with your actual API request using Axios
    axios.get('https://virtual.chevroncemcs.com/voting/votes', {
      params: {
        email: userEmail,
      },
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
    .then(response => {
      console.log('API Response:', response.data); // Log the API response
      const data = response.data;
      if (data.error === false) {
        // Extract data from the API response dynamically
        const counts = data.data[0].counts;

        // Filter the data to include positions with count > 0
        const filteredData = counts.filter(item => item.count > 0);

        // Create the chart data
        const chartData = filteredData.map(item => ({
          name: item.positionName,
          "Empno": item.empno,
          "Count": item.count,
        }));

        setChartData(chartData);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [userToken, userEmail]);

  const valueFormatter = (number) => new Intl.NumberFormat("us").format(number).toString();

  return (
    <div className='mt-10 max-w-6xl mx-auto'>
      <Card>
        <Title>Positions with Empno and Count </Title>
        <Subtitle>Displaying empno and count for positions where count is greater than 0.</Subtitle>
        <BarChart
          className="mt-6"
          data={chartData}
          index="name"
          categories={["Empno", "Count"]}
          colors={["green", "blue"]}
          valueFormatter={valueFormatter}
          yAxisWidth={48}
        />
      </Card>
    </div>
  );
}

export default ChartComponent;
