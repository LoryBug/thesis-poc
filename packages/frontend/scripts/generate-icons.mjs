import { Jimp } from 'jimp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'public', 'icons', '512.png')

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
]

const androidResPath = join(root, 'android', 'app', 'src', 'main', 'res')

for (const { dir, size } of androidSizes) {
  const outDir = join(androidResPath, dir)
  mkdirSync(outDir, { recursive: true })

  const img = await Jimp.read(src)
  img.resize({ w: size, h: size })
  await img.write(join(outDir, 'ic_launcher.png'))
  await img.write(join(outDir, 'ic_launcher_round.png'))
  await img.write(join(outDir, 'ic_launcher_foreground.png'))
  console.log(`✓ ${dir} (${size}x${size})`)
}

// Also generate splash screens (1024x1024 centered on 2048x2048 background)
const splashSizes = [
  { dir: 'drawable-port-mdpi',    w: 320,  h: 480  },
  { dir: 'drawable-port-hdpi',    w: 480,  h: 800  },
  { dir: 'drawable-port-xhdpi',   w: 720,  h: 1280 },
  { dir: 'drawable-port-xxhdpi',  w: 1080, h: 1920 },
  { dir: 'drawable-port-xxxhdpi', w: 1440, h: 2560 },
]

for (const { dir, w, h } of splashSizes) {
  const outDir = join(androidResPath, dir)
  mkdirSync(outDir, { recursive: true })

  const bg = new Jimp({ width: w, height: h, color: 0x173b68ff })
  const icon = await Jimp.read(src)
  const iconSize = Math.floor(Math.min(w, h) * 0.4)
  icon.resize({ w: iconSize, h: iconSize })
  bg.composite(icon, Math.floor((w - iconSize) / 2), Math.floor((h - iconSize) / 2))
  await bg.write(join(outDir, 'splash.png'))
  console.log(`✓ splash ${dir} (${w}x${h})`)
}

console.log('\nDone.')
