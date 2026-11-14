// Translations for the title screen, cutscenes, settings, credits and
// planet-specific Dr. Farah chat introductions. Merged on top of TRANSLATIONS.

export const FLOW_TRANSLATIONS = {
  en: {
    title: {
      kicker: "A 6-Day Space Outpost Adventure",
      heading: "INTERSTELLAR V",
      subheading: "Lunar & Mars Outpost Mission",
      startBtn: "Start Mission",
      settingsBtn: "Settings",
      creditsBtn: "Credits",
      footer: "Inspired by real NASA science • Made for young explorers",
    },
    select: {
      backBtn: "Back",
    },
    settingsExtra: {
      audioSection: "Audio",
      volumeLabel: "Master Volume",
      cameraSection: "Camera",
      sensitivityLabel: "Camera Sensitivity",
      sensitivityLow: "Slow",
      sensitivityHigh: "Fast",
      graphicsSection: "Graphics",
      graphicsLabel: "Shadows & Quality",
      graphicsHigh: "High",
      graphicsLow: "Low (Faster)",
    },
    credits: {
      title: "Credits",
      projectLabel: "Project",
      overviewLabel: "Mission Overview",
      overview:
        "Interstellar V is an educational 3D space survival game. Players launch from Earth, choose the Moon or Mars, and keep a science outpost alive for 6 days by balancing Power, Oxygen, Shielding and Food. Every choice helps one thing and costs another!",
      teamLabel: "Development Team",
      scienceLabel: "Science & Data Inspiration",
      science:
        "NASA Artemis, Perseverance (MOXIE & MEDA), DONKI Space Weather and the Open Science Data Repository (OSDR).",
      techLabel: "Built With",
      tech: "React, Three.js (@react-three/fiber & drei), Tailwind CSS, Vite and the Web Audio API.",
    },
    launch: {
      liftoff: "LIFTOFF!",
      ignition: "Main engine ignition...",
      ascending: "Climbing through the atmosphere!",
      enRoute: { lunar: "En route to the Moon 🌕", mars: "En route to Mars 🔴" },
      skip: "Skip",
    },
    returnScene: {
      boarding: "Mission complete! Boarding the return capsule...",
      liftoff: "Liftoff! Leaving the outpost behind.",
      cruising: "Heading home to Earth 🌍",
      skip: "Skip",
    },
    introChat: {
      role: "Mission Scientist",
      location: {
        lunar: "Shackleton Crater • Lunar South Pole",
        mars: "Jezero Crater • Mars",
      },
      nextBtn: "Next",
      beginBtn: "Begin Day 1 Exploration",
      typing: "Dr. Farah is typing...",
      secretLabel: "Big Space Secret",
      lunar: [
        {
          text: "Welcome to Shackleton Crater, Commander! I’m Dr. Farah, your Mission Scientist. We just landed at the Moon’s South Pole! 🌕",
        },
        {
          text: "The Moon has no air blanket, so temperatures swing wildly — about +120°C in sunlight and below -170°C in shadow. Our heaters will need lots of energy!",
        },
        {
          text: "Down here the Sun hangs low on the horizon, so every bit of solar power counts. And there’s no air to breathe — we’ll pull oxygen out of moon soil called regolith.",
        },
        {
          text: "Today we’re going to learn how to manage Lunar Outpost in 6 days with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
          highlight: true,
        },
        {
          text: "Drive your rover to each glowing structure and press [E] to start a task. Ready, Commander? Let’s go! 🚀",
        },
      ],
      mars: [
        {
          text: "Welcome to Jezero Crater, Commander! I’m Dr. Farah. Billions of years ago, this crater was a lake on Mars! 🔴",
        },
        {
          text: "Mars air is super thin and about 95% carbon dioxide (CO₂). Our MOXIE machine turns CO₂ into oxygen we can breathe — but it needs lots of power.",
        },
        {
          text: "Watch out for dust storms that cover our solar panels! And Martian soil has salts called perchlorates, so we must wash it before growing food.",
        },
        {
          text: "Today we’re going to learn how to manage our Mars Outpost in 6 days with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
          highlight: true,
        },
        {
          text: "Drive your rover to each glowing structure and press [E] to start a task. Ready, Commander? Let’s go! 🚀",
        },
      ],
    },
  },

  ms: {
    title: {
      kicker: "Pengembaraan Pangkalan Angkasa 6 Hari",
      heading: "INTERSTELLAR V",
      subheading: "Misi Pangkalan Bulan & Marikh",
      startBtn: "Mula Misi",
      settingsBtn: "Tetapan",
      creditsBtn: "Kredit",
      footer: "Diinspirasikan oleh sains NASA sebenar • Untuk penjelajah muda",
    },
    select: {
      backBtn: "Kembali",
    },
    settingsExtra: {
      audioSection: "Audio",
      volumeLabel: "Kelantangan Utama",
      cameraSection: "Kamera",
      sensitivityLabel: "Kepekaan Kamera",
      sensitivityLow: "Perlahan",
      sensitivityHigh: "Laju",
      graphicsSection: "Grafik",
      graphicsLabel: "Bayang & Kualiti",
      graphicsHigh: "Tinggi",
      graphicsLow: "Rendah (Lebih Laju)",
    },
    credits: {
      title: "Kredit",
      projectLabel: "Projek",
      overviewLabel: "Gambaran Misi",
      overview:
        "Interstellar V ialah permainan pendidikan 3D tentang hidup di angkasa. Pemain dilancarkan dari Bumi, memilih Bulan atau Marikh, dan menjaga pangkalan sains selama 6 hari dengan mengimbangi Tenaga, Oksigen, Perisai dan Makanan. Setiap pilihan membantu satu perkara dan mengorbankan yang lain!",
      teamLabel: "Pasukan Pembangun",
      scienceLabel: "Inspirasi Sains & Data",
      science:
        "NASA Artemis, Perseverance (MOXIE & MEDA), Cuaca Angkasa DONKI dan Repositori Data Sains Terbuka (OSDR).",
      techLabel: "Dibina Dengan",
      tech: "React, Three.js (@react-three/fiber & drei), Tailwind CSS, Vite dan Web Audio API.",
    },
    launch: {
      liftoff: "BERLEPAS!",
      ignition: "Enjin utama dihidupkan...",
      ascending: "Mendaki menembusi atmosfera!",
      enRoute: { lunar: "Dalam perjalanan ke Bulan 🌕", mars: "Dalam perjalanan ke Marikh 🔴" },
      skip: "Langkau",
    },
    returnScene: {
      boarding: "Misi selesai! Menaiki kapsul pulang...",
      liftoff: "Berlepas! Meninggalkan pangkalan.",
      cruising: "Pulang ke Bumi 🌍",
      skip: "Langkau",
    },
    introChat: {
      role: "Saintis Misi",
      location: {
        lunar: "Kawah Shackleton • Kutub Selatan Bulan",
        mars: "Kawah Jezero • Marikh",
      },
      nextBtn: "Seterusnya",
      beginBtn: "Mula Penerokaan Hari 1",
      typing: "Dr. Farah sedang menaip...",
      secretLabel: "Rahsia Besar Angkasa",
      lunar: [
        {
          text: "Selamat datang ke Kawah Shackleton, Komander! Saya Dr. Farah, Saintis Misi anda. Kita baru mendarat di Kutub Selatan Bulan! 🌕",
        },
        {
          text: "Bulan tiada selimut udara, jadi suhunya berubah mendadak — kira-kira +120°C di bawah cahaya matahari dan bawah -170°C dalam bayang. Pemanas kita perlukan banyak tenaga!",
        },
        {
          text: "Di sini Matahari berada rendah di ufuk, jadi setiap sedikit tenaga suria sangat berharga. Tiada udara untuk bernafas — kita akan ekstrak oksigen daripada tanah bulan yang dipanggil regolit.",
        },
        {
          text: "Hari ini kita akan belajar mengurus Pangkalan Bulan selama 6 hari dengan sumber yang perlu kita imbangi. Inilah rahsia besar angkasa: setiap pilihan membantu satu perkara dan mengorbankan yang lain. Tiada pilihan percuma!",
          highlight: true,
        },
        {
          text: "Pandu rover anda ke setiap struktur yang bercahaya dan tekan [E] untuk memulakan tugasan. Sedia, Komander? Jom! 🚀",
        },
      ],
      mars: [
        {
          text: "Selamat datang ke Kawah Jezero, Komander! Saya Dr. Farah. Berbilion tahun dahulu, kawah ini ialah sebuah tasik di Marikh! 🔴",
        },
        {
          text: "Udara Marikh sangat nipis dan kira-kira 95% karbon dioksida (CO₂). Mesin MOXIE kita menukar CO₂ kepada oksigen — tetapi ia perlukan banyak tenaga.",
        },
        {
          text: "Hati-hati dengan ribut debu yang menutup panel suria kita! Tanah Marikh juga ada garam perklorat, jadi kita mesti mencucinya sebelum menanam makanan.",
        },
        {
          text: "Hari ini kita akan belajar mengurus Pangkalan Marikh selama 6 hari dengan sumber yang perlu kita imbangi. Inilah rahsia besar angkasa: setiap pilihan membantu satu perkara dan mengorbankan yang lain. Tiada pilihan percuma!",
          highlight: true,
        },
        {
          text: "Pandu rover anda ke setiap struktur yang bercahaya dan tekan [E] untuk memulakan tugasan. Sedia, Komander? Jom! 🚀",
        },
      ],
    },
  },
};
