// ============================================================
// DAFTAR FOTO - Tambahkan foto ke folder src/data/photos/
// Format: import fotoNama from './nama-file.jpg'
// ============================================================

import fotoEdit from './AI- Edit foto kasi effect.jpg';
import fotoDayBloom from './Let the day bloom.jpg';
import foto1 from './photo_2026-06-12_09-00-05.jpg';
import foto2 from './photo_2026-06-12_09-00-08.jpg';

export interface Photo {
  src: string;
  caption: string;
}

// Foto-foto kenangan kakak 🌸
export const photos: Photo[] = [
  { src: foto1, caption: "" },
  { src: foto2, caption: "" },
  { src: fotoDayBloom, caption: "" },
  { src: fotoEdit, caption: "" },
];

// Fungsi untuk mendapatkan foto
export const getPhotos = (): Photo[] => {
  return photos;
};
