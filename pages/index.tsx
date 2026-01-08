import useSWR from 'swr'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type DayItem = { date: string; count: number }
type Stats = { total: number; days: DayItem[] }

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Page() {
  const { data, error, mutate } = useSWR<Stats>('/api/stats', fetcher, { refreshInterval: 30000 })

  useEffect(() => {
    // opcional: refetch on focus
    const onFocus = () => mutate()
    window.addEventListener('visibilitychange', onFocus)
    return () => window.removeEventListener('visibilitychange', onFocus)
  }, [mutate])

  if (error) return <div className="container"><div className="card">Erro ao carregar estatísticas.</div></div>
  if (!data) return <div className="container"><div className="card">Carregando...</div></div>

  const labels = data.days.map(d => d.date)
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Visitas por dia',
        data: data.days.map(d => d.count),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6,182,212,0.12)',
        tension: 0.2,
      },
    ],
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Estatísticas do site</h1>
          <div className="small">Total de visitas acumuladas</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:28,fontWeight:700}}>{data.total}</div>
          <div className="small">atualizado automaticamente</div>
        </div>
      </div>

      <div className="card">
        <div style={{marginBottom:12}} className="small">Últimos 7 dias</div>
        <Line data={chartData} />
        <div className="list">
          <ul>
            {data.days.map(d => <li key={d.date}>{d.date}: {d.count}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
