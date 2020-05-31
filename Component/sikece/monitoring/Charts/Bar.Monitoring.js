import { ResponsiveBar } from '@nivo/bar'

const MyResponsiveBar = ({ data, onClickKab }) => (
    <ResponsiveBar
        data={data}
        groupMode="stacked"
        keys={['Disetujui', 'Belum Disetujui']}
        minValue={0}
        maxValue={100}
        indexBy="region"
        margin={{ top: 25, right: 10, bottom: 50, left: 25 }}
        padding={0.6}
        colors={({ id }) => {
            // let hue = (((record.value / 100)) * 120).toString(10);
            return ["hsl(", id === 'Belum Disetujui' ? "10" : "100", ",65%,50%)"].join("")
        }}
        label={({ value }) => (`${value}%`)}
        colorBy="index"
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: data.length < 5 ? 0 : -20,
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -30,
                itemWidth: 120,
                itemHeight: 20,
                itemsSpacing: 0,
                symbolSize: 10,
                itemDirection: 'left-to-right'
            }
        ]}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        onClick={(datum) => {
            onClickKab()
            console.log(datum);
        }}
    />
)

export default MyResponsiveBar