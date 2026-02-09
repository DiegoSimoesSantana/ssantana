'use client'

import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

interface Stat {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  urgent?: boolean
}

interface StatsGridProps {
  stats: Stat[]
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl shadow-lg p-6 ${
            stat.urgent ? 'ring-2 ring-orange-500' : ''
          }`}
        >
          {stat.urgent && (
            <div className="flex items-center space-x-1 text-orange-600 mb-2">
              <AlertCircle size={16} />
              <span className="text-xs font-semibold">AÇÃO NECESSÁRIA</span>
            </div>
          )}
          
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            {stat.title}
          </h3>
          
          <div className="flex items-baseline space-x-2 mb-2">
            <p className="text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
          
          <div className="flex items-center space-x-1">
            {stat.trend === 'up' && (
              <TrendingUp size={16} className="text-green-500" />
            )}
            {stat.trend === 'down' && (
              <TrendingDown size={16} className="text-red-500" />
            )}
            {stat.trend === 'neutral' && (
              <Minus size={16} className="text-gray-400" />
            )}
            <span className={`text-sm ${
              stat.trend === 'up' ? 'text-green-600' :
              stat.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
