import { isSameWeek } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { MdToday } from 'react-icons/md'
import { DatePicker } from 'react-nice-dates'

interface SelectorProps {
  selectedDate: Date
  setSelectedDate: (date: Date | null) => void
}

const DateSelector = ({ selectedDate, setSelectedDate }: SelectorProps) => {
  const modifiers = {
    highlight: (date: Date) =>
      isSameWeek(date, selectedDate, {
        weekStartsOn: 1,
      }),
  }
  const modifiersClassNames = {
    highlight: '-highlight',
  }

  return (
    <div className="flex gap-2">
      <button
        aria-label="Previous Day"
        onClick={() => {
          const previousDay = new Date(selectedDate)
          previousDay.setDate(previousDay.getDate() - 1)
          setSelectedDate(previousDay)
        }}
        className="h-[42px] self-end border border-solid border-zinc-700 text-zinc-300 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-zinc-400/15 focus:bg-zinc-400/15 
  focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-400 focus-visible:ring-offset-opacity-50"
      >
        <IoIosArrowBack />
      </button>
      <DatePicker
        date={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        locale={enGB}
      >
        {({ inputProps, focused }) => (
          <div className="flex flex-col">
            <label
              className="text-zinc-400 text-xs font-semibold pb-2"
              htmlFor="selectedDate"
            >
              Selected Date
            </label>
            <input
              id="selectedDate"
              className={
                'rounded border border-zinc-700 bg-transparent py-2 px-3 text-base transition-colors placeholder:text-zinc-500 hover:border-zinc-200 focus:border-orange-yellow focus:outline-none' +
                (focused ? ' -focused' : '')
              }
              {...inputProps}
            />
          </div>
        )}
      </DatePicker>
      <button
        aria-label="Next Day"
        onClick={() => {
          const nextDay = new Date(selectedDate)
          nextDay.setDate(nextDay.getDate() + 1)
          setSelectedDate(nextDay)
        }}
        className="h-[42px] self-end border border-solid border-zinc-700 text-zinc-300 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-zinc-400/15 focus:bg-zinc-400/15 
  focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-400 focus-visible:ring-offset-opacity-50"
      >
        <IoIosArrowForward />
      </button>
      <button
        aria-label="Today"
        title="Today"
        onClick={() => {
          setSelectedDate(new Date())
        }}
        className="h-[42px] self-end border border-solid border-zinc-700 text-zinc-300 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-zinc-400/15 focus:bg-zinc-400/15 
  focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-400 focus-visible:ring-offset-opacity-50"
      >
        <MdToday />
      </button>
    </div>
  )
}

export default DateSelector
