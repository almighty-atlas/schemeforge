export type Lab = [number, number, number]

const rad = (value: number) => value * Math.PI / 180
const deg = (value: number) => value * 180 / Math.PI

export function hexToLab(hex: string): Lab {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  const rgb = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => {
    const c = channel / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const x = rgb[0] * 0.4124564 + rgb[1] * 0.3575761 + rgb[2] * 0.1804375
  const y = rgb[0] * 0.2126729 + rgb[1] * 0.7151522 + rgb[2] * 0.072175
  const z = rgb[0] * 0.0193339 + rgb[1] * 0.119192 + rgb[2] * 0.9503041
  const f = (n: number) => n > 0.008856 ? Math.cbrt(n) : 7.787 * n + 16 / 116
  const fx = f(x / 0.95047), fy = f(y), fz = f(z / 1.08883)
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

export function deltaE2000([L1, a1, b1]: Lab, [L2, a2, b2]: Lab): number {
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cbar = (C1 + C2) / 2
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)))
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2)
  const h1p = C1p === 0 ? 0 : (deg(Math.atan2(b1, a1p)) + 360) % 360
  const h2p = C2p === 0 ? 0 : (deg(Math.atan2(b2, a2p)) + 360) % 360
  const dLp = L2 - L1, dCp = C2p - C1p
  let dhp = 0
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p
    if (dhp > 180) dhp -= 360
    else if (dhp < -180) dhp += 360
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2)
  const Lbarp = (L1 + L2) / 2, Cbarp = (C1p + C2p) / 2
  let hbarp = h1p + h2p
  if (C1p * C2p !== 0) hbarp = Math.abs(h1p - h2p) > 180
    ? (h1p + h2p < 360 ? h1p + h2p + 360 : h1p + h2p - 360) / 2
    : (h1p + h2p) / 2
  const T = 1 - 0.17 * Math.cos(rad(hbarp - 30)) + 0.24 * Math.cos(rad(2 * hbarp))
    + 0.32 * Math.cos(rad(3 * hbarp + 6)) - 0.2 * Math.cos(rad(4 * hbarp - 63))
  const dTheta = 30 * Math.exp(-(((hbarp - 275) / 25) ** 2))
  const RC = 2 * Math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25 ** 7))
  const SL = 1 + 0.015 * (Lbarp - 50) ** 2 / Math.sqrt(20 + (Lbarp - 50) ** 2)
  const SC = 1 + 0.045 * Cbarp, SH = 1 + 0.015 * Cbarp * T
  const RT = -Math.sin(rad(2 * dTheta)) * RC
  return Math.sqrt((dLp / SL) ** 2 + (dCp / SC) ** 2 + (dHp / SH) ** 2 + RT * (dCp / SC) * (dHp / SH))
}
