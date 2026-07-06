import { Surah, SurahMeta } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export async function fetchSurahs(): Promise<SurahMeta[]> {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  if (data.code === 200) {
    return data.data;
  }
  throw new Error('Failed to fetch surahs');
}

export async function fetchSurah(number: number): Promise<Surah> {
  // Fetch Arabic text and audio
  const response = await fetch(`${BASE_URL}/surah/${number}/ar.alafasy`);
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error('Failed to fetch surah');
  }

  // Fetch English translation (Sahih International)
  const translationResponse = await fetch(`${BASE_URL}/surah/${number}/en.sahih`);
  const translationData = await translationResponse.json();

  // Fetch Bangla translation (Muhiuddin Khan)
  const banglaTranslationResponse = await fetch(`${BASE_URL}/surah/${number}/bn.bengali`);
  const banglaTranslationData = await banglaTranslationResponse.json();

  if (translationData.code === 200 && banglaTranslationData.code === 200) {
    // Merge translation into ayahs
    const mergedAyahs = data.data.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      translation: translationData.data.ayahs[index].text,
      banglaTranslation: banglaTranslationData.data.ayahs[index].text,
    }));
    return { ...data.data, ayahs: mergedAyahs };
  }

  return data.data;
}
