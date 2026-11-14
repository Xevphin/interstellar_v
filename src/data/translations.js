export const TRANSLATIONS = {
  en: {
    gameTitle: "Interstellar V: Lunar & Mars Outpost",
    heroTagline: "6-Day Outpost Resource & Rover Survival",
    choosePlanet: "Select Your 6-Day Outpost Mission",
    lunarTitle: "Moon: Shackleton Lunar Outpost",
    lunarSubtitle: "6-Day Lunar Outpost Survival Mission",
    lunarCTA: "Launch Lunar Outpost",
    marsTitle: "Mars: Jezero Crater Outpost",
    marsSubtitle: "6-Day Mars Crater Survival Variant",
    marsCTA: "Launch Mars Outpost",
    settings: "Settings",
    language: "Language",
    soundLabel: "Space Audio & Effects",
    soundOn: "On",
    soundOff: "Off",
    close: "Close",
    nasaDataBtn: "NASA Science & Data",
    solLabel: "Day",
    ofSix: "of 6",
    tasksLabel: "Tasks",
    resources: {
      power: "Power",
      oxygen: "Oxygen",
      shielding: "Shielding",
      food: "Food",
    },
    roverMode: "Chase Cam",
    freeCamMode: "Orbit Cam",
    roverHint: "WASD / Arrows to drive • Press [E] near structures • Drag mouse to look",
    resetCam: "Reset View",
    nextTaskBtn: "Locate Next Task",
    finishMissionBtn: "Start Debrief Quiz",
    interactPrompt: "Press [E] to Interact",
    actionMenu: {
      title: "Outpost Structure Controls",
      subtitle: "Choose an action for this outpost module:",
      taskBtn: "Task",
      taskDesc: "Manage resources & make a key Day decision (30s timer)",
      taskDoneBadge: "Completed",
      factBtn: "Fact",
      factDesc: "Read Dr. Farah's space science fact about this structure",
      exitBtn: "Exit",
      exitDesc: "Return to driving your rover",
    },
    modules: {
      moxie: "Oxygen Extractor (MOXIE / Regolith O₂)",
      greenhouse: "Hydroponic Greenhouse Dome",
      comms: "DONKI Space Weather & Shield Array",
      solar: "Crater Peak Solar Array",
      algae: "OSDR Bio-Algae Oxygen Lab",
      habitat: "Central Habitat & MEDA Thermal Core",
    },
    intro: {
      badge: "Mission Scientist Briefing",
      title: "Welcome aboard, Commander! I’m Dr. Farah.",
      coreQuote:
        "Today we’re going to learn how to manage Lunar Outpost in 6 days with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
      howToPlayTitle: "How to Complete Your 6-Day Mission:",
      steps: [
        "Drive your rover using WASD / Arrow Keys (or the on-screen D-Pad) to all 6 Outpost Structures.",
        "When you get close to a structure, press [E] to open the Action Menu: Task, Fact, or Exit.",
        "Each Task gives you 30 seconds to weigh the trade-offs. Click my AI Helper button anytime for a hint!",
        "Complete all 6 structure Tasks to unlock the Super Rover Upgrade and the final Debrief Quiz!",
      ],
      startBtn: "Begin Day 1 Exploration",
    },
    aiHelper: {
      buttonLabel: "Ask Dr. Farah AI",
      title: "Dr. Farah AI Mission Advisor",
      defaultGreeting:
        "Unsure which option to pick? Remember: there is no free choice! Tap a prompt below and I'll help you analyze the trade-offs.",
      askHintBtn: "Ask for a Hint",
      explainTradeoffBtn: "Explain Trade-offs",
      checkLowestBtn: "Check My Lowest Stat",
      lowestStatAdvice: (statName, val) =>
        `Watch out! Your lowest resource right now is ${statName} (${val}%). Avoid choices that drain ${statName} too close to 0%!`,
    },
    timer: {
      label: "Decision Timer",
      timeoutNotice:
        "Time's up! Emergency auto-protocol activated (-10% Power & Oxygen). Keep an eye on the 30s clock!",
    },
    upgrade: {
      bannerTitle: "All 6 Tasks Complete — Hyper-Rover Upgrade Unlocked!",
      drFarahMsg:
        "Outstanding work, Commander! We've fitted your rover with golden plasma thrusters, a deep-space radar dish, and neon rim boosters. Enjoy your boosted top speed, or click 'Start Debrief Quiz' whenever you're ready!",
      dismissBtn: "Test Upgraded Rover",
      quizNowBtn: "Start Debrief Quiz Now",
    },
    sols: {
      1: {
        title: "Day 1 Task: Oxygen Extractor Unit",
        context:
          "Space has no breathable air! Our extractor pulls oxygen from lunar regolith and CO₂ (like NASA's MOXIE), but requires heavy battery power.",
        drFarahTip:
          "Fresh air keeps the crew sharp, but check how much yellow Power it costs!",
        hint:
          "Think about what our crew needs first: if Oxygen drops too low, astronauts can't work outside, but running full power drains our batteries early.",
        tradeoff:
          "Option A boosts Oxygen strongly (+▲) at the cost of Power (-▼). Option B saves Power (+▲) by using backup air tanks (-▼ Oxygen).",
        factTitle: "Science Fact: Making Air from Moon & Mars Dust!",
        factBody:
          "Lunar soil (regolith) is over 40% oxygen locked inside rock minerals! Meanwhile on Mars, NASA's MOXIE instrument splits carbon dioxide gas into breathable oxygen. Both need lots of electrical heat!",
        choiceA: "Run Oxygen Extractor Full Blast",
        choiceB: "Save Power & Use Backup Air",
      },
      2: {
        title: "Day 2 Task: Hydroponic Greenhouse Dome",
        context:
          "Space soil has harsh minerals (and perchlorate salts on Mars) that hurt crops unless we filter the water and heat the greenhouse.",
        drFarahTip:
          "Space potatoes give us vital Food, though diverting power from the dome reduces Shielding!",
        hint:
          "Look at your Green (Food) and Indigo (Shielding) gauges. Tomorrow brings a space weather storm—will your shields be ready?",
        tradeoff:
          "Option A boosts Food (+▲) by diverting power from Shielding (-▼). Option B strengthens Shielding (+▲) while rationing snacks (-▼ Food).",
        factTitle: "Science Fact: Space Farming & Hydroponics",
        factBody:
          "In NASA's Lunar & Mars greenhouses, plants grow under LED lamps using mineral-filtered water instead of raw dirt so astronauts get fresh vitamins and crisp greens!",
        choiceA: "Wash Soil & Heat Greenhouse",
        choiceB: "Keep Shields Max & Ration Snacks",
      },
      3: {
        title: "Day 3 Task: NASA DONKI Solar Storm Alert",
        context:
          "NASA's DONKI space weather tracker spots a solar storm incoming! Deep-space comms have a delay—you must decide how to protect the outpost right now!",
        drFarahTip:
          "Solar storms slam into weak shields! Check if your Shielding gauge can survive a big drop.",
        hint:
          "A solar storm hits Shielding the hardest. If your Shielding is under 50%, leaving shields unboosted is very risky!",
        tradeoff:
          "Option A raises Storm Shields (+▲) using Power (-▼) and Oxygen (-▼). Option B saves air (+▲ Oxygen) but takes a heavy hit to Shielding (-▼).",
        factTitle: "Science Fact: NASA DONKI Space Weather",
        factBody:
          "DONKI (Database Of Notifications, Knowledge, Information) tracks solar flares from the Sun so astronauts on the Moon and Mars can activate radiation shields in time!",
        choiceA: "Boost Storm Shields Now",
        choiceB: "Keep Air Scrubbers Full Speed",
      },
      4: {
        title: "Day 4 Task: Electrostatic Dust on Solar Panels",
        context:
          "Abrasive crater dust coated our solar array, cutting battery charging! Sending a crew outside to brush them off uses suit air and food energy.",
        drFarahTip:
          "Clean solar panels give a huge Power surge for the final two days!",
        hint:
          "Days 5 and 6 will need plenty of Power for labs and night heaters. Can your Oxygen and Food handle an outdoor cleaning walk?",
        tradeoff:
          "Option A cleans the panels for a big Power boost (+▲) at the cost of Oxygen (-▼) and Food (-▼). Option B stays inside (+▲ Food) but loses Power (-▼).",
        factTitle: "Science Fact: Clingy Crater Dust",
        factBody:
          "Lunar and Martian dust gets electrostatically charged by sunlight and sticks to solar panels and spacesuits like static-cling glitter!",
        choiceA: "Brush Off Solar Panels",
        choiceB: "Stay Inside on Low Power",
      },
      5: {
        title: "Day 5 Task: NASA OSDR Bio-Algae Lab",
        context:
          "Mission Control asks us to run a green algae bioreactor from NASA's OSDR space-biology lab to generate extra oxygen in low gravity.",
        drFarahTip:
          "Micro-algae are tiny oxygen factories! Check if we have enough Power and Food nutrients to run the lab.",
        hint:
          "If your Oxygen gauge is getting low, the algae bioreactor is a lifesaver. If Power or Food is critically low, saving supplies may be safer.",
        tradeoff:
          "Option A gives a big Oxygen boost (+▲) using Power (-▼) and Food (-▼). Option B saves Power (+▲) and Food (+▲) at a small Oxygen cost (-▼).",
        factTitle: "Science Fact: NASA OSDR Space Biology",
        factBody:
          "NASA's Open Science Data Repository (OSDR) studies how algae, plants, and microbes grow in microgravity—helping future habitats recycle air naturally!",
        choiceA: "Run NASA Algae Test",
        choiceB: "Skip Test & Save Supplies",
      },
      6: {
        title: "Day 6 Task: Freezing Crater Night (-85°C to -130°C)",
        context:
          "Sensors read freezing night temperatures outside the crater! Balance the thermal heaters until the relief lander touches down at sunrise!",
        drFarahTip:
          "Final day, Commander! Pick the option that keeps all four gauges above 0%!",
        hint:
          "This is the final test! Look closely at your four resource bars—pick the choice that won't push your lowest bar to 0%.",
        tradeoff:
          "Option A spreads the load evenly across Power (-▼), Oxygen (-▼), and Shielding (-▼). Option B drains more Power (-▼) and Food (-▼) while sparing Oxygen and Shields.",
        factTitle: "Science Fact: Extreme Crater Nights",
        factBody:
          "Without a thick blanket of air like Earth's atmosphere, crater temperatures plunge below -85°C on Mars and -130°C on the Moon as soon as the Sun sets!",
        choiceA: "Balance Heaters, Air & Shields",
        choiceB: "Blast Full Heaters Early",
      },
    },
    lose: {
      title: "Mission Paused — Outpost Resource Depleted!",
      retryBtn: "Try Again from Day 1",
      tips: {
        power:
          "Our Power hit 0%! Remember my big secret of space: every choice helps one thing and costs another. Next run, clean the solar panels on Day 4 or conserve battery power!",
        oxygen:
          "Our Oxygen hit 0%! Crew members need steady breathable air from the extractor and algae lab. Watch the cyan Oxygen gauge closely!",
        shielding:
          "Our Shielding hit 0%! Solar storms and cosmic radiation require strong shields. Boost shields during the DONKI storm alert!",
        food:
          "Our Food hit 0%! Astronauts burn lots of calories working outside. Keep the greenhouse growing so the crew stays fed!",
      },
    },
    quiz: {
      title: "Post-Mission Commander Debrief Quiz",
      subtitle:
        "Answer 4 rapid-fire questions (30s each) to calculate your final Commander Score!",
      questionLabel: "Question",
      nextBtn: "Next Question",
      finishBtn: "View Mission Leaderboard",
      timeoutFeedback: "Time expired! Moving to the next debrief question.",
      questions: [
        {
          q: "Why must space outpost commanders carefully balance Power, Oxygen, Shielding, and Food?",
          options: [
            "Every choice helps one system and costs another—there is no free choice",
            "Outpost computers randomly turn machines off for fun",
            "Space bases have unlimited free battery power",
            "Astronauts only need one resource to survive",
          ],
          correct: 0,
          feedbackCorrect:
            "Spot on! As Dr. Farah says, every choice helps one thing and costs another!",
          feedbackWrong:
            "Remember Dr. Farah's rule: in space, energy is limited—every choice helps one system and costs another!",
        },
        {
          q: "How do NASA systems like MOXIE and regolith extractors help astronauts breathe?",
          options: [
            "They teleport fresh air directly from Earth",
            "They extract breathable oxygen from local CO₂ gas or lunar soil using electrical power",
            "They freeze starlight into liquid air",
            "They grow oxygen without using any electricity",
          ],
          correct: 1,
          feedbackCorrect:
            "Correct! Making oxygen on the Moon or Mars uses local resources and lots of electrical power!",
          feedbackWrong:
            "Not quite! Extractors pull breathable oxygen from local CO₂ or lunar soil using electrical power.",
        },
        {
          q: "What does NASA's DONKI space weather system warn astronauts about?",
          options: [
            "Incoming solar storms so the crew can boost radiation shielding in time",
            "When space potatoes are ready to harvest",
            "How fast the rover wheels are spinning",
            "Rainstorms and ocean tides on Earth",
          ],
          correct: 0,
          feedbackCorrect:
            "Awesome! DONKI tracks solar storms so astronauts can protect the outpost with strong shields!",
          feedbackWrong:
            "DONKI tracks solar storms and flares from the Sun so crews can boost radiation shielding!",
        },
        {
          q: "Why did brushing crater dust off the solar panels cost Oxygen and Food?",
          options: [
            "Solar panels eat snacks to make electricity",
            "Working outside in a spacesuit uses breathable air and astronaut energy, but restores Power",
            "Dust turns into food when brushed off",
            "Brushing solar panels permanently turns off the sun",
          ],
          correct: 1,
          feedbackCorrect:
            "Brilliant! Spacewalks use suit oxygen and food calories in exchange for recharging outpost batteries!",
          feedbackWrong:
            "Working outside in a spacesuit costs oxygen and food energy, trading them for a big Power boost!",
        },
      ],
    },
    leaderboard: {
      title: "Lunar Outpost Commander Leaderboard",
      subtitle: "Compare your 6-Day Outpost performance against top Commanders!",
      totalScoreLabel: "Total Mission Score",
      breakdown: {
        resources: "Resource Balance",
        tasks: "Completed Tasks",
        quiz: "Quiz Accuracy",
        timeBonus: "Speed Bonus",
      },
      enterNameLabel: "Save Your Commander Callsign:",
      namePlaceholder: "e.g., Cmdr. Zara",
      saveBtn: "Save Score",
      savedBadge: "Saved to Leaderboard!",
      rankCol: "Rank",
      nameCol: "Commander",
      tasksCol: "Tasks",
      quizCol: "Quiz",
      scoreCol: "Score",
      certificateBtn: "View & Download Certificate",
      playAgainBtn: "Play Again",
    },
    certificate: {
      heading: "Official Space Outpost Commander Certificate",
      presentedTo: "Proudly Awarded To",
      namePlaceholder: "Enter Commander Name...",
      defaultName: "Space Commander",
      completedLine:
        "For mastering resource trade-offs across 6 Days at the Lunar & Mars Outpost!",
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
      backToLeaderboard: "Back to Leaderboard",
      playAgainBtn: "Play Again",
    },
    nasaModal: {
      title: "NASA Science & Data",
      intro:
        "This mission is inspired by real NASA space exploration systems and open science datasets curated for students:",
      items: [
        {
          name: "NASA Artemis Lunar Outpost & Perseverance (MOXIE / MEDA)",
          desc: "In-situ resource utilization (ISRU) extracts oxygen from lunar regolith and Martian CO₂ while thermal sensors track extreme crater nights.",
        },
        {
          name: "NASA DONKI Space Weather Database",
          desc: "Tracks solar flares and coronal mass ejections so crews can boost radiation shielding before storms hit.",
        },
        {
          name: "NASA Open Science Data Repository (OSDR)",
          desc: "Shares space-biology experiments—like growing microalgae and hydroponic crops—with students worldwide.",
        },
      ],
    },
  },

  ms: {
    gameTitle: "Interstellar V: Pangkalan Bulan & Marikh",
    heroTagline: "Kembara 6-Hari Pengurusan Sumber & Rover",
    choosePlanet: "Pilih Misi Pangkalan 6-Hari Anda",
    lunarTitle: "Bulan: Pangkalan Kawah Shackleton",
    lunarSubtitle: "Misi Hidup Pangkalan Bulan 6-Hari",
    lunarCTA: "Mulakan Misi Bulan",
    marsTitle: "Marikh: Pangkalan Kawah Jezero",
    marsSubtitle: "Variasi Misi Kawah Marikh 6-Hari",
    marsCTA: "Mulakan Misi Marikh",
    settings: "Tetapan",
    language: "Bahasa",
    soundLabel: "Audio Angkasa & Kesan Bunyi",
    soundOn: "Hidup",
    soundOff: "Mati",
    close: "Tutup",
    nasaDataBtn: "Sains & Data NASA",
    solLabel: "Hari",
    ofSix: "drp 6",
    tasksLabel: "Tugasan",
    resources: {
      power: "Tenaga",
      oxygen: "Oksigen",
      shielding: "Perisai",
      food: "Makanan",
    },
    roverMode: "Kamera Rover",
    freeCamMode: "Kamera Orbit",
    roverHint: "WASD / Anak Panah untuk pandu • Tekan [E] dekat struktur • Seret tetikus",
    resetCam: "Set Semula Kamera",
    nextTaskBtn: "Cari Tugasan Seterusnya",
    finishMissionBtn: "Mula Kuiz Debrief",
    interactPrompt: "Tekan [E] untuk Interaksi",
    actionMenu: {
      title: "Kawalan Struktur Pangkalan",
      subtitle: "Pilih tindakan untuk modul pangkalan ini:",
      taskBtn: "Task (Tugasan)",
      taskDesc: "Urus sumber & buat keputusan penting (masa 30s)",
      taskDoneBadge: "Selesai",
      factBtn: "Fact (Fakta)",
      factDesc: "Baca fakta sains angkasa Dr. Farah tentang struktur ini",
      exitBtn: "Exit (Keluar)",
      exitDesc: "Kembali memandu rover anda",
    },
    modules: {
      moxie: "Penjana Oksigen (MOXIE / Regolit O₂)",
      greenhouse: "Kubah Rumah Hijau Hidroponik",
      comms: "Stesen Cuaca Angkasa & Perisai DONKI",
      solar: "Medan Panel Suria Kawah",
      algae: "Makmal Bio-Alga Oksigen OSDR",
      habitat: "Kubah Habitat Utama & Teras Haba MEDA",
    },
    intro: {
      badge: "Taklimat Saintis Misi",
      title: "Selamat datang, Komander! Saya Dr. Farah.",
      coreQuote:
        "Today we’re going to learn how to manage Lunar Outpost in 6 days with the resources that we need to balance for. Here is the big secret of space: every choice helps one thing and costs another. There is no free choice!",
      howToPlayTitle: "Cara Menyelesaikan Misi 6-Hari Anda:",
      steps: [
        "Pandu rover anda guna kekunci WASD / Anak Panah (atau D-Pad skrin) ke semua 6 Struktur Pangkalan.",
        "Apabila dekat dengan struktur, tekan [E] untuk buka Menu Tindakan: Task, Fact, atau Exit.",
        "Setiap Task memberi masa 30 saat untuk membuat keputusan. Klik butang Pembantu AI saya untuk petunjuk!",
        "Selesaikan semua 6 Task struktur untuk membuka Naik Taraf Super Rover dan Kuiz Akhir!",
      ],
      startBtn: "Mula Penerokaan Hari 1",
    },
    aiHelper: {
      buttonLabel: "Tanya AI Dr. Farah",
      title: "Penasihat Misi AI Dr. Farah",
      defaultGreeting:
        "Tidak pasti mahu pilih yang mana? Ingat: tiada pilihan percuma! Tekan butang di bawah untuk analisis timbal-balik.",
      askHintBtn: "Minta Petunjuk (Hint)",
      explainTradeoffBtn: "Terangkan Kesan Pilihan",
      checkLowestBtn: "Semak Bar Terendah Saya",
      lowestStatAdvice: (statName, val) =>
        `Hati-hati! Sumber terendah anda sekarang ialah ${statName} (${val}%). Elakkan pilihan yang menurunkan ${statName} ke 0%!`,
    },
    timer: {
      label: "Masa Keputusan",
      timeoutNotice:
        "Masa tamat! Protokol kecemasan automatik diaktifkan (-10% Tenaga & Oksigen). Perhatikan jam 30s!",
    },
    upgrade: {
      bannerTitle: "Semua 6 Tugasan Selesai — Naik Taraf Hyper-Rover Dibuka!",
      drFarahMsg:
        "Syabas, Komander! Rover anda kini dilengkapi pendorong plasma emas, piring radar angkasa, dan rim bercahaya neon. Nikmati kelajuan baharu, atau klik 'Mula Kuiz Debrief' bila-bila masa!",
      dismissBtn: "Pandu Uji Rover Baharu",
      quizNowBtn: "Mula Kuiz Debrief Sekarang",
    },
    sols: {
      1: {
        title: "Tugasan Hari 1: Unit Penjana Oksigen",
        context:
          "Tiada udara bernafas di angkasa! Mesin kita mengekstrak oksigen daripada batuan bulan & CO₂ (seperti MOXIE NASA), tetapi memerlukan kuasa bateri tinggi.",
        drFarahTip:
          "Udara segar penting untuk kru, tetapi perhatikan kos Tenaga kuning kita!",
        hint:
          "Fikirkan keperluan kru: jika Oksigen terlalu rendah kru tidak boleh bekerja, tetapi kuasa penuh menggunakan bateri awal.",
        tradeoff:
          "Pilihan A meningkatkan Oksigen (+▲) dengan kos Tenaga (-▼). Pilihan B menjimatkan Tenaga (+▲) menggunakan tangki udara simpanan (-▼ Oksigen).",
        factTitle: "Fakta Sains: Menjana Udara daripada Debu Bulan & Marikh!",
        factBody:
          "Tanah bulan (regolit) mengandungi lebih 40% oksigen yang terikat dalam mineral batuan! Di Marikh pula, mesin MOXIE NASA memisahkan gas CO₂ kepada oksigen.",
        choiceA: "Jalankan Penjana Oksigen Penuh",
        choiceB: "Jimat Tenaga & Guna Udara Simpanan",
      },
      2: {
        title: "Tugasan Hari 2: Kubah Rumah Hijau Hidroponik",
        context:
          "Tanah angkasa perlu ditapis dan rumah hijau perlu dipanaskan supaya tanaman kentang angkasa tumbuh subur.",
        drFarahTip:
          "Kentang angkasa memberi Makanan penting, tetapi meminjam kuasa daripada kubah mengurangkan Perisai!",
        hint:
          "Perhatikan bar Makanan (Hijau) dan Perisai (Biru/Ungu). Esok ada amaran ribut suria—adakah perisai anda cukup kuat?",
        tradeoff:
          "Pilihan A menambah Makanan (+▲) tetapi mengurangkan Perisai (-▼). Pilihan B menguatkan Perisai (+▲) sambil mencatu snek (-▼ Makanan).",
        factTitle: "Fakta Sains: Pertanian Angkasa & Hidroponik",
        factBody:
          "Dalam rumah hijau angkasa NASA, tumbuhan ditanam di bawah lampu LED dengan air berzat supaya angkasawan mendapat makanan segar!",
        choiceA: "Cuci Tanah & Panaskan Rumah Hijau",
        choiceB: "Kekalkan Perisai & Catuan Snek",
      },
      3: {
        title: "Tugasan Hari 3: Amaran Ribut Suria DONKI NASA",
        context:
          "Sistem cuaca angkasa DONKI NASA mengesan ribut suria! Anda perlu membuat keputusan pantas untuk melindungi pangkalan sekarang!",
        drFarahTip:
          "Ribut suria menyerang perisai yang lemah! Pastikan bar Perisai anda tidak jatuh ke 0%.",
        hint:
          "Ribut suria memberi kesan paling besar kepada Perisai. Jika Perisai anda rendah, tingkatkan perisai segera!",
        tradeoff:
          "Pilihan A meningkatkan Perisai Ribut (+▲) menggunakan Tenaga (-▼) dan Oksigen (-▼). Pilihan B menambah Oksigen (+▲) tetapi menurunkan Perisai (-▼).",
        factTitle: "Fakta Sains: Cuaca Angkasa DONKI NASA",
        factBody:
          "DONKI menjejak suar suria dari Matahari supaya angkasawan di Bulan dan Marikh dapat mengaktifkan perisai radiasi tepat pada masanya!",
        choiceA: "Tingkatkan Perisai Ribut Sekarang",
        choiceB: "Kekalkan Penapis Udara Laju Penuh",
      },
      4: {
        title: "Tugasan Hari 4: Debu Elektrostatik di Panel Suria",
        context:
          "Debu kawah menyaluti panel suria kita dan melambatkan pengecasan bateri! Membersihkannya di luar menggunakan oksigen sut dan tenaga makanan.",
        drFarahTip:
          "Panel suria yang bersih memberikan lonjakan Tenaga besar untuk dua hari terakhir!",
        hint:
          "Hari 5 dan 6 memerlukan banyak Tenaga untuk makmal dan pemanas malam. Adakah Oksigen dan Makanan anda mencukupi untuk kerja luar?",
        tradeoff:
          "Pilihan A membersihkan panel untuk Tenaga tinggi (+▲) dengan kos Oksigen (-▼) dan Makanan (-▼). Pilihan B kekal di dalam (+▲ Makanan) tetapi hilang Tenaga (-▼).",
        factTitle: "Fakta Sains: Debu Kawah Berlekatan",
        factBody:
          "Debu Bulan dan Marikh bercas elektrostatik akibat cahaya matahari dan melekat kuat pada panel suria serta sut angkasa!",
        choiceA: "Bersihkan Debu Panel Suria",
        choiceB: "Kekal di Dalam Dengan Kuasa Rendah",
      },
      5: {
        title: "Tugasan Hari 5: Makmal Bio-Alga OSDR NASA",
        context:
          "Pusat Kawalan meminta kita menjalankan bioreaktor alga hijau dari makmal OSDR NASA untuk menghasilkan oksigen tambahan dalam graviti rendah.",
        drFarahTip:
          "Mikro-alga ialah kilang oksigen semula jadi! Semak sama ada Tenaga dan Makanan mencukupi.",
        hint:
          "Jika bar Oksigen anda rendah, ujian alga ini sangat membantu. Jika Tenaga atau Makanan terlalu rendah, berjimat lebih selamat.",
        tradeoff:
          "Pilihan A memberi lonjakan Oksigen (+▲) menggunakan Tenaga (-▼) dan Makanan (-▼). Pilihan B menjimatkan Tenaga (+▲) dan Makanan (+▲) dengan kos Oksigen (-▼).",
        factTitle: "Fakta Sains: Biologi Angkasa OSDR NASA",
        factBody:
          "Repositori Data Sains Terbuka NASA (OSDR) mengkaji pertumbuhan alga dan tumbuhan di angkasa untuk mengitar semula udara secara semula jadi!",
        choiceA: "Jalankan Ujian Alga NASA",
        choiceB: "Langkau Ujian & Simpan Bekalan",
      },
      6: {
        title: "Tugasan Hari 6: Malam Kawah Sejuk Beku (-85°C hingga -130°C)",
        context:
          "Sensor mencatat suhu malam sejuk melampau di luar kawah! Imbangkan pemanas haba sehingga roket penyelamat mendarat waktu subuh!",
        drFarahTip:
          "Hari terakhir, Komander! Pilih tindakan yang memastikan keempat-empat bar kekal di atas 0%!",
        hint:
          "Ini ujian terakhir! Perhatikan keempat-empat bar sumber anda—pilih pilihan yang tidak menolak bar terendah anda ke 0%.",
        tradeoff:
          "Pilihan A mengagihkan beban secara seimbang pada Tenaga (-▼), Oksigen (-▼), dan Perisai (-▼). Pilihan B menggunakan lebih Tenaga (-▼) dan Makanan (-▼).",
        factTitle: "Fakta Sains: Suhu Malam Kawah Ekstrem",
        factBody:
          "Tanpa atmosfera tebal seperti Bumi, suhu kawah menjunam di bawah -85°C di Marikh dan -130°C di Bulan sebaik sahaja matahari terbenam!",
        choiceA: "Imbangkan Pemanas, Udara & Perisai",
        choiceB: "Pasang Pemanas Penuh Awal",
      },
    },
    lose: {
      title: "Misi Dijeda — Sumber Pangkalan Kehabisan!",
      retryBtn: "Cuba Lagi dari Hari 1",
      tips: {
        power:
          "Tenaga kita mencecah 0%! Ingat rahsia angkasa saya: setiap pilihan membantu satu perkara dan mengorbankan yang lain. Cuba bersihkan panel suria pada Hari 4!",
        oxygen:
          "Oksigen kita mencecah 0%! Kru memerlukan udara segar daripada penjana oksigen dan makmal alga.",
        shielding:
          "Perisai kita mencecah 0%! Ribut suria memerlukan perisai kukuh. Pastikan perisai ditingkatkan semasa amaran DONKI!",
        food:
          "Makanan kita mencecah 0%! Pastikan rumah hijau hidroponik dijaga supaya kru kekal bertenaga!",
      },
    },
    quiz: {
      title: "Kuiz Debrief Komander Pasca-Misi",
      subtitle:
        "Jawab 4 soalan pantas (30s setiap satu) untuk mengira Skor Akhir Komander anda!",
      questionLabel: "Soalan",
      nextBtn: "Soalan Seterusnya",
      finishBtn: "Lihat Papan Pendahulu Misi",
      timeoutFeedback: "Masa tamat! Beralih ke soalan debrief seterusnya.",
      questions: [
        {
          q: "Mengapa komander pangkalan angkasa mesti mengimbangi Tenaga, Oksigen, Perisai, dan Makanan?",
          options: [
            "Setiap pilihan membantu satu sistem dan mengorbankan yang lain—tiada pilihan percuma",
            "Komputer pangkalan suka menutup mesin secara rawak",
            "Pangkalan angkasa mempunyai bateri percuma tanpa had",
            "Angkasawan hanya perlukan satu sumber sahaja untuk hidup",
          ],
          correct: 0,
          feedbackCorrect:
            "Tepat sekali! Seperti kata Dr. Farah, setiap pilihan membantu satu perkara dan mengorbankan yang lain!",
          feedbackWrong:
            "Ingat pesanan Dr. Farah: di angkasa, setiap pilihan membantu satu sistem dan mengorbankan yang lain!",
        },
        {
          q: "Bagaimanakah sistem NASA seperti MOXIE dan pengekstrak regolit membantu angkasawan bernafas?",
          options: [
            "Menghantar udara segar terus dari Bumi",
            "Mengekstrak oksigen daripada gas CO₂ atau batuan bulan menggunakan kuasa elektrik",
            "Membekukan cahaya bintang menjadi udara cecair",
            "Menghasilkan oksigen tanpa sebarang tenaga elektrik",
          ],
          correct: 1,
          feedbackCorrect:
            "Betul! Menghasilkan oksigen di Bulan atau Marikh menggunakan sumber tempatan dan tenaga elektrik!",
          feedbackWrong:
            "Pengekstrak menghasilkan oksigen daripada CO₂ atau tanah bulan menggunakan kuasa elektrik.",
        },
        {
          q: "Apakah amaran yang diberikan oleh sistem cuaca angkasa DONKI NASA kepada angkasawan?",
          options: [
            "Amaran ribut suria supaya kru dapat menguatkan perisai radiasi tepat pada masanya",
            "Bila kentang angkasa sedia untuk dituai",
            "Kelajuan pusingan tayar rover",
            "Ribut hujan dan pasang surut laut di Bumi",
          ],
          correct: 0,
          feedbackCorrect:
            "Hebat! DONKI menjejak ribut suria supaya kru dapat melindungi pangkalan dengan perisai!",
          feedbackWrong:
            "DONKI menjejak ribut suria dari Matahari supaya kru dapat menguatkan perisai radiasi!",
        },
        {
          q: "Mengapakah membersihkan debu pada panel suria menggunakan Oksigen dan Makanan?",
          options: [
            "Panel suria makan snek untuk hasilkan elektrik",
            "Bekerja di luar dalam sut angkasa guna oksigen dan tenaga makanan untuk memulihkan Tenaga",
            "Debu bertukar menjadi makanan apabila diberus",
            "Membersihkan panel suria menutup cahaya matahari",
          ],
          correct: 1,
          feedbackCorrect:
            "Cemerlang! Kerja luar menggunakan oksigen sut dan tenaga makanan sebagai pertukaran untuk mengecas bateri!",
          feedbackWrong:
            "Kerja luar dalam sut angkasa menggunakan oksigen dan makanan untuk memulihkan Tenaga bateri!",
        },
      ],
    },
    leaderboard: {
      title: "Papan Pendahulu Komander Pangkalan Bulan",
      subtitle: "Bandingkan prestasi 6-Hari anda dengan Komander terbaik!",
      totalScoreLabel: "Jumlah Skor Misi",
      breakdown: {
        resources: "Baki Sumber",
        tasks: "Tugasan Selesai",
        quiz: "Ketepatan Kuiz",
        timeBonus: "Bonus Masa",
      },
      enterNameLabel: "Simpan Nama Panggilan Komander:",
      namePlaceholder: "cth., Kmdr. Zara",
      saveBtn: "Simpan Skor",
      savedBadge: "Disimpan ke Papan Pendahulu!",
      rankCol: "Kedudukan",
      nameCol: "Komander",
      tasksCol: "Tugasan",
      quizCol: "Kuiz",
      scoreCol: "Skor",
      certificateBtn: "Lihat & Muat Turun Sijil",
      playAgainBtn: "Main Semula",
    },
    certificate: {
      heading: "Sijil Rasmi Komander Pangkalan Angkasa",
      presentedTo: "Dengan Bangganya Dianugerahkan Kepada",
      namePlaceholder: "Masukkan Nama Komander...",
      defaultName: "Komander Angkasa",
      completedLine:
        "Kerana berjaya menguruskan sumber selama 6 Hari di Pangkalan Bulan & Marikh!",
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
      backToLeaderboard: "Kembali ke Papan Pendahulu",
      playAgainBtn: "Main Semula",
    },
    nasaModal: {
      title: "Sains & Data NASA",
      intro:
        "Misi ini diinspirasikan oleh sistem penerokaan angkasa NASA sebenar dan set data sains terbuka untuk pelajar:",
      items: [
        {
          name: "Pangkalan Bulan Artemis NASA & Perseverance (MOXIE / MEDA)",
          desc: "Penggunaan sumber tempatan (ISRU) mengekstrak oksigen daripada regolit bulan dan CO₂ Marikh.",
        },
        {
          name: "Pangkalan Data Cuaca Angkasa DONKI NASA",
          desc: "Menjejak suar suria supaya kru dapat menguatkan perisai radiasi sebelum ribut tiba.",
        },
        {
          name: "Repositori Data Sains Terbuka NASA (OSDR)",
          desc: "Berkongsi eksperimen biologi angkasa—seperti menanam mikroalga dan tanaman hidroponik.",
        },
      ],
    },
  },
};
