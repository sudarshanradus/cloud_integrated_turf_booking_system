export default function SlotGrid({ slots, selectedSlot, onSelect }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
      {slots.map((slot) => {
        const disabled = slot.booked || slot.blocked
        const isSelected = selectedSlot?.time === slot.time
        return (
          <button
            key={slot.time}
            disabled={disabled}
            onClick={() => onSelect(slot)}
            className={`
              relative py-3 px-1 rounded-xl text-xs font-semibold transition-all duration-200
              ${disabled
                ? 'bg-gray-700/60 text-gray-500 cursor-not-allowed'
                : isSelected
                  ? 'bg-green-500 text-black ring-2 ring-green-300 scale-105 shadow-lg'
                  : 'bg-green-900/40 text-green-100 hover:bg-green-700 hover:text-white cursor-pointer border border-green-700/50'
              }
            `}
          >
            <span className="block text-sm">{slot.time}</span>
            {disabled ? (
              <span className="block text-[10px] mt-0.5 opacity-50">
                {slot.booked ? 'Booked' : 'Blocked'}
              </span>
            ) : (
              <>
                <span className="block text-[10px] mt-0.5 text-green-300 font-bold">
                  ₹{slot.rate}
                </span>
                {isSelected && (
                  <span className="block text-[9px] mt-0.5 text-black/70 font-bold">
                    SELECTED
                  </span>
                )}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
