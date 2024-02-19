'use client'

import { Habit } from '@/types'
import { MdDeleteOutline } from 'react-icons/md'

interface HabitTableProps {
  habits: Habit[]
  handleDelete: (id: string) => void
}

const HabitTable = ({ habits, handleDelete }: HabitTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-700">
      <table className="border-collapse w-full select-auto text-left text-zinc-400">
        <thead className="pb-2 text-xs [&>tr]:border-b [&>tr]:border-zinc-700 [&>tr]:bg-transparent [&>tr]:hover:bg-transparent ">
          <tr className="[&.selected]:bg-gray-100 [&.inserting]:bg-transparent hover:bg-gray-100">
            <th className="py-3 px-4 font-extrabold w-[65%]">Habit</th>
            <th className="py-3 px-4 font-extrabold">Frequency</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {habits.map(({ id, name, frequencyPerWeek }) => (
            <tr key={id} className="group hover:bg-white/5 hover:text-zinc-200">
              <td className="py-3 px-4">{name}</td>
              <td className="py-3 px-4 flex justify-between">
                {`${frequencyPerWeek}x`}
                <MdDeleteOutline
                  className="text-lg cursor-pointer hover:text-red-400"
                  onClick={() => handleDelete(id)}
                />
              </td>
            </tr>
          ))}
          {habits.length === 0 && (
            <tr className="hover:bg-white/5 hover:text-zinc-200">
              <td colSpan={2} className="py-3 px-4 text-zinc-500 text-center">
                Empty
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default HabitTable
