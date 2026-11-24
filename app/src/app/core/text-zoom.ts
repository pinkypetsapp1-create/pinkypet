import { Capacitor } from '@capacitor/core';
import { TextZoom } from '@capacitor/text-zoom';

/**
 * Accesibilidad (prompt §7, «Texto 200 %»): en Android, el WebView no aplica por sí solo el tamaño de letra
 * del sistema. Se lee el preferido (por ejemplo, 2 = 200 %) y se aplica. En el navegador no hace nada.
 */
export async function applySystemTextZoom(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { value } = await TextZoom.getPreferred();
    await TextZoom.set({ value });
  } catch {
    /* si falla, se queda al 100 % */
  }
}
