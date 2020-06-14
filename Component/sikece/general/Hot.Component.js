import dynamic from 'next/dynamic';

const HotTable = dynamic(() => import('@handsontable/react'), {
    ssr: false
})
import 'handsontable/dist/handsontable.full.css';

export default class Hot extends React.Component {
    render() {
        const { nestedHeaders, data, columns, noSpare, beforeChange, beforeRemoveRow, beforeOnCellMouseDown } = this.props
        return (
            <HotTable
                settings={{
                    licenseKey: 'non-commercial-and-evaluation',
                    data
                }}
                height="auto"
                colHeaders={true}
                nestedHeaders={nestedHeaders}
                minSpareRows={noSpare ? 0 : 1}
                columns={columns}
                contextMenu={['remove_row', '---------', 'undo', 'redo', '---------', 'copy', 'cut']}
                beforeChange={beforeChange}
                beforeRemoveRow={beforeRemoveRow}
                beforeOnCellMouseDown={beforeOnCellMouseDown}
            />
        )
    }
}