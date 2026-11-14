// Translations for the title screen, cutscenes, settings, credits,
// planet-specific Dr. Farah chat introductions, and Moon cockpit task.

export const FLOW_TRANSLATIONS = {
  en: {
    title: {
      kicker: "Space Outpost Survival Adventure",
      heading: "BLAST OFF!",
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
        "Blast Off! is an educational 3D space survival game. Players launch from Earth, choose the Moon or Mars, and keep a science outpost alive by balancing Power, Oxygen, Shielding and Food. Every choice helps one thing and costs another!",
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
      beginBtn: "Begin Exploration",
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
          text: "Today we’re going to learn how to manage Lunar Outpost with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
          highlight: true,
        },
        {
          text: "Before we step outside to the Lunar Basecamp, let’s check the Rocket Power Control System first! 🚀",
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
          text: "Today we’re going to learn how to manage our Mars Outpost with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
          highlight: true,
        },
        {
          text: "Drive your rover to each glowing structure and press [E] to start a task. Ready, Commander? Let’s go! 🚀",
        },
      ],
    },
    cockpitTask: {
      badge: "Rocket Cockpit • Shackleton Crater",
      systemTitle: "POWER CONTROL SYSTEM",
      alertTitle: "POWER DROP ALERT !",
      nextBtn: "Next",
      choosePrompt:
        "The Sun dips below the crater rim! Temperatures plunge to -130°C, and our solar panels stop charging until sunrise.",
      optionATitle: "A · Balance Heaters & Life Support Equally",
      optionABadges: ["-15% Power", "-10% Oxygen", "-10% Shield"],
      chooseABtn: "CHOOSE A",
      optionBTitle: "B · Blast Full Heat & Cozy Up Early",
      optionBBadges: ["-30% Power", "-15% Food"],
      chooseBBtn: "CHOOSE B",
      exitToBaseBtn: "Exit Rocket to Lunar Basecamp",
      frames: {
        stable: "Here we are at the Power Control System! So far everything is stable.",
        sunsetAlert:
          "Oh no! Sunset is coming fast at Shackleton Crater, and our batteries are running dangerously low. Temperatures plunge to -130°C, and our solar panels stop charging until sunrise.",
        chillyPrompt:
          "Brrr! Talk about a chilly welcome! Our heaters need power to keep the base warm, while life support keeps air flowing. How should we manage tonight's battery reserve?",
        outcomeA:
          "Steady and smart! The base stayed cozy enough to sleep, and we saved plenty of battery power!",
        outcomeB:
          "Blasting the heaters drained a big chunk of our batteries. We'll need to recharge fast!",
      },
    },
  },

  ms: {
    title: {
      kicker: "Pengembaraan Hidup Pangkalan Angkasa",
      heading: "BLAST OFF!",
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
        "Blast Off! ialah permainan pendidikan 3D tentang hidup di angkasa. Pemain dilancarkan dari Bumi, memilih Bulan atau Marikh, dan menjaga pangkalan sains dengan mengimbangi Tenaga, Oksigen, Perisai dan Makanan. Setiap pilihan membantu satu perkara dan mengorbankan yang lain!",
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
      beginBtn: "Mula Penerokaan",
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
          text: "Hari ini kita akan belajar mengurus Pangkalan Bulan dengan sumber yang perlu kita imbangi. Inilah rahsia besar angkasa: setiap pilihan membantu satu perkara dan mengorbankan yang lain. Tiada pilihan percuma!",
          highlight: true,
        },
        {
          text: "Sebelum kita keluar ke Kem Pangkalan Bulan, mari periksa Sistem Kawalan Kuasa Roket dahulu! 🚀",
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
          text: "Hari ini kita akan belajar mengurus Pangkalan Marikh dengan sumber yang perlu kita imbangi. Inilah rahsia besar angkasa: setiap pilihan membantu satu perkara dan mengorbankan yang lain. Tiada pilihan percuma!",
          highlight: true,
        },
        {
          text: "Pandu rover anda ke setiap struktur yang bercahaya dan tekan [E] untuk memulakan tugasan. Sedia, Komander? Jom! 🚀",
        },
      ],
    },
    cockpitTask: {
      badge: "Kokpit Roket • Kawah Shackleton",
      systemTitle: "SISTEM KAWALAN KUASA",
      alertTitle: "AMARAN PENURUNAN KUASA !",
      nextBtn: "Seterusnya",
      choosePrompt:
        "Matahari terbenam di balik bibir kawah! Suhu menjunam ke -130°C, dan panel suria kita berhenti mengecas sehingga matahari terbit.",
      optionATitle: "A · Imbangkan Pemanas & Sokongan Hayat Sama Rata",
      optionABadges: ["-15% Tenaga", "-10% Oksigen", "-10% Perisai"],
      chooseABtn: "PILIH A",
      optionBTitle: "B · Pasang Pemanas Penuh Lebih Awal",
      optionBBadges: ["-30% Tenaga", "-15% Makanan"],
      chooseBBtn: "PILIH B",
      exitToBaseBtn: "Keluar Roket ke Kem Pangkalan Bulan",
      frames: {
        stable: "Kita berada di Sistem Kawalan Kuasa! Setakat ini semuanya stabil.",
        sunsetAlert:
          "Alamak! Waktu senja tiba cepat di Kawah Shackleton, dan bateri kita semakin lemah. Suhu menjunam ke -130°C, dan panel suria berhenti mengecas sehingga subuh.",
        chillyPrompt:
          "Brrr! Sejuknya sambutan di sini! Pemanas kita perlukan kuasa untuk memanaskan pangkalan, manakala sokongan hayat memastikan udara mengalir. Bagaimana kita patut uruskan simpanan bateri malam ini?",
        outcomeA:
          "Stabil dan bijak! Pangkalan kekal selesa, dan kita berjaya menjimatkan banyak kuasa bateri!",
        outcomeB:
          "Memasang pemanas penuh menggunakan banyak kuasa bateri kita. Kita perlu mengecas semula dengan cepat di luar!",
      },
    },
  },
};
