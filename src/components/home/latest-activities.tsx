
import { UnorderedListOutlined } from '@ant-design/icons'
import { Card, List, Space } from 'antd'
import React from 'react'
import { Text } from '../text'
import LatestActivitiesSkeleton from '../skeleton/latest-activities'
import { useList } from '@refinedev/core'
import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from '@/graphql/queries'
import dayjs from 'dayjs'
import CustomAvatar from '../custom-avatar'

const LatestActivities = () => {

    const { data: audit, isLoading: isLoadingAudit, isError, error } = useList({
        resource: "audits",
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
        }
    })

    // console.log(audit)

    const dealIds = audit?.data?.map((audit) => audit?.targetId)

    const { data: deals, isLoading: isLoadingDeals } = useList({
        resource: "deals",
        queryOptions: { enabled: !!dealIds?.length },
        pagination: {
            mode: "off"
        },
        filters: [{
            field: "id",
            operator: "in",
            value: dealIds
        }],
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
        }
    })

    if(isError) {
        console.log(error)
        return null
    }

    const isLoading = isLoadingAudit || isLoadingDeals;

  return (
    <Card
        headStyle={{ padding: "16px" }}
        bodyStyle={{ padding: "0 1rem" }}
        title={(
            <div style={{ display: "flex", alignItems: "center", gap: "8px"}}>
                <UnorderedListOutlined />
                <Text size="sm" style={{ marginLeft: "0.5rem" }}>
                    Latest Activities
                </Text>
            </div>
        )}
    >
        {isLoading ? (
            <List 
                itemLayout="horizontal"
                dataSource={Array.from({ length: 5 })
                    .map((_, i) => ({ id: i }))}
                renderItem={(_, index) => (
                    <LatestActivitiesSkeleton key={index} />
                )}
            />
        ) : (
            <List 
                itemLayout="horizontal"
                dataSource={audit?.data}
                renderItem={(item) => {
                    const deal = deals?.data.find(
                        (deal) => deal.id === String(item.targetId)
                        ) || undefined;

                        console.log(item);
                        console.log(deal);

                    return(
                        <List.Item style={{ display: item?.user?.avatarUrl && item?.user?.name ? "block" : "none" }}>
                            {item?.user?.avatarUrl && item?.user?.name ? (
                                    <List.Item.Meta 
                                        title={
                                            <Space size={4}>
                                            <Text strong>{item?.user?.name}</Text>
                                            <Text>
                                                {item?.action === "CREATE" ? "initiated the deal" : "moved the deal"}
                                            </Text>
                                            <Text strong>{deal?.title}</Text>
                                            <Text>
                                                {item?.action === "CREATE" ? "in" : "to"}
                                            </Text>
                                            <Text>
                                                {deal?.stage?.title}
                                            </Text>
                                        </Space>
                                        }
                                        avatar={
                                            <CustomAvatar 
                                                shape="circle"
                                                size={48}
                                                src={item?.user?.avatarUrl}
                                                name={item?.user?.name}
                                            />
                                        }
                                        description={
                                            dayjs(deal?.createdAt).format("MMM DD, YYYY - HH:mm:ss")
                                        }
                                    />
                                ) : null
                            }
                        </List.Item>
                    )
                }}
            />
        )}
    </Card>
  )
}

export default LatestActivities 