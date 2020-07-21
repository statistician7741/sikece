const DashboardOutlined = require('@ant-design/icons').DashboardOutlined
const CheckSquareOutlined = require('@ant-design/icons').CheckSquareOutlined
const TableOutlined = require('@ant-design/icons').TableOutlined
const EditOutlined = require('@ant-design/icons').EditOutlined
const SafetyOutlined = require('@ant-design/icons').SafetyOutlined
const UsergroupAddOutlined = require('@ant-design/icons').UsergroupAddOutlined
const BookOutlined = require('@ant-design/icons').BookOutlined
const LogoutOutlined = require('@ant-design/icons').LogoutOutlined

module.exports = {
    kab: 'Kabupaten Buton',
    alamat: 'Jl. Protokol Kel. Saragi Kec. Pasarwajo Kab. Buton; e-Mail: bps7401@bps.go.id',
    menu: [
        { key: "/sikece/monitoring", icon: DashboardOutlined, name: "Monitoring", user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data'] },
        { key: "/sikece/tabel_final", icon: CheckSquareOutlined, name: "Tabel Final", user_type: ['ka_bps', 'admin', 'supervisor'] },
        { key: "/sikece/master_tabel", icon: TableOutlined, name: "Master Tabel", user_type: ['admin', 'editor'] },
        { key: "/sikece/entri_data", icon: EditOutlined, name: "Entri Data", user_type: ['pengentri'] },
        { key: "/sikece/persetujuan", icon: SafetyOutlined, name: "Persetujuan Data", user_type: ['peny_data'] },
        { key: "/sikece/master_pengguna", icon: UsergroupAddOutlined, name: "Master Pengguna", user_type: ['admin'] },
        { key: "/sikece/buku_panduan", icon: BookOutlined, name: "Buku Panduan", user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data', undefined], comp: false },
        { key: "logout", name: "Keluar", icon: LogoutOutlined, user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data', undefined], comp: false }
    ],
    jenisPengguna: {
        peny_data: 'PENYEDIA DATA',
        ka_bps: 'KEPALA BPS',
        editor: 'EDITOR',
        pengentri: 'OPERATOR ENTRI',
        supervisor: 'SUPERVISOR',
        admin: 'ADMIN KABUPATEN'
    }
}