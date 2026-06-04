import { supabase, Kensho } from '@/lib/supabase'

export const revalidate = 300

async function getKenshoList(): Promise<Kensho[]> {
  const { data } = await supabase
    .from('kensho')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function Home() {
  const list = await getKenshoList()

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-500 text-white py-6 px-4 text-center shadow">
        <h1 className="text-3xl font-bold">LINE懸賞まとめ</h1>
        <p className="mt-1 text-sm">LINEで応募できる懸賞情報をまとめています</p>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-8">
        {list.length === 0 ? (
          <p className="text-center text-gray-500 mt-16">現在掲載中の懸賞はありません</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                )}
                <div>
                  {item.company && (
                    <span className="text-xs text-gray-400">{item.company}</span>
                  )}
                  <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
                {item.deadline && (
                  <p className="text-xs text-red-500">締切：{item.deadline}</p>
                )}
                <a
                  href={item.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  LINEで応募する
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="text-center text-xs text-gray-400 py-8">
        © 2024 LINE懸賞まとめ
      </footer>
    </main>
  )
}
