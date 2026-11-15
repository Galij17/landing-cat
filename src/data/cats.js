import cat01Img from '../assets/cats/cat-01-upward-gaze.jpg';
import cat02Img from '../assets/cats/cat-02-blep-shaka.jpg';
import cat03Img from '../assets/cats/cat-03-paw-punch.jpg';
import cat04Img from '../assets/cats/cat-04-suspicious-stare.jpg';
import cat05Img from '../assets/cats/cat-05-garden-explorer.jpg';

export const MOOD_FILTERS = ['Semua', 'Dramatis', 'Konyol', 'Garang', 'Santai'];

export const INITIAL_CATS = [
  {
    id: 'cat-01',
    code: '01',
    name: 'Penatap Langit (Nama Contoh)',
    isPlaceholderName: true,
    mood: 'Dramatis',
    poseTitle: 'Pose menengadah di bawah cahaya samping',
    image: cat01Img,
    width: 576,
    height: 1024,
    objectPosition: '50% 35%',
    alt: 'Kucing belang cokelat berdada putih menatap ke atas dengan sorot cahaya hangat di ruangan gelap',
    story:
      'Tatapan mata cokelat keemasan menghadap ke atas, menangkap cahaya hangat dari samping sementara bulu dadanya yang putih tetap kontras di latar ruangan gelap.',
    signatureLine: 'Sedang memikirkan jam makan berikutnya dengan penuh wibawa.',
    presets: [
      'Menunggu keajaiban turun dari rak lemari.',
      'Tatapan serius sebelum minta camilan.',
      'Mode puitis jam sebelas malam.',
    ],
  },
  {
    id: 'cat-02',
    code: '02',
    name: 'Si Melet Santai (Nama Contoh)',
    isPlaceholderName: true,
    mood: 'Konyol',
    poseTitle: 'Lidah menjulur tipis dengan stiker tangan shaka',
    image: cat02Img,
    width: 320,
    height: 640,
    objectPosition: '50% 82%',
    alt: 'Kucing belang abu-abu menjulurkan ujung lidah merah muda di latar hitam dengan stiker tangan kuning bergaya santai',
    story:
      'Ekspresi melet kecil dengan mata bulat membesar di latar hitam pekat, ditambah sentuhan stiker tangan kuning yang membuat suasananya jauh dari kata serius.',
    signatureLine: 'Santai dulu, urusan kabel pengisi daya dipikir nanti.',
    presets: [
      'Halo, ada jadwal tidur siang bersama?',
      'Lupa memasukkan lidah sejak lima menit lalu.',
      'Kabari kalau kaleng tuna sudah dibuka.',
    ],
  },
  {
    id: 'cat-03',
    code: '03',
    name: 'Petinju Kasur (Nama Contoh)',
    isPlaceholderName: true,
    mood: 'Garang',
    poseTitle: 'Kaki depan terangkat siap melayangkan pukulan ringan',
    image: cat03Img,
    width: 576,
    height: 1024,
    objectPosition: '50% 42%',
    alt: 'Kucing belang berpose di atas seprai putih sambil mengangkat satu kaki depan seperti bersiap meninju ke arah kamera',
    story:
      'Sudut lensa lebar mempertegas satu kaki kanan yang terangkat tinggi dan sorot mata menyipit di atas kasur putih. Siap menjaga batas teritori bantal.',
    signatureLine: 'Jangan sentuh ujung kaki sebelum izin tertulis.',
    presets: [
      'Pemanasan pagi sebelum kejar-kejaran di lorong.',
      'Serius, siapa yang memindahkan bola mainan?',
      'Satu pukulan lembut untuk kamera.',
    ],
  },
  {
    id: 'cat-04',
    code: '04',
    name: 'Inspektur Senyap (Nama Contoh)',
    isPlaceholderName: true,
    mood: 'Garang',
    poseTitle: 'Tatapan menyipit jarak dekat berlatar hitam pekat',
    image: cat04Img,
    width: 576,
    height: 1024,
    objectPosition: '50% 44%',
    alt: 'Potret jarak dekat wajah kucing belang bermata hijau kekuningan yang menyipit curiga dengan hidung merah muda di latar hitam',
    story:
      'Potret jarak dekat tanpa celah: kumis putih tegas, hidung merah muda mencolok, dan mata hijau kekuningan yang tampak sedang menguji kebenaran alasanmu pulang telat.',
    signatureLine: 'Kenapa bau tanganmu seperti kucing komplek sebelah?',
    presets: [
      'Investigasi kantong belanja selesai dalam tiga detik.',
      'Tidak percaya sebelum melihat bukti snack.',
      'Tatapan evaluasi kinerja pemilik.',
    ],
  },
  {
    id: 'cat-05',
    code: '05',
    name: 'Penjelajah Taman (Nama Contoh)',
    isPlaceholderName: true,
    mood: 'Santai',
    poseTitle: 'Menoleh di balik daun hijau dengan lonceng biru',
    image: cat05Img,
    width: 768,
    height: 1024,
    objectPosition: '50% 38%',
    alt: 'Kucing muda berbulu putih krem berkalung lonceng biru menengadah ingin tahu di antara dedaunan hijau dan bunga taman',
    story:
      'Satu-satunya sesi luar ruang dengan cahaya alami: bulu putih krem lembut, kalung lonceng biru kecil, dan daun hijau yang membingkai dagu saat menatap langit taman.',
    signatureLine: 'Pagi yang tenang di antara daun dan bunga halaman.',
    presets: [
      'Memantau kupu-kupu yang lewat terlalu cepat.',
      'Jadwal patroli kebun pukul tujuh pagi.',
      'Cahaya matahari paling pas di balik daun ini.',
    ],
  },
];
