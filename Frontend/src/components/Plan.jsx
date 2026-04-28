const statusStyles = {
  available: 'bg-emerald-500',
  booked: 'bg-red-500',
};

const Plan = ({ desks, selectedDeskId, isDark, onSelectDesk }) => (
  <article className={`rounded-2xl border p-2 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
    <div className={`mb-1 flex items-center gap-5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        Свободно
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        Занято
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-blue-500" />
        Выбрано
      </span>
    </div>

    <div className={`relative h-[calc(100%-22px)] rounded-xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {desks.map((desk) => {
        const isSelected = desk.id === selectedDeskId;

        return (
          <button
            key={desk.id}
            type="button"
            onClick={() => onSelectDesk(desk.id)}
            style={{
              left: desk.left,
              right: desk.right,
              top: desk.top,
              bottom: desk.bottom,
              width: desk.width,
              height: desk.height,
            }}
            className={`absolute border-2 text-xs font-semibold transition ${
              isSelected
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : isDark
                  ? 'border-slate-600 bg-slate-900 text-slate-200 hover:border-blue-500'
                  : 'border-slate-400 bg-white text-slate-700 hover:border-blue-500'
            }`}
          >
            {desk.trackable !== false && (
              <span className={`absolute right-1 top-1 h-3 w-3 rounded-full ${statusStyles[desk.status]}`} />
            )}
            <span>{desk.id}</span>
          </button>
        );
      })}

    </div>
  </article>
);

export default Plan;
