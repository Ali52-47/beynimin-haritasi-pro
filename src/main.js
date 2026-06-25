import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/* =========================================================
   HTML ELEMENTLERİ
========================================================= */

const app = document.getElementById('app');

const introScreen = document.getElementById('introScreen');
const startButton = document.getElementById('startButton');
const hud = document.getElementById('hud');
const musicToggle = document.getElementById('musicToggle');

const detailPanel = document.getElementById('detailPanel');
const detailBg = document.getElementById('detailBg');
const closeDetail = document.getElementById('closeDetail');
const detailIcon = document.getElementById('detailIcon');
const detailTitle = document.getElementById('detailTitle');
const detailDescription = document.getElementById('detailDescription');
const detailTags = document.getElementById('detailTags');
const detailCards = document.getElementById('detailCards');
const detailConnections = document.getElementById('detailConnections');

/* =========================================================
   GENEL DURUM
========================================================= */

let journeyStarted = false;
let musicPlaying = false;
let hoveredNode = null;

/* =========================================================
   MÜZİK
========================================================= */

const musicPaths = [
    '/music/ambient.mp3',
    '/music/ambiment.mp3',
    '/music/music.mp3'
];

let activeMusicIndex = 0;

const bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = 0.32;

function setMusicSource(index) {
    bgMusic.src = musicPaths[index];
    bgMusic.load();
}

setMusicSource(activeMusicIndex);

/* =========================================================
   İLGİ ALANLARI
========================================================= */

const interests = [
    {
        id: 'software',
        title: 'Yazılım',
        icon: '💻',
        color: '#38bdf8',
        backgroundImage: '/images/software.png',
        basePosition: new THREE.Vector3(0, 12.3, 0),
        motionRadius: 0.42,
        motionSpeed: 0.70,
        motionOffset: 0,
        description: 'Yazılım benim için fikirleri çalışan projelere dönüştürmenin en güçlü yolu.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Python', 'Web Geliştirme'],
        cards: [
            { icon: '🌐', title: 'Web Geliştirme', text: 'HTML, CSS ve JavaScript ile etkileşimli ve modern web arayüzleri geliştiriyorum.' },
            { icon: '🐍', title: 'Python', text: 'Python ile masaüstü uygulamalar, otomasyonlar ve veri odaklı projeler geliştiriyorum.' },
            { icon: '🧠', title: 'Problem Çözme', text: 'Yazılımı sadece kod yazmak değil, mantıklı çözüm üretmek olarak görüyorum.' }
        ],
        connections: [
            'Projeler alanıyla bağlantılıdır çünkü öğrendiğim teknolojileri gerçek uygulamalarda kullanıyorum.',
            'Teknoloji alanıyla bağlantılıdır çünkü yazılım dijital dünyanın temelidir.',
            'Siber Güvenlik alanıyla bağlantılıdır çünkü güvenli sistemler de yazılımla kurulur.'
        ]
    },
    {
        id: 'university',
        title: 'Üniversite',
        icon: '🎓',
        color: '#22c55e',
        backgroundImage: '/images/university.png',
        basePosition: new THREE.Vector3(12.2, 9.3, 0),
        motionRadius: 0.42,
        motionSpeed: 0.60,
        motionOffset: 0.8,
        description: 'Bilgisayar Mühendisliği eğitimim teknik temelimi güçlendiren ana alan.',
        tags: ['Balıkesir Üniversitesi', 'Bilgisayar Mühendisliği', 'Dersler'],
        cards: [
            { icon: '🏫', title: 'Balıkesir Üniversitesi', text: 'Eğitim hayatımı sürdürdüğüm ve teknik gelişimime yön veren üniversite.' },
            { icon: '🖥️', title: 'Bilgisayar Mühendisliği', text: 'Yazılım, algoritma, veri yapıları ve bilgisayar sistemleri üzerine eğitim alıyorum.' },
            { icon: '📚', title: 'Dersler', text: 'İnternet Programlama ve Veri Yapıları gibi dersler projelerimin temelini oluşturuyor.' }
        ],
        connections: [
            'Yazılım alanıyla bağlantılıdır çünkü bölümüm doğrudan yazılım becerilerimi geliştiriyor.',
            'Projeler alanıyla bağlantılıdır çünkü derslerde öğrendiklerimi uygulamaya dönüştürüyorum.',
            'Siber Güvenlik ve Teknoloji alanlarını da besleyen temel kaynaktır.'
        ]
    },
    {
        id: 'football',
        title: 'Futbol',
        icon: '⚽',
        color: '#facc15',
        backgroundImage: '/images/fenerbahce.png',
        basePosition: new THREE.Vector3(17.2, 2.2, 0),
        motionRadius: 0.40,
        motionSpeed: 0.55,
        motionOffset: 1.5,
        description: 'Futbola sadece izleyici olarak değil, analiz ve veri açısından da bakıyorum.',
        tags: ['Fenerbahçe', 'Cristiano Ronaldo', 'Oyuncu Analizi', 'Scout'],
        cards: [
            { icon: '💛', title: 'Fenerbahçe', text: 'Desteklediğim futbol takımı ve futbol ilgimin önemli bir parçası.' },
            { icon: '🐐', title: 'Cristiano Ronaldo', text: 'Disiplini, çalışkanlığı ve kariyer çizgisiyle ilgimi çeken oyunculardan biri.' },
            { icon: '📈', title: 'Oyuncu Analizi', text: 'Oyuncuların performansını, gelişimini ve piyasa değerini analiz etmeyi seviyorum.' }
        ],
        connections: [
            'Projeler alanıyla bağlantılıdır çünkü futbol scout projem bu ilgiden doğdu.',
            'Yazılım alanıyla bağlantılıdır çünkü futbol verilerini yazılımla analiz edebilirim.',
            'Teknoloji alanıyla bağlantılıdır çünkü modern futbolda veri analizi çok önemlidir.'
        ]
    },
    {
        id: 'projects',
        title: 'Projeler',
        icon: '🚀',
        color: '#fb7185',
        backgroundImage: '/images/projects.png',
        basePosition: new THREE.Vector3(13.8, -8.8, 0),
        motionRadius: 0.42,
        motionSpeed: 0.64,
        motionOffset: 2.2,
        description: 'Projeler, öğrendiğim bilgileri gerçek uygulamalara dönüştürdüğüm alan.',
        tags: ['Futbol Scout', 'Zihin Evreni', 'Veritabanı', 'Web Sitesi'],
        cards: [
            { icon: '📊', title: 'Futbol Scout Projesi', text: 'Python, PySide6 ve SQLite ile futbolcu analiz uygulaması geliştirdim.' },
            { icon: '🌌', title: 'Zihin Evreni', text: 'Bu proje ilgi alanlarımı interaktif bir dijital evren içinde gösteriyor.' },
            { icon: '🗃️', title: 'Veritabanı', text: 'Verileri kaydetme, tekrar kullanma ve analiz etme üzerine çalışmalar yaptım.' }
        ],
        connections: [
            'Yazılım alanıyla doğrudan bağlantılıdır çünkü projeler kod ile inşa edilir.',
            'Futbol alanıyla bağlantılıdır çünkü futbol scout projesi bu kesişimden ortaya çıkmıştır.',
            'Üniversite alanıyla bağlantılıdır çünkü derslerde öğrendiklerim projelerde kullanılır.'
        ]
    },
    {
        id: 'technology',
        title: 'Teknoloji',
        icon: '🤖',
        color: '#a855f7',
        backgroundImage: '/images/technology.png',
        basePosition: new THREE.Vector3(6.0, -13.2, 0),
        motionRadius: 0.40,
        motionSpeed: 0.58,
        motionOffset: 3.0,
        description: 'Teknoloji geleceği anlamamı ve yazılım alanında kendimi geliştirmemi sağlıyor.',
        tags: ['Yapay Zekâ', 'Dijital Dünya', 'Bilgisayar Sistemleri'],
        cards: [
            { icon: '🤖', title: 'Yapay Zekâ', text: 'Yapay zekâ araçlarının eğitim ve yazılımda nasıl kullanılabileceği ilgimi çekiyor.' },
            { icon: '💡', title: 'Yeni Fikirler', text: 'Teknoloji sayesinde farklı proje fikirleri üretmek mümkün hale geliyor.' },
            { icon: '🖥️', title: 'Sistemler', text: 'Donanım, yazılım ve sistemlerin birlikte nasıl çalıştığını anlamaya çalışıyorum.' }
        ],
        connections: [
            'Yazılım alanıyla bağlantılıdır çünkü teknolojinin üretim aracı çoğu zaman yazılımdır.',
            'Kuantum alanıyla bağlantılıdır çünkü ikisi de geleceğin teknolojilerine uzanır.',
            'Siber Güvenlik alanıyla bağlantılıdır çünkü güvenli dijital sistemler teknolojinin parçasıdır.'
        ]
    },
    {
        id: 'history',
        title: 'Tarih',
        icon: '🏛️',
        color: '#f97316',
        backgroundImage: '/images/history.png',
        basePosition: new THREE.Vector3(-6.0, -13.2, 0),
        motionRadius: 0.40,
        motionSpeed: 0.56,
        motionOffset: 3.7,
        description: 'Tarih, olayları, medeniyetleri ve insanların düşünce dünyasını anlamamı sağlar.',
        tags: ['Kore Tarihi', 'Osmanlı', 'İslam Tarihi', 'Dünya Tarihi'],
        cards: [
            { icon: '🏯', title: 'Kore Tarihi', text: 'Tarihi Kore dizileri ve siyasi karakterler ilgimi çekiyor.' },
            { icon: '🕌', title: 'İslam Tarihi', text: 'İslam tarihi ve medeniyetleri hakkında okumayı seviyorum.' },
            { icon: '🏛️', title: 'Dünya Tarihi', text: 'Farklı toplumların gelişimini ve tarihsel olayları öğrenmeyi seviyorum.' }
        ],
        connections: [
            'Diziler alanıyla bağlantılıdır çünkü tarihi anlatılar dizi ve hikâye ilgimi besler.',
            'Üniversite alanıyla bağlantılıdır çünkü tarihsel bakış açısı düşünmeyi geliştirir.',
            'Kültürel merakımın en önemli parçalarından biridir.'
        ]
    },
    {
        id: 'quantum',
        title: 'Kuantum',
        icon: '⚛️',
        color: '#06b6d4',
        backgroundImage: '/images/quantum.png',
        basePosition: new THREE.Vector3(-13.8, -8.8, 0),
        motionRadius: 0.40,
        motionSpeed: 0.54,
        motionOffset: 4.4,
        description: 'Kuantum fiziği ve kuantum dünyasının sıra dışı mantığı ilgimi çekiyor.',
        tags: ['Kuantum Fiziği', 'Simülasyon', 'Bilim', 'Merak'],
        cards: [
            { icon: '⚛️', title: 'Kuantum Fiziği', text: 'Mikro ölçekte doğanın nasıl davrandığını anlamaya çalışıyorum.' },
            { icon: '🧪', title: 'Simülasyon', text: 'Kuantum konularını simülasyon ve görselleştirme ile öğrenmeyi seviyorum.' },
            { icon: '🔭', title: 'Bilimsel Merak', text: 'Evrenin temel yapısını anlamaya yönelik konular ilgimi çekiyor.' }
        ],
        connections: [
            'Teknoloji alanıyla bağlantılıdır çünkü kuantum hesaplama geleceğin teknolojileri arasındadır.',
            'Yazılım alanıyla bağlantılıdır çünkü simülasyonlar ve görselleştirmeler kodla yapılabilir.',
            'Bilimsel merakımı temsil eden ana düğümlerden biridir.'
        ]
    },
    {
        id: 'series',
        title: 'Diziler',
        icon: '🎬',
        color: '#ec4899',
        backgroundImage: '/images/series.png',
        basePosition: new THREE.Vector3(-17.2, 2.2, 0),
        motionRadius: 0.40,
        motionSpeed: 0.52,
        motionOffset: 5.1,
        description: 'Diziler benim için hem hikâye hem atmosfer hem de karakter analizi sunan bir alan.',
        tags: ['Kingdom', 'Tarihi Diziler', 'Kore Dizileri', 'Hikâye'],
        cards: [
            { icon: '🎥', title: 'Hikâye Dünyası', text: 'Sürükleyici hikâyeleri ve karakter gelişimini seviyorum.' },
            { icon: '🏯', title: 'Tarihi Diziler', text: 'Özellikle tarihi atmosfer taşıyan diziler ilgimi çekiyor.' },
            { icon: '🇰🇷', title: 'Kore Dizileri', text: 'Kore yapımları ve kültürel detaylar dikkatimi çekiyor.' }
        ],
        connections: [
            'Tarih alanıyla bağlantılıdır çünkü tarihi diziler kültürel merakımı artırıyor.',
            'Kore Tarihi ilgimle doğrudan örtüşen bir alandır.',
            'Hayal gücü ve anlatı dünyasıyla zihinsel dünyamı besler.'
        ]
    },
    {
        id: 'cybersecurity',
        title: 'Siber Güvenlik',
        icon: '🛡️',
        color: '#10b981',
        backgroundImage: '/images/cyber_security.png',
        basePosition: new THREE.Vector3(-12.2, 9.3, 0),
        motionRadius: 0.42,
        motionSpeed: 0.62,
        motionOffset: 5.8,
        description: 'Siber güvenlik, dijital sistemlerin korunması ve güvenliğin sağlanması açısından ilgimi çekiyor.',
        tags: ['Ağ Güvenliği', 'Şifreleme', 'Sistem Güvenliği', 'Savunma'],
        cards: [
            { icon: '🛡️', title: 'Sistem Güvenliği', text: 'Bilgisayar sistemlerini ve verileri koruma mantığı ilgimi çekiyor.' },
            { icon: '🔐', title: 'Şifreleme', text: 'Bilginin güvenli aktarımı ve gizliliği önemli bir çalışma alanı.' },
            { icon: '🌐', title: 'Ağ Güvenliği', text: 'Ağlar üzerindeki tehditleri ve savunma yöntemlerini öğrenmek istiyorum.' }
        ],
        connections: [
            'Yazılım alanıyla bağlantılıdır çünkü güvenli uygulamalar geliştirmek yazılımla mümkündür.',
            'Teknoloji alanıyla bağlantılıdır çünkü modern dijital dünya güvenlik gerektirir.',
            'Üniversite alanıyla bağlantılıdır çünkü bu konu teknik eğitimimle doğrudan ilişkilidir.'
        ]
    }
];

/* =========================================================
   THREE.JS SAHNE KURULUMU
========================================================= */

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

textureLoader.load(
    '/images/evren.jpg',
    function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
    },
    undefined,
    function () {
        console.warn('Evren görseli yüklenemedi. public/images/evren.jpg yolunu kontrol et.');
    }
);

const camera = new THREE.PerspectiveCamera(
    46,
    window.innerWidth / window.innerHeight,
    0.1,
    1200
);

camera.position.set(0, 0, 47);
const cameraTarget = new THREE.Vector3(0, -1.7, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
app.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.14,
    0.18,
    0.75
);

composer.addPass(bloomPass);

const ambientLight = new THREE.AmbientLight(0x7dd3fc, 0.55);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x7dd3fc, 2.2, 120);
pointLight.position.set(0, 1.8, 16);
scene.add(pointLight);

const universeGroup = new THREE.Group();
universeGroup.position.y = -2.1;
scene.add(universeGroup);

const clickableObjects = [];
const signalObjects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

/* =========================================================
   TEXTURE
========================================================= */

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(125,211,252,0.75)');
    gradient.addColorStop(0.55, 'rgba(56,189,248,0.25)');
    gradient.addColorStop(1, 'rgba(56,189,248,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
}

const glowTexture = createGlowTexture();

createStarField();
createNebulaDust();
createCentralBrain();
createInterestPlanets();
createConnections();

/* =========================================================
   YILDIZLAR
========================================================= */

function createStarField() {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = THREE.MathUtils.randFloatSpread(140);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(90);
        positions[i * 3 + 2] = THREE.MathUtils.randFloat(-180, -20);

        const color = new THREE.Color().setHSL(
            0.55 + Math.random() * 0.12,
            0.9,
            0.7
        );

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.18,
        map: glowTexture,
        transparent: true,
        opacity: 0.68,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

/* =========================================================
   NEBULA TOZU
========================================================= */

function createNebulaDust() {
    const count = 450;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = THREE.MathUtils.randFloatSpread(56);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(36);
        positions[i * 3 + 2] = THREE.MathUtils.randFloat(-28, 6);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.10,
        map: glowTexture,
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dust = new THREE.Points(geometry, material);
    universeGroup.add(dust);
}

/* =========================================================
   MERKEZ
========================================================= */

function createCentralBrain() {
    const centerGroup = new THREE.Group();
    centerGroup.position.set(0, 0, 0);
    universeGroup.add(centerGroup);

    const core = new THREE.Mesh(
        new THREE.SphereGeometry(1.75, 64, 64),
        new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            emissive: 0x2563eb,
            emissiveIntensity: 0.42,
            roughness: 0.48,
            metalness: 0.16,
            transparent: true,
            opacity: 0.94
        })
    );

    centerGroup.add(core);

    const outerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(2.75, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.055,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    centerGroup.add(outerGlow);

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.30,
        blending: THREE.AdditiveBlending
    });

    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.95, 0.016, 16, 160),
        ringMaterial
    );
    ring1.rotation.x = Math.PI / 2.5;
    centerGroup.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(3.35, 0.012, 16, 160),
        ringMaterial.clone()
    );
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = Math.PI / 3;
    centerGroup.add(ring2);

    const label = createTextSprite('🧠', 'Zihin Ağlarım', '#7dd3fc', 0.86);
    label.position.set(0, -0.45, 2.55);
    centerGroup.add(label);

    centerGroup.userData.rings = [ring1, ring2];
    scene.userData.centerGroup = centerGroup;
}

/* =========================================================
   GEZEGENLER
========================================================= */

function createInterestPlanets() {
    interests.forEach(function (node) {
        const group = new THREE.Group();
        group.position.copy(node.basePosition);
        group.userData.node = node;

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 48, 48),
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(node.color),
                emissive: new THREE.Color(node.color),
                emissiveIntensity: 0.28,
                roughness: 0.42,
                metalness: 0.12
            })
        );

        sphere.userData.node = node;
        group.add(sphere);

        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(1.22, 48, 48),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(node.color),
                transparent: true,
                opacity: 0.090,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );

        glow.userData.node = node;
        group.add(glow);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.28, 0.018, 16, 160),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(node.color),
                transparent: true,
                opacity: 0.34,
                blending: THREE.AdditiveBlending
            })
        );

        ring.rotation.x = Math.PI / 2.2;
        ring.userData.node = node;
        group.add(ring);

        const label = createTextSprite(node.icon, node.title, node.color, 1.08);
        label.position.set(0, -2.25, 0.18);
        group.add(label);

        node.group = group;
        node.sphere = sphere;
        node.glow = glow;
        node.ring = ring;
        node.label = label;

        universeGroup.add(group);
        clickableObjects.push(sphere, glow, ring);
    });
}

/* =========================================================
   BAĞLANTILAR
========================================================= */

function createConnections() {
    interests.forEach(function (node) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            node.group.position.clone()
        ]);

        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color(node.color),
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geometry, material);
        universeGroup.add(line);

        node.connectionLine = line;

        const signal = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 16, 16),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(node.color),
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            })
        );

        signal.userData.node = node;
        signal.userData.offset = Math.random();

        universeGroup.add(signal);
        signalObjects.push(signal);
    });

    const crossPairs = [
        ['software', 'projects'],
        ['software', 'cybersecurity'],
        ['technology', 'quantum'],
        ['history', 'series'],
        ['football', 'projects'],
        ['university', 'cybersecurity'],
        ['university', 'software'],
        ['technology', 'cybersecurity'],
        ['series', 'history']
    ];

    scene.userData.crossLines = [];

    crossPairs.forEach(function ([a, b]) {
        const first = interests.find(item => item.id === a);
        const second = interests.find(item => item.id === b);

        if (!first || !second) return;

        const geometry = new THREE.BufferGeometry().setFromPoints([
            first.group.position.clone(),
            second.group.position.clone()
        ]);

        const material = new THREE.LineBasicMaterial({
            color: 0xcbd5e1,
            transparent: true,
            opacity: 0.07,
            blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geometry, material);
        universeGroup.add(line);

        scene.userData.crossLines.push({
            line,
            first,
            second
        });
    });
}

/* =========================================================
   SPRITE
========================================================= */

function drawRoundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function createTextSprite(icon, title, color, scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 620;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    const accent = color || '#7dd3fc';

    context.save();
    context.shadowColor = accent;
    context.shadowBlur = 36;
    context.fillStyle = 'rgba(2, 6, 23, 0.76)';
    context.strokeStyle = accent;
    context.lineWidth = 5;
    drawRoundRect(context, 150, 70, 900, 450, 58);
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.globalAlpha = 0.18;
    context.fillStyle = accent;
    drawRoundRect(context, 185, 105, 830, 380, 46);
    context.fill();
    context.restore();

    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.font = 'bold 132px Arial';
    context.fillStyle = '#ffffff';
    context.shadowColor = 'rgba(0,0,0,1)';
    context.shadowBlur = 26;
    context.lineWidth = 14;
    context.strokeStyle = 'rgba(0,0,0,0.92)';
    context.strokeText(icon, 600, 190);
    context.fillText(icon, 600, 190);

    context.font = 'bold 92px Arial';
    context.lineWidth = 18;
    context.strokeStyle = 'rgba(0,0,0,0.96)';
    context.fillStyle = '#ffffff';
    context.shadowColor = accent;
    context.shadowBlur = 18;
    context.strokeText(title, 600, 350);
    context.fillText(title, 600, 350);

    context.font = 'bold 42px Arial';
    context.lineWidth = 10;
    context.strokeStyle = 'rgba(0,0,0,0.96)';
    context.fillStyle = accent;
    context.shadowColor = 'rgba(0,0,0,0.95)';
    context.shadowBlur = 12;
    context.strokeText('İlgi Alanı', 600, 430);
    context.fillText('İlgi Alanı', 600, 430);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 999;
    sprite.scale.set(5.8 * scale, 3.0 * scale, 1);

    return sprite;
}

/* =========================================================
   MOUSE
========================================================= */

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickableObjects, false);

    if (
        hits.length > 0 &&
        journeyStarted &&
        detailPanel.classList.contains('hidden')
    ) {
        const node = hits[0].object.userData.node;

        if (hoveredNode !== node) {
            if (hoveredNode) unhoverPlanet(hoveredNode);
            hoveredNode = node;
            hoverPlanet(node);
        }

        document.body.style.cursor = 'pointer';
    } else {
        if (hoveredNode) unhoverPlanet(hoveredNode);
        hoveredNode = null;
        document.body.style.cursor = 'default';
    }
}

function onPointerClick(event) {
    if (!journeyStarted) return;
    if (!detailPanel.classList.contains('hidden')) return;

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickableObjects, false);

    if (hits.length === 0) return;

    const node = hits[0].object.userData.node;
    focusPlanet(node);
    openDetail(node);
}

/* =========================================================
   HOVER
========================================================= */

function hoverPlanet(node) {
    gsap.to(node.group.scale, {
        x: 1.20,
        y: 1.20,
        z: 1.20,
        duration: 0.35,
        ease: 'power2.out'
    });

    gsap.to(node.glow.material, {
        opacity: 0.16,
        duration: 0.35
    });
}

function unhoverPlanet(node) {
    gsap.to(node.group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.35,
        ease: 'power2.out'
    });

    gsap.to(node.glow.material, {
        opacity: 0.09,
        duration: 0.35
    });
}

/* =========================================================
   KAMERA
========================================================= */

function focusPlanet(node) {
    const targetPosition = node.group.position.clone().multiplyScalar(0.34);
    targetPosition.z = 13.5;

    gsap.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.15,
        ease: 'power3.inOut'
    });

    gsap.to(cameraTarget, {
        x: node.group.position.x,
        y: node.group.position.y,
        z: node.group.position.z,
        duration: 1.15,
        ease: 'power3.inOut'
    });
}

function resetCamera() {
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 47,
        duration: 1.1,
        ease: 'power3.inOut'
    });

    gsap.to(cameraTarget, {
        x: 0,
        y: -1.7,
        z: 0,
        duration: 1.1,
        ease: 'power3.inOut'
    });
}

/* =========================================================
   DETAY PANEL
========================================================= */

function openDetail(node) {
    const bgPath = node.backgroundImage || '/images/evren.jpg';

    detailBg.style.opacity = '0';

    setTimeout(() => {
        detailBg.style.backgroundImage = `url("${bgPath}")`;
        detailBg.style.backgroundPosition = 'center';
        detailBg.style.backgroundSize = 'cover';
        detailBg.style.backgroundRepeat = 'no-repeat';
        detailBg.style.opacity = '1';
    }, 120);

    detailIcon.textContent = node.icon;
    detailIcon.style.boxShadow = `0 0 52px ${node.color}`;
    detailTitle.textContent = node.title;
    detailDescription.textContent = node.description;

    detailTags.innerHTML = node.tags
        .map(tag => `<span class="tag">${tag}</span>`)
        .join('');

    detailCards.innerHTML = node.cards
        .map(card => `
            <div class="detail-card">
                <div class="card-icon">${card.icon}</div>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
            </div>
        `)
        .join('');

    detailConnections.innerHTML = node.connections
        .map(item => `<li>${item}</li>`)
        .join('');

    setTimeout(() => {
        detailPanel.classList.remove('hidden');
    }, 780);
}

function closeDetailPanel() {
    detailPanel.classList.add('hidden');
    detailBg.style.backgroundImage = 'url("/images/evren.jpg")';
    resetCamera();
}

/* =========================================================
   GİRİŞ
========================================================= */

function startJourney(event) {
    if (event) event.stopPropagation();

    journeyStarted = true;

    introScreen.style.opacity = '0';
    introScreen.style.pointerEvents = 'none';

    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 900);

    hud.classList.remove('hidden');
    musicToggle.classList.remove('hidden');

    gsap.to(camera.position, {
        z: 47,
        duration: 2.1,
        ease: 'power3.inOut'
    });

    gsap.fromTo(
        universeGroup.scale,
        { x: 0.86, y: 0.86, z: 0.86 },
        { x: 1, y: 1, z: 1, duration: 2.1, ease: 'power3.out' }
    );

    playMusic();
}

/* =========================================================
   MÜZİK
========================================================= */

function playMusic() {
    bgMusic.play()
        .then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊 Müzik Açık';
        })
        .catch(() => {
            if (activeMusicIndex < musicPaths.length - 1) {
                activeMusicIndex += 1;
                setMusicSource(activeMusicIndex);

                setTimeout(() => {
                    playMusic();
                }, 120);
            } else {
                musicPlaying = false;
                musicToggle.textContent = '🔈 Müziği Aç';
                console.warn('Müzik çalınamadı. public/music/ambient.mp3 yolunu kontrol et.');
            }
        });
}

function toggleMusic(event) {
    if (event) event.stopPropagation();

    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.textContent = '🔈 Müziği Aç';
    } else {
        playMusic();
    }
}

/* =========================================================
   ANİMASYON
========================================================= */

function animate() {
    const elapsed = performance.now() * 0.001;

    universeGroup.rotation.y = Math.sin(elapsed * 0.13) * 0.020;
    universeGroup.rotation.x = Math.sin(elapsed * 0.10) * 0.010;

    const centerGroup = scene.userData.centerGroup;

    if (centerGroup) {
        centerGroup.rotation.y += 0.003;

        const centerPulse = 1 + Math.sin(elapsed * 1.5) * 0.018;
        centerGroup.scale.setScalar(centerPulse);

        centerGroup.userData.rings.forEach((ring, index) => {
            ring.rotation.z += index === 0 ? 0.004 : -0.003;
        });
    }

    interests.forEach((node, index) => {
        const angle = elapsed * node.motionSpeed + node.motionOffset;

        const x = node.basePosition.x + Math.cos(angle) * node.motionRadius;
        const y = node.basePosition.y + Math.sin(angle) * node.motionRadius;
        const z = Math.sin(elapsed * 0.9 + index) * 0.30;

        node.group.position.set(x, y, z);

        node.sphere.rotation.y += 0.006;
        node.ring.rotation.z += 0.009;

        const pulse = 1 + Math.sin(elapsed * 1.8 + index) * 0.018;
        node.sphere.scale.setScalar(pulse);

        if (node.connectionLine) {
            node.connectionLine.geometry.setFromPoints([
                new THREE.Vector3(0, 0, 0),
                node.group.position.clone()
            ]);
        }
    });

    if (scene.userData.crossLines) {
        scene.userData.crossLines.forEach((item) => {
            item.line.geometry.setFromPoints([
                item.first.group.position.clone(),
                item.second.group.position.clone()
            ]);
        });
    }

    signalObjects.forEach((signal, index) => {
        const node = signal.userData.node;
        const t = (elapsed * 0.20 + signal.userData.offset + index * 0.04) % 1;

        signal.position.lerpVectors(
            new THREE.Vector3(0, 0, 0),
            node.group.position,
            t
        );

        signal.scale.setScalar(0.85 + Math.sin(elapsed * 5 + index) * 0.13);
    });

    pointLight.intensity = 2.0 + Math.sin(elapsed * 1.2) * 0.20;

    camera.lookAt(cameraTarget);
    composer.render();

    requestAnimationFrame(animate);
}

/* =========================================================
   RESIZE
========================================================= */

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

/* =========================================================
   EVENTLER
========================================================= */

startButton.addEventListener('click', startJourney);
musicToggle.addEventListener('click', toggleMusic);

closeDetail.addEventListener('click', function (event) {
    event.stopPropagation();
    closeDetailPanel();
});

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onPointerClick);
window.addEventListener('resize', onResize);

/* =========================================================
   BAŞLAT
========================================================= */

animate();