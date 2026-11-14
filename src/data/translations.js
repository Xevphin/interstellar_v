export const TRANSLATIONS = {
  en: {
    gameTitle: "Jezero 6: Mission Mars",
    heroTagline: "6-Sol Outpost Survival Adventure",
    choosePlanet: "Choose Your Landing Site",
    marsTitle: "Mars: Jezero Crater",
    marsSubtitle: "6-Sol Outpost Survival Demo",
    marsCTA: "Launch Mission",
    moonTitle: "Moon: Shackleton Crater",
    moonSubtitle: "Coming Soon",
    settings: "Settings",
    language: "Language",
    soundLabel: "Space Audio & Effects",
    soundOn: "On",
    soundOff: "Off",
    close: "Close",
    nasaDataBtn: "NASA Science & Data",
    solLabel: "Sol",
    ofSix: "of 6",
    resources: {
      power: "Power",
      oxygen: "Oxygen",
      shielding: "Shielding",
      food: "Food",
    },
    roverMode: "Rover Mode",
    roverHint: "WASD / Arrows or D-Pad to drive • Drag to look",
    resetCam: "Reset View",
    clickModuleHint: "Tip: Click any base module to inspect it!",
    modules: {
      habitat: "Habitat Dome & Shield",
      solar: "Solar Array Field",
      moxie: "MOXIE Air-Maker",
      greenhouse: "Hydroponic Greenhouse",
    },
    intro: {
      title: "Welcome to Jezero Crater, Cadet!",
      capLine:
        "Beep-boop! I'm Cap, your rover buddy! Jezero Crater is an ancient dry lakebed on Mars. One Martian day is called a Sol—let's keep our base alive for 6 Sols!",
      startBtn: "Start Sol 1",
    },
    sols: {
      1: {
        title: "Sol 1: The MOXIE Air-Maker",
        context:
          "Mars air is 95% carbon dioxide! NASA's MOXIE machine turns it into breathable oxygen, but uses lots of battery power.",
        capTip: "Running MOXIE makes fresh air, but watch our yellow Power bar!",
        choiceA: "Run MOXIE Full Blast",
        choiceB: "Save Power & Use Backup Air",
      },
      2: {
        title: "Sol 2: Cleaning Martian Soil (Perchlorates)",
        context:
          "Martian dirt has natural salts called perchlorates that hurt plants unless we wash the soil and heat the greenhouse.",
        capTip:
          "Space potatoes need clean soil! Heating the greenhouse uses extra Shield energy.",
        choiceA: "Wash Soil & Heat Greenhouse",
        choiceB: "Keep Shields Max & Ration Snacks",
      },
      3: {
        title: "Sol 3: NASA DONKI Solar Storm + 14-Min Delay",
        context:
          "NASA's DONKI space weather tracker spots a solar storm! Radio messages from Earth take 14 minutes to reach Mars—you must decide fast!",
        capTip:
          "Whoa, solar storm alert! Earth can't reply in time—trust your Cadet instincts!",
        choiceA: "Boost Storm Shields Now",
        choiceB: "Keep Air Scrubbers Full Speed",
      },
      4: {
        title: "Sol 4: Red Dust Devil on Solar Panels",
        context:
          "A Martian dust devil covered our solar panels in red dust, slowing down battery charging.",
        capTip:
          "Brushing the panels outside takes oxygen and snack energy, but charges our base!",
        choiceA: "Brush Off Solar Panels",
        choiceB: "Stay Inside on Low Power",
      },
      5: {
        title: "Sol 5: NASA OSDR Green Algae Test",
        context:
          "Mission Control asks us to test growing green algae from NASA's OSDR space-biology lab to make extra oxygen in Mars gravity.",
        capTip:
          "Science time! Green algae can give us a big oxygen boost before the final night.",
        choiceA: "Run NASA Algae Test",
        choiceB: "Skip Test & Save Supplies",
      },
      6: {
        title: "Sol 6: Freezing -85°C Martian Night",
        context:
          "NASA's MEDA weather station reads -85°C outside! Survive until the relief rocket lands at sunrise!",
        capTip:
          "Final Sol, Cadet! Keep the heaters steady until the sunrise rescue rocket arrives!",
        choiceA: "Balance Heaters, Air & Shields",
        choiceB: "Blast Full Heaters Early",
      },
    },
    lose: {
      title: "Mission Paused — Outpost Needs Help!",
      retryBtn: "Try Again from Sol 1",
      tips: {
        power:
          "Our Power hit 0%! On Mars, solar panels and heaters share the same batteries. Try balancing power-hungry machines like MOXIE!",
        oxygen:
          "Our Oxygen hit 0%! Mars air is mostly carbon dioxide, so astronauts rely on machines like MOXIE and algae experiments to breathe.",
        shielding:
          "Our Shielding hit 0%! Radiation and solar storms on Mars are fierce—keeping strong shields protects the whole crew!",
        food:
          "Our Food hit 0%! Growing space crops in clean, washed soil keeps astronauts energized for hard work outside.",
      },
    },
    victory: {
      bannerTitle: "Sunrise Rescue! You Survived All 6 Sols!",
      capLine:
        "Woohoo! The relief rocket landed! Ready for your 4-question Cadet Debrief Quiz to earn your Mars Certificate?",
      goToQuiz: "Start Debrief Quiz",
    },
    quiz: {
      title: "Cadet Debrief Quiz",
      subtitle: "Answer 4 quick questions to unlock your official Mars Certificate!",
      questionLabel: "Question",
      nextBtn: "Next Question",
      finishBtn: "Claim Cadet Certificate",
      questions: [
        {
          q: "Why did we have to make tough choices between Power, Oxygen, Shields, and Food?",
          options: [
            "Mars bases have limited energy, so boosting one system uses up another!",
            "Robots on Mars like to turn lights off for fun.",
            "Mars has unlimited free electricity in the air.",
          ],
          correct: 0,
          feedbackCorrect:
            "Spot on! Every Mars outpost has a strict energy budget—smart trade-offs keep everyone safe!",
          feedbackWrong:
            "Not quite! On Mars, energy is limited—using more power for one system means less for another.",
        },
        {
          q: "What does NASA's real MOXIE machine make from Mars's carbon dioxide (CO₂) air?",
          options: [
            "Liquid rocket fuel",
            "Breathable Oxygen",
            "Space ice cream",
          ],
          correct: 1,
          feedbackCorrect:
            "Awesome! MOXIE on NASA's Perseverance rover really turns Martian CO₂ into breathable oxygen!",
          feedbackWrong:
            "Good guess, but MOXIE actually turns Mars's carbon dioxide air into breathable oxygen!",
        },
        {
          q: "Why couldn't Earth Mission Control make the Sol 3 Solar Storm choice for us?",
          options: [
            "They were asleep on Earth.",
            "Radio signals take about 14 minutes to travel between Earth and Mars!",
            "Mars blocks all radio waves forever.",
          ],
          correct: 1,
          feedbackCorrect:
            "You got it! Because Mars is so far away, radio messages take ~14 minutes each way!",
          feedbackWrong:
            "Close! Mars is millions of kilometers away, so radio messages take about 14 minutes to arrive!",
        },
        {
          q: "Why do astronauts need to wash Martian soil before growing space potatoes?",
          options: [
            "To remove natural salts called perchlorates that hurt plants",
            "To make the dirt look prettier",
            "Because Martian dirt is too wet",
          ],
          correct: 0,
          feedbackCorrect:
            "Brilliant! Washing out perchlorate salts makes Martian soil safe for growing healthy crops!",
          feedbackWrong:
            "Almost! Martian soil has natural salts called perchlorates that we must wash out first.",
        },
      ],
    },
    certificate: {
      heading: "Official Mars Cadet Certificate",
      presentedTo: "Proudly Awarded To",
      namePlaceholder: "Enter Cadet Name...",
      defaultName: "Space Cadet",
      completedLine:
        "For successfully surviving 6 Sols at Jezero Crater, Mars!",
      finalStats: "Final Outpost Status",
      badgeLabel: "Specialty Rank",
      badges: {
        power: "Master Power Engineer",
        oxygen: "Chief Oxygen Specialist",
        shielding: "Shield Commander",
        food: "Space Botanist",
      },
      printBtn: "Print / Save PDF",
      downloadBtn: "Download PNG",
      playAgainBtn: "Play Again",
    },
    nasaModal: {
      title: "NASA Science & Data",
      intro:
        "Jezero 6: Mission Mars is inspired by real NASA Mars missions and open science datasets curated for young explorers:",
      items: [
        {
          name: "NASA Perseverance Rover (MOXIE & MEDA)",
          desc: "MOXIE demonstrated making oxygen from Martian CO₂, while MEDA measures Mars weather, dust, and freezing temperatures.",
        },
        {
          name: "NASA DONKI Space Weather Database",
          desc: "Tracks solar flares and space storms so astronauts know when to boost radiation shielding.",
        },
        {
          name: "NASA Open Science Data Repository (OSDR)",
          desc: "Shares real space-biology experiments—like growing algae and plants in space—with scientists and students worldwide.",
        },
      ],
    },
  },

  ms: {
    gameTitle: "Jezero 6: Misi Marikh",
    heroTagline: "Pengembaraan Hidup 6-Sol di Marikh",
    choosePlanet: "Pilih Tapak Pendaratan Anda",
    marsTitle: "Marikh: Kawah Jezero",
    marsSubtitle: "Demo Hidup Pangkalan 6-Sol",
    marsCTA: "Mulakan Misi",
    moonTitle: "Bulan: Kawah Shackleton",
    moonSubtitle: "Akan Datang",
    settings: "Tetapan",
    language: "Bahasa",
    soundLabel: "Audio Angkasa & Kesan Bunyi",
    soundOn: "Hidup",
    soundOff: "Mati",
    close: "Tutup",
    nasaDataBtn: "Sains & Data NASA",
    solLabel: "Sol",
    ofSix: "drp 6",
    resources: {
      power: "Tenaga",
      oxygen: "Oksigen",
      shielding: "Perisai",
      food: "Makanan",
    },
    roverMode: "Mod Rover",
    roverHint: "WASD / Anak panah atau D-Pad untuk pandu • Seret untuk lihat",
    resetCam: "Set Semula Kamera",
    clickModuleHint: "Tip: Klik mana-mana modul pangkalan untuk periksa!",
    modules: {
      habitat: "Kubah Habitat & Perisai",
      solar: "Medan Panel Suria",
      moxie: "Penjana Udara MOXIE",
      greenhouse: "Rumah Hijau Hidroponik",
    },
    intro: {
      title: "Selamat Datang ke Kawah Jezero, Kadet!",
      capLine:
        "Bip-bop! Saya Cap, rakan rover anda! Kawah Jezero ialah tasik purba yang kering di Marikh. Satu hari di Marikh dipanggil Sol—mari kekalkan pangkalan kita selama 6 Sol!",
      startBtn: "Mula Sol 1",
    },
    sols: {
      1: {
        title: "Sol 1: Penjana Udara MOXIE",
        context:
          "Udara Marikh mengandungi 95% karbon dioksida! Mesin MOXIE NASA menukarkannya kepada oksigen, tetapi guna banyak kuasa bateri.",
        capTip:
          "Menjalankan MOXIE menghasilkan udara segar, tapi perhatikan bar Tenaga kuning kita!",
        choiceA: "Jalankan MOXIE Sepenuh Kuasa",
        choiceB: "Jimat Tenaga & Guna Udara Simpanan",
      },
      2: {
        title: "Sol 2: Cuci Tanah Marikh (Perklorat)",
        context:
          "Tanah Marikh ada garam semula jadi bernama perklorat yang merosakkan tumbuhan kecuali kita mencucinya dan memanaskan rumah hijau.",
        capTip:
          "Kentang angkasa perlukan tanah bersih! Pemanas rumah hijau guna tenaga Perisai.",
        choiceA: "Cuci Tanah & Panaskan Rumah Hijau",
        choiceB: "Kekalkan Perisai & Catuan Snek",
      },
      3: {
        title: "Sol 3: Ribut Suria DONKI NASA + Kelewatan 14 Minit",
        context:
          "Penjejak cuaca angkasa DONKI NASA mengesan ribut suria! Mesej radio dari Bumi ambil masa 14 minit ke Marikh—anda mesti pilih cepat!",
        capTip:
          "Awas, amaran ribut suria! Bumi tak sempat balas—ikut gerak hati Kadet anda!",
        choiceA: "Tingkatkan Perisai Ribut Sekarang",
        choiceB: "Kekalkan Penapis Udara Laju Penuh",
      },
      4: {
        title: "Sol 4: Puting Beliung Debu di Panel Suria",
        context:
          "Puting beliung debu Marikh menyaluti panel suria kita dengan debu merah, melambatkan pengecasan bateri.",
        capTip:
          "Membersih panel di luar guna oksigen dan tenaga makanan, tapi cas semula pangkalan kita!",
        choiceA: "Bersihkan Debu Panel Suria",
        choiceB: "Duduk di Dalam Dengan Kuasa Rendah",
      },
      5: {
        title: "Sol 5: Ujian Alga Hijau OSDR NASA",
        context:
          "Pusat Kawalan meminta kita menguji penanaman alga hijau dari makmal bio-angkasa OSDR NASA untuk hasilkan oksigen tambahan.",
        capTip:
          "Masa sains! Alga hijau boleh beri lonjakan oksigen sebelum malam terakhir.",
        choiceA: "Jalankan Ujian Alga NASA",
        choiceB: "Langkau Ujian & Simpan Bekalan",
      },
      6: {
        title: "Sol 6: Malam Marikh Sejuk Beku -85°C",
        context:
          "Stesen cuaca MEDA NASA mencatat -85°C di luar! Bertahan sehingga roket penyelamat mendarat waktu matahari terbit!",
        capTip:
          "Sol terakhir, Kadet! Imbangkan pemanas sehingga roket penyelamat tiba!",
        choiceA: "Imbangkan Pemanas, Udara & Perisai",
        choiceB: "Pasang Pemanas Penuh Awal",
      },
    },
    lose: {
      title: "Misi Dijeda — Pangkalan Perlukan Bantuan!",
      retryBtn: "Cuba Lagi dari Sol 1",
      tips: {
        power:
          "Tenaga kita mencecah 0%! Di Marikh, panel suria dan pemanas berkongsi bateri yang sama. Cuba imbangkan mesin kuat tenaga seperti MOXIE!",
        oxygen:
          "Oksigen kita mencecah 0%! Udara Marikh kebanyakannya karbon dioksida, jadi angkasawan bergantung pada mesin seperti MOXIE dan alga untuk bernafas.",
        shielding:
          "Perisai kita mencecah 0%! Radiasi dan ribut suria di Marikh sangat kuat—perisai kukuh melindungi seluruh kru!",
        food:
          "Makanan kita mencecah 0%! Menanam tanaman angkasa dalam tanah bersih memberi tenaga kepada angkasawan untuk kerja luar.",
      },
    },
    victory: {
      bannerTitle: "Penyelamat Subuh! Anda Berjaya Harungi 6 Sol!",
      capLine:
        "Hore! Roket penyelamat telah mendarat! Bersedia untuk Kuiz Kadet 4 soalan bagi mendapatkan Sijil Marikh anda?",
      goToQuiz: "Mula Kuiz Kadet",
    },
    quiz: {
      title: "Kuiz Tamat Misi Kadet",
      subtitle:
        "Jawab 4 soalan ringkas untuk membuka Sijil Rasmi Marikh anda!",
      questionLabel: "Soalan",
      nextBtn: "Soalan Seterusnya",
      finishBtn: "Tuntut Sijil Kadet",
      questions: [
        {
          q: "Mengapa kita perlu membuat pilihan sukar antara Tenaga, Oksigen, Perisai, dan Makanan?",
          options: [
            "Pangkalan Marikh ada tenaga terhad, jadi menguatkan satu sistem guna sumber lain!",
            "Robot di Marikh suka tutup lampu untuk berseronok.",
            "Marikh ada elektrik percuma tanpa had di udara.",
          ],
          correct: 0,
          feedbackCorrect:
            "Tepat sekali! Setiap pangkalan Marikh ada bajet tenaga terhad—pilihan bijak menjaga keselamatan semua!",
          feedbackWrong:
            "Hampir tepat! Di Marikh, tenaga terhad—guna lebih kuasa untuk satu sistem bermakna kurang untuk sistem lain.",
        },
        {
          q: "Apakah yang dihasilkan oleh mesin MOXIE sebenar NASA daripada udara karbon dioksida (CO₂) Marikh?",
          options: [
            "Bahan api roket cecair",
            "Oksigen untuk bernafas",
            "Aiskrim angkasa",
          ],
          correct: 1,
          feedbackCorrect:
            "Hebat! MOXIE pada rover Perseverance NASA benar-benar menukar CO₂ Marikh kepada oksigen!",
          feedbackWrong:
            "Cuba lagi! MOXIE sebenarnya menukar udara karbon dioksida Marikh kepada oksigen untuk bernafas.",
        },
        {
          q: "Mengapa Pusat Kawalan Bumi tidak dapat membuat keputusan Ribut Suria Sol 3 untuk kita?",
          options: [
            "Mereka sedang tidur di Bumi.",
            "Isyarat radio ambil masa kira-kira 14 minit antara Bumi dan Marikh!",
            "Marikh menyekat semua gelombang radio selamanya.",
          ],
          correct: 1,
          feedbackCorrect:
            "Betul! Kerana Marikh sangat jauh, mesej radio ambil masa ~14 minit sehala!",
          feedbackWrong:
            "Hampir! Marikh berjuta-juta kilometer jauhnya, jadi mesej radio ambil masa ~14 minit untuk sampai!",
        },
        {
          q: "Mengapa angkasawan perlu mencuci tanah Marikh sebelum menanam kentang angkasa?",
          options: [
            "Untuk membuang garam semula jadi bernama perklorat yang merosakkan tumbuhan",
            "Untuk menjadikan tanah kelihatan lebih cantik",
            "Kerana tanah Marikh terlalu basah",
          ],
          correct: 0,
          feedbackCorrect:
            "Cemerlang! Mencuci garam perklorat menjadikan tanah Marikh selamat untuk tanaman sihat!",
          feedbackWrong:
            "Sikit lagi! Tanah Marikh ada garam semula jadi bernama perklorat yang mesti dicuci dahulu.",
        },
      ],
    },
    certificate: {
      heading: "Sijil Rasmi Kadet Marikh",
      presentedTo: "Dengan Bangganya Dianugerahkan Kepada",
      namePlaceholder: "Masukkan Nama Kadet...",
      defaultName: "Kadet Angkasa",
      completedLine:
        "Kerana berjaya mengharungi 6 Sol di Kawah Jezero, Marikh!",
      finalStats: "Status Akhir Pangkalan",
      badgeLabel: "Pangkat Kepakaran",
      badges: {
        power: "Jurutera Kuasa Utama",
        oxygen: "Pakar Oksigen Utama",
        shielding: "Komander Perisai",
        food: "Ahli Botani Angkasa",
      },
      printBtn: "Cetak / Simpan PDF",
      downloadBtn: "Muat Turun PNG",
      playAgainBtn: "Main Semula",
    },
    nasaModal: {
      title: "Sains & Data NASA",
      intro:
        "Jezero 6: Misi Marikh diinspirasikan oleh misi Marikh NASA sebenar dan set data sains terbuka untuk penjelajah muda:",
      items: [
        {
          name: "Rover Perseverance NASA (MOXIE & MEDA)",
          desc: "MOXIE membuktikan penghasilan oksigen daripada CO₂ Marikh, manakala MEDA mengukur cuaca, debu, dan suhu beku Marikh.",
        },
        {
          name: "Pangkalan Data Cuaca Angkasa DONKI NASA",
          desc: "Menjejak suar suria dan ribut angkasa supaya angkasawan tahu bila perlu menguatkan perisai radiasi.",
        },
        {
          name: "Repositori Data Sains Terbuka NASA (OSDR)",
          desc: "Berkongsi eksperimen bio-angkasa sebenar—seperti menanam alga dan tumbuhan di angkasa—bersama saintis dan pelajar seluruh dunia.",
        },
      ],
    },
  },
};
