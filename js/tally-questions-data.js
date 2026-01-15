/**
 * Tally Form Questions Data
 * 
 * Structure ready for Tally MCP create_form API call.
 * This data can be used to programmatically create forms.
 */

// ========================================
// DUFAN WORKSHEET FORM
// ========================================

const dufanQuestions = {
  title: "Worksheet Dufan - Kejar Sains",
  fields: [
    // INFO SISWA
    {
      name: "student_name",
      type: "text",
      title: "Nama Lengkap",
      required: true,
      placeholder: "Contoh: Ahmad Surya"
    },
    {
      name: "student_class", 
      type: "dropdown",
      title: "Kelas",
      required: true,
      options: ["7-A", "7-B", "7-C", "7-D", "7-E"]
    },
    
    // FISIKA
    {
      name: "physics_q1",
      type: "textarea",
      title: "Fisika Q1: Perhatikan wahana 'Kora-Kora' (roller coaster). Jelaskan prinsip kerja roller coaster berdasarkan hukum Newton dan konsep energi! Mengapa kereta roller coaster tidak memerlukan mesin untuk bergerak setelah mencapai puncak pertama?",
      required: true
    },
    {
      name: "physics_q2",
      type: "textarea", 
      title: "Fisika Q2: Jika tinggi bukit pertama roller coaster adalah 40 meter dan massa gerbong adalah 500 kg, hitunglah:\na) Energi potensial gravitasi di puncak bukit (g = 10 m/s²)\nb) Jika kereta bergerak dengan kecepatan 20 m/s di dasar bukit, berapakah kecepatannya di puncak bukit? (abaikan gesekan)",
      required: true
    },
    {
      name: "physics_q3",
      type: "textarea",
      title: "Fisika Q3: Pada wahana 'Arung Jeram', perahu yang bergerak dengan kecepatan 5 m/s tiba-tiba berhenti saat menabrak bebatuan. Jelaskan konsep inersia dan impuls yang terjadi pada situasi ini! Mengapa penumpang yang berdiri akan terpental ke depan?",
      required: true
    },
    
    // MATEMATIKA
    {
      name: "math_q1",
      type: "textarea",
      title: "Matematika Q1: Wahana 'Flying Eagle' berputar dengan membentuk lintasan berbentuk lingkaran berdiameter 20 meter.\na) Berapakah keliling lintasan tersebut?\nb) Jika wahana berputar 3 kali dalam 1 menit, berapakah kecepatan sudut (ω) dalam rad/s?",
      required: true
    },
    {
      name: "math_q2",
      type: "textarea",
      title: "Matematika Q2: Tiga wahana di Dufan memiliki tinggi berbeda:\n- Tornado: 30 meter\n- Halilintar: 25 meter\n- Kora-Kora: 45 meter\n\na) Urutkan tinggi wahana dari yang tertinggi ke terendah!\nb) Berapakah selisih tinggi antara Kora-Kora dan Halilintar?\nc) Berapakah rata-rata tinggi ketiga wahana tersebut?",
      required: true
    },
    
    // BAHASA INDONESIA
    {
      name: "indonesian_q1",
      type: "textarea",
      title: "Bahasa Indonesia Q1: Buatlah teks observasi tentang satu wahana favoritmu di Dufan! Pastikan berisi:\n- Identifikasi (nama wahana, lokasi)\n- Deskripsi (bentuk, warna, cara kerja)\n- Kesimpulan (pengalaman dan kesan)",
      required: true
    },
    {
      name: "indonesian_q2",
      type: "textarea",
      title: "Bahasa Indonesia Q2: Perhatikan kalimat berikut:\n\n'Wahana roller coaster terasa sangat mendebarkan karena kecepatan yang tinggi.'\n\nTentukan:\na) Kata sifat dalam kalimat tersebut\nb) Kata benda dalam kalimat tersebut\nc) Sinonim kata 'mendebarkan'",
      required: true
    },
    
    // IPS
    {
      name: "ips_q1",
      type: "textarea",
      title: "IPS Q1: Dufan merupakan theme park yang dikembangkan oleh PT Pembangunan Perumahan (PT PP). Jelaskan:\na) Apa peran sektor pariwisata bagi ekonomi Indonesia?\nb) Bagaimana pembangunan tempat wisata seperti Dufan dapat menciptakan lapangan kerja?\nc) Apa dampak positif dan negatif keberadaan Dufan bagi masyarakat sekitar?",
      required: true
    },
    {
      name: "ips_q2",
      type: "textarea",
      title: "IPS Q2: Jika kamu manajer Dufan, strategi apa yang akan kamu terapkan untuk menarik lebih banyak wisatawan domestik dan mancanegara? Jelaskan 3 strategi!",
      required: true
    },
    
    // BAHASA INGGRIS
    {
      name: "english_q1",
      type: "textarea",
      title: "Bahasa Inggris Q1: Complete the following sentences with the correct words:\n\na) The roller coaster moves very _______ (fast/fastly)\nb) Dufan is one of the most _______ theme parks in Indonesia (popular)\nc) We _______ (have/had/has) a great time at Dufan yesterday\nd) The ride was so exciting that I wanted to ride it _______ (again/again)",
      required: true
    },
    {
      name: "english_q2",
      type: "textarea",
      title: "Bahasa Inggris Q2: Write a short paragraph (at least 5 sentences) about your experience at Dufan! Use past tense and descriptive words.",
      required: true
    },
    
    // PJOK
    {
      name: "pjok_q1",
      type: "textarea",
      title: "PJOK Q1: Saat bermain di Dufan, aktivitas fisik apa saja yang kamu lakukan? Jelaskan bagaimana aktivitas tersebut berkontribusi terhadap kesehatan:\na) Kesehatan jasmani (tubuh)\nb) Kesehatan mental (pikiran)\nc) Kesehatan sosial (berinteraksi dengan teman)",
      required: true
    },
    {
      name: "pjok_q2",
      type: "textarea",
      title: "PJOK Q2: Sebelum memasuki wahana yang menantang, biasanya pengunjung diberikan safety briefing. Mengapa penting untuk:\na) Menggunakan sabuk pengaman dengan benar?\nb) Mematuhi peraturan tinggi dan berat badan yang ditentukan?\nc) Mengikuti instruksi petugas dengan seksama?",
      required: true
    }
  ]
};

// ========================================
// MUSEUM BI WORKSHEET FORM
// ========================================

const museumBIQuestions = {
  title: "Worksheet Museum BI - Kejar Sains",
  fields: [
    // INFO SISWA
    {
      name: "student_name",
      type: "text",
      title: "Nama Lengkap",
      required: true,
      placeholder: "Contoh: Ahmad Surya"
    },
    {
      name: "student_class",
      type: "dropdown",
      title: "Kelas",
      required: true,
      options: ["7-A", "7-B", "7-C", "7-D", "7-E"]
    },
    
    // MATEMATIKA
    {
      name: "math_q1",
      type: "textarea",
      title: "Matematika Q1: Pada display di museum, terdapat informasi tentang inflasi Indonesia selama 10 tahun terakhir. Jika tahun 2014 indeks harga konsumen adalah 125 dan tahun 2024 menjadi 155, berapakah persentase kenaikan inflasi selama periode tersebut? (Tuliskan cara pengerjaan dan jawaban)",
      required: true
    },
    {
      name: "math_q2",
      type: "textarea",
      title: "Matematika Q2: Museum BI memiliki koleksi 7.000 mata uang dari berbagai negara. Jika 40% adalah mata uang Asia, 25% dari Eropa, 20% dari Amerika, dan sisanya dari Afrika dan Australia. Hitunglah jumlah mata uang dari setiap benua!",
      required: true
    },
    
    // BAHASA INDONESIA
    {
      name: "indonesian_q1",
      type: "textarea",
      title: "Bahasa Indonesia Q1: Buatlah paragraf persuasi yang mengajak teman-temanmu untuk mengunjungi Museum Bank Indonesia! Sertakan kata-kata ajakan dan alasan yang menarik!",
      required: true
    },
    {
      name: "indonesian_q2",
      type: "textarea",
      title: "Bahasa Indonesia Q2: Perhatikan teks di bawah ini:\n\n'Bank Indonesia sebagai Bank Sentral Republik Indonesia memiliki tugas strategis dalam menjaga stabilitas sistem keuangan.'\n\nBerdasarkan teks tersebut, apakah makna kata 'strategis'? Jelaskan dengan kata-katamu sendiri!",
      required: true
    },
    
    // IPS
    {
      name: "ips_q1",
      type: "textarea",
      title: "IPS Q1: Jelaskan bagaimana peran Bank Indonesia dalam sistem ekonomi Indonesia! Minimum 3 paragraf!",
      required: true
    },
    {
      name: "ips_q2",
      type: "textarea",
      title: "IPS Q2: Apa yang kamu ketahui tentang sejarah uang di Indonesia? Jelaskan perkembangan uang dari masa ke masa yang kamu pelajari di museum!",
      required: true
    },
    
    // BAHASA INGGRIS
    {
      name: "english_q1",
      type: "textarea",
      title: "Bahasa Inggris Q1: Translate the following sentence into English:\n\n'Bank Indonesia is the central bank of Indonesia.'",
      required: true
    },
    {
      name: "english_q2",
      type: "textarea",
      title: "Bahasa Inggris Q2: Write 5 sentences describing what you learned at Bank Indonesia Museum! (Use simple English)",
      required: true
    },
    
    // PKN
    {
      name: "pkn_q1",
      type: "textarea",
      title: "PKN Q1: Sebagai warga negara Indonesia yang baik, apa tanggung jawabmu terhadap penguatan ekonomi nasional? Jelaskan 3 tanggung jawab yang bisa kamu lakukan!",
      required: true
    },
    {
      name: "pkn_q2",
      type: "textarea",
      title: "PKN Q2: Apa hubungan antara Bank Indonesia dengan kedaulatan ekonomi negara? Berikan pendapatmu!",
      required: true
    },
    
    // SENI BUDAYA
    {
      name: "art_q1",
      type: "textarea",
      title: "Seni Budaya Q1: Dari berbagai uang Rupiah yang ditampilkan di museum, uang Rupiah edition mana yang menurutmu memiliki desain paling bagus? Jelaskan mengapa desain tersebut menarik bagimu dari segi seni!",
      required: true
    },
    {
      name: "art_q2",
      type: "textarea",
      title: "Seni Budaya Q2: Gambarkan/sketsa salah satu motif batik yang terdapat pada uang Rupiah di ruang kosong di bawah ini! (Jika tidak bisa menggambar, jelaskan motif batik yang kamu pilih)",
      required: true
    }
  ]
};

// ========================================
// EXPORT FOR MCP TOOLS
// ========================================

const tallyFormsData = {
  dufan: dufanQuestions,
  museumBI: museumBIQuestions,
  
  // Helper to convert to Tally API format
  toTallyAPISchema: function(worksheetType) {
    const form = worksheetType === 'dufan' ? dufanQuestions : museumBIQuestions;
    
    return {
      title: form.title,
      fields: form.fields.map(field => ({
        type: field.type === 'dropdown' ? 'multiple_choice' : 
              field.type === 'textarea' ? 'long_text' : 'short_text',
        title: field.title,
        required: field.required,
        properties: {
          description: field.placeholder || '',
          choices: field.options ? field.options.map(opt => ({ label: opt })) : undefined
        }
      }))
    };
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = tallyFormsData;
}
