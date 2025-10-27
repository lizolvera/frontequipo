export function enmascararDestino(canal, destino) {
  if (canal === "email") {
    const [u, d] = (destino || "").split("@");
    if (!u || !d) return destino;
    const visible = u.slice(0, 1);
    return `${visible}${"*".repeat(Math.max(u.length - 1, 3))}@${d}`;
  }
  // sms
  const dig = (destino || "").replace(/\D/g, "");
  const vis = dig.slice(-2);
  return `*** *** **${vis}`;
}
