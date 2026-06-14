# Publishing Guide — Cardiac Mass DSS

## Test su Android (debug)

### Prerequisiti una tantum

1. **Variabili d'ambiente** — aggiungile al profilo PowerShell (`notepad $PROFILE`):
   ```powershell
   $env:ANDROID_SDK_ROOT = "$env:LOCALAPPDATA\Android\Sdk"
   $env:JAVA_HOME = "C:\Users\loryl\.jdks\openjdk-23.0.1"
   ```

2. **ADB nel PATH** — aggiungi alla stessa riga del profilo:
   ```powershell
   $env:PATH += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
   ```

### Flusso con emulatore

```powershell
# 1. Avvia emulatore Pixel 4 (finestra separata, aspetta ~15 s)
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_4

# 2. Build web + sync capacitor
cd C:\UNI\Magistrale\Tesi\thesis-poc\packages\frontend
pnpm build:android

# 3. Build debug APK con Gradle
cd android
.\gradlew.bat assembleDebug

# 4. Installa sull'emulatore
adb install -r app\build\outputs\apk\debug\app-debug.apk

# 5. Avvia l'app
adb shell am start -n "it.unibo.cardiacmassdss/it.unibo.cardiacmassdss.MainActivity"
```

> Prima installazione: il build Gradle scarica dipendenze (~4-5 min). I run successivi sono veloci (~30 s).

### Flusso con dispositivo fisico

1. Sul telefono: **Impostazioni → Info telefono → tocca 7 volte "Numero build"**
2. **Impostazioni → Opzioni sviluppatore → Debug USB** → ON
3. Collega via USB e accetta la richiesta di autorizzazione sul telefono
4. Verifica connessione: `adb devices` (deve mostrare il dispositivo come `device`, non `unauthorized`)
5. Installa e avvia:
   ```powershell
   adb install -r app\build\outputs\apk\debug\app-debug.apk
   adb shell am start -n "it.unibo.cardiacmassdss/it.unibo.cardiacmassdss.MainActivity"
   ```

### Comandi ADB utili

```powershell
adb devices                    # lista dispositivi/emulatori connessi
adb logcat -s Capacitor        # log dell'app in tempo reale
adb uninstall it.unibo.cardiacmassdss  # disinstalla
adb shell input keyevent 82    # apre menu sviluppatore (utile per reload)
```

---

## Build per pubblicazione

### Ogni rilascio (web + native sync)
```
pnpm build          # build web app → dist/
pnpm cap:sync       # copia dist/ in android/ e ios/
```

---

## Play Store (Android)

### Prerequisiti
- Android Studio (con JDK 17+)
- Account Google Play Developer ($25 una tantum)

### Build APK/AAB di release

1. Apri il progetto Android:
   ```
   pnpm cap:android
   ```
2. In Android Studio: **Build → Generate Signed Bundle / APK**
3. Crea o importa un **keystore** (tienilo al sicuro, non committarlo)
4. Scegli **Android App Bundle (.aab)** — richiesto dal Play Store
5. Il file `.aab` finisce in `android/app/release/`

### Upload su Play Console
1. Vai su [play.google.com/console](https://play.google.com/console)
2. Crea una nuova app → carica l'`.aab`
3. Compila store listing (vedi sotto)
4. Privacy policy URL: inserisci `https://<tuo-dominio>/privacy-policy.html`
5. Invia per review (3–7 giorni)

---

## App Store (iOS)

### Prerequisiti
- Mac con Xcode 15+
- Apple Developer Account ($99/anno)

### Build
1. Su un Mac, clona il repo e apri il progetto:
   ```
   pnpm build && pnpm cap:sync
   pnpm cap:ios
   ```
2. In Xcode: seleziona il tuo team, configura il bundle ID `it.unibo.cardiacmassdss`
3. **Product → Archive** per creare l'archivio di release
4. Carica su App Store Connect via Xcode Organizer

---

## Store Listing (testo per entrambi gli store)

**Nome app:** Cardiac Mass DSS

**Sottotitolo (iOS):** Clinical Decision Support for Cardiac Masses

**Descrizione breve (Play Store):**
Decision support tool for cardiologists evaluating cardiac masses with multimodal imaging.

**Descrizione completa:**
Cardiac Mass DSS is a clinical decision support tool designed to assist cardiologists in the risk stratification of cardiac masses detected by echocardiography, CMR, CT, and PET.

The app integrates imaging findings from multiple modalities and applies a consensus algorithm to generate a structured risk assessment (low / intermediate / high), with evidence-based explanations and recommended next steps.

Key features:
- Multimodal input: Echo, CMR, CT/PET
- Consensus-based risk stratification
- Traceable reasoning (source retrieval)
- Full offline operation — no data leaves the device
- Export cases as JSON for documentation

**Categoria:** Medical (iOS) / Medical (Play Store)

**Parole chiave (iOS):** cardiac mass, echocardiography, CMR, decision support, cardiology, oncology

---

## Nota su classificazione come dispositivo medico

In EU (MDR 2017/745) e US (FDA), le app di supporto decisionale clinico possono richiedere certificazione come Software as a Medical Device (SaMD). Per un prototipo universitario / ricerca:
- Aggiungi sempre un disclaimer "not for clinical use" nella descrizione e nell'app
- La privacy policy già include il medical disclaimer
- Entrambi gli store hanno categorie "medical education" che richiedono meno vincoli regolatori
