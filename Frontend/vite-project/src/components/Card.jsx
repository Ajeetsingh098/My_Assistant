import React from 'react'

function Card({ image, title = '', subtitle = '', onClick, selected = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full max-w-sm rounded-xl overflow-hidden shadow-lg transform transition shadow-black/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer ${selected ? 'ring-4 ring-indigo-500' : ''}`}
      aria-pressed={selected}
    >
      <div className="relative h-64 bg-gray-900">
        <img src={image} alt={title || 'preview'} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" aria-hidden />

        {/* selection checkmark (top-right) */}
        {selected && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        <div className="absolute left-3 bottom-3 right-3 text-white">
          {title && <h3 className="text-sm font-semibold drop-shadow">{title}</h3>}
          {subtitle && <p className="text-xs text-white/80 mt-1">{subtitle}</p>}
        </div>
      </div>
    </button>
  )
}

export default Card
