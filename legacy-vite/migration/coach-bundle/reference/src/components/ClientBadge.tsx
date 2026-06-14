import { formatClientType } from "../utils/format";
import { PTClient } from "../types/coach";

export function ClientBadge({
  type,
  connectionStatus
}: {
  type: PTClient["type"];
  connectionStatus: PTClient["connectionStatus"];
}) {
  const label =
    type === "connected" && connectionStatus === "pending"
      ? "Pendiente de conexión"
      : formatClientType(type);

  return (
    <span
      className={`type-badge ${
        type === "connected" ? "type-badge-connected" : "type-badge-external"
      }`}
    >
      {label}
    </span>
  );
}
