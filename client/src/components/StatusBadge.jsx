const STATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',            bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' },
  preparando: { label: 'Preparando 🔥',        bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-400'   },
  en_camino:  { label: '¡Listo para recoger!', bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  entregado:  { label: 'Recogido ✅',           bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
  cancelado:  { label: 'Cancelado',            bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-400'    },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendiente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
