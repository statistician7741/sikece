import dynamic from 'next/dynamic';
import { Row, Table } from 'antd';
import { connect } from 'react-redux';

const LihatTabel = dynamic(() => import("./TabelComponent/LihatTabel.Tabel.Component"));
const EditorTabel = dynamic(() => import("./TabelComponent/EditorTabel.Tabel.Component"));

class TabelComponent extends React.Component {
    state = {
    }

    loadDataKec = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `[060] Kec 1`,
                    value: 'kec1',
                },
                {
                    label: `[050] Kec 2`,
                    value: 'kec2',
                },
                {
                    label: `[051] Kec 3`,
                    value: 'kec3',
                },
            ];
            this.setState({
                kecData: [...this.state.kecData],
            });
        }, 1000);
    };

    loadDataIndikators = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `Luas Wilayah menurut Desa/Kelurahan`,
                    value: 'kec1',
                },
                {
                    label: `Jumlah penduduk menurut desa/kelurahan`,
                    value: 'kec2',
                },
            ];
            this.setState({
                indikators: [...this.state.indikators],
            });
        }, 1000);
    };

    cascaderFilter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    render() {
        const { babs, kecData, indikators, tables } = this.props
        return (
            <Row gutter={[20, 0]}>
                <LihatTabel xs={24} md={12} bab babs={babs} tables={tables} kecData={kecData} loadDataKec={this.loadDataKec} />
                <EditorTabel xs={24} md={12} kecData={kecData} loadDataKec={this.loadDataKec} indikators={indikators} loadDataIndikators={this.loadDataIndikators} cascaderFilter={this.cascaderFilter} />
            </Row>
        )
    }
}

function mapStateToProps(state) {
    const { tables, indikators, babs, kecData } = state.master
    return { tables, indikators, babs, kecData }
}

export default connect(mapStateToProps)(TabelComponent)