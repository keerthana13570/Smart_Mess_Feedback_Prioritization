// For physical Android device: use your PC's local IP (run `ipconfig` to find it)
// For Android Emulator: use http://10.0.2.2:5000
// For iOS Simulator / Web: use http://localhost:5000
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
