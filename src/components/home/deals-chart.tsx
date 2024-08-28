import { BellOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Text } from '../text'
import { useList } from '@refinedev/core'
import { Area, AreaConfig } from '@ant-design/plots'
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries'
import { mapDealsData } from '@/utilities/helpers'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { DashboardDealsChartQuery } from '@/graphql/types'

const DealsChart = () => {

  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"]
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY
    }
  })

  console.log(data)

  const dealData = React.useMemo(() => {
    return mapDealsData(data?.data)
  }, [data?.data])

  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    isStack: false,
    seriesField: "state",
    animation: true,
    startOnZero: false,
    smooth: true,
    legend: {
      offsetY: -6
    },
    yAxis: {
      tickCount: 5,
      label: {
        formatter: (v: string) => {
          return `${Number(v) / 100}`
        }
      }
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: data.state,
          value: `${Number(data.value) / 100}`
        }
      }
    },
    line: {
      // color: "#f02d32"
    }
  }

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <BellOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Alerts
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  )
}

export default DealsChart