import { Col, Collapse, Row, Progress, Select, Typography, Button } from 'antd'
import moment from 'moment';

import dynamic from 'next/dynamic';

const HotTable = dynamic(() => import('@handsontable/react'), {
    ssr: false
})
// import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

export default class Penilaian extends React.Component {
    state = {
        activeKey: undefined,
        nestedHeaders1: [
            ['Kelurahan/Desa',
                'Pos Kamling',
                'Linmas',
                'Kamra',
                'Anggota BPD/LPM'],
            ['(1)', '(2)', '(3)', '(4)', '(5)']
        ],
        nestedHeaders: [
            ['Kelurahan/Desa',
            { label: 'SMP', colspan: 2 },
            'Madrasah Tsanawiyah',
            'Jumlah'],
            ['','Negeri', 'Swasta','',''],
            ['(1)', '(2)', '(3)', '(4)', '(5)']
        ],
        data: [
            ["Induha", 5, 10, 0, 13],
            ["Ulunggolaka", 1, 15, 0, '...'],
            ["Mangolo", 0, 10, 1, 13],
            ["Kolakaasih", 0, 0, 0, 15],
            ["Sea", 0, 0, 0, 21],
            ["Latambaga", 0, 10, 0, 12],
            ["Sakuli", 1, 5, 0, 13]
        ]
    }

    render() {
        const { nestedHeaders, data } = this.state
        return (
            <React.Fragment>
                <div>
                    <HotTable
                        settings={{
                            licenseKey: 'non-commercial-and-evaluation'
                        }}
                        data={data}
                        colHeaders={true}
                        nestedHeaders={nestedHeaders} />
                </div>
            </React.Fragment>
        )
    }
}