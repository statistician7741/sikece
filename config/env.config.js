module.exports = {
    kab: 'Kabupaten Buton',
    alamat: 'Jl. Protokol Kel. Saragi Kec. Pasarwajo Kab. Buton; e-Mail: bps7401@bps.go.id',
    menu: [
        { key: "/sikece/monitoring", name: "Monitoring", user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data'] },
        { key: "/sikece/master_tabel", name: "Master Tabel", user_type: ['admin', 'editor'] },
        { key: "/sikece/entri_data", name: "Entri Data", user_type: ['admin', 'pengentri'] },
        { key: "/sikece/persetujuan", name: "Persetujuan Data", user_type: ['admin', 'peny_data'] },
        { key: "/sikece/master_pengguna", name: "Master Pengguna", user_type: ['admin'] },
        { key: "/sikece/buku_panduan", name: "Buku Panduan", user_type: ['ka_bps', 'admin', 'supervisor', 'editor', 'pengentri', 'peny_data', undefined] }
    ]
}