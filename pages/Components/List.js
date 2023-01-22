import { Table, ConfigProvider } from 'antd';
import { format } from 'date-fns'
import { useState } from 'react';

const columns = [
    {
        title: 'Pilot ID',
        dataIndex: 'pilot_id',
        key: 'pilot_id',
        sorter: (a, b) => a.pilot_id.localeCompare(b.pilot_id)
    },
    {
        title: 'Pilot Name',
        dataIndex: 'pilot_name',
        key: 'pilot_name',
        render: (text, record) => `${record.first_name} ${record.last_name}`,
        sorter: (a, b) => a.first_name.localeCompare(b.first_name)
    },
    {
        title: 'Email Address',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
    },
    {
        title: 'Distance',
        dataIndex: 'distance',
        key: 'distance',
        render: (text) => `${text}m`,
        sorter: (a, b) => a.distance - b.distance
    },
    {
        title: 'Last Seen',
        dataIndex: 'last_seen',
        key: 'last_seen',
        render: (text) => format(new Date(text), "HH:mm:ss"),
        sorter: (a, b) => new Date(a.last_seen) - new Date(b.last_seen)
    }
];

const expandedRowRender = (record) => {
    const nestedColumns = [
        {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            key: 'serial_number',
        },
        {
            title: 'Position X',
            dataIndex: 'position_x',
            key: 'position_x',
        },
        {
            title: 'Position Y',
            dataIndex: 'position_y',
            key: 'position_y',
        },
        {
            title: 'First Seen',
            dataIndex: 'first_seen',
            key: 'first_seen',
            render: (text) => format(new Date(text),"MM-DD-YYYY HH:mm:ss")
        },
    ];

    return <Table
        columns={nestedColumns}
        dataSource={[record]}
        pagination={false} />;
};


const List = ({ drones }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const handleExpand = (isExpanded, record) => {
        setExpandedRowKeys(isExpanded ? [record.key] : []);
    };
    const violationsWithKey = drones?.map((violation) => ({
        ...violation,
        key: violation.serial_number
    }));

    return (
        <div style={{ overflowX: 'auto', height: '60vh'}}>
            <ConfigProvider>
                <Table
                    columns={columns}
                    dataSource={violationsWithKey}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={handleExpand}
                    pagination={false}
                    expandedRowRender={expandedRowRender}
                    sortDirections={['ascend', 'descend']}
                    scroll={{ x: true }}
                />
            </ConfigProvider>           
        </div>
    );
};

export default List;