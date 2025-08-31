"use client"
const quotes = [
  {
    name: "Ava Thompson",
    role: "Product Manager",
    quote: "NoteFlow is the first note app that disappears when I'm thinking—and reappears when I search.",
  },
  {
    name: "Kenji Sato",
    role: "Engineer",
    quote: "Blazing search, clean UI, and offline writes. It nailed the fundamentals.",
  },
  {
    name: "María López",
    role: "Researcher",
    quote: "I switched my entire workflow in a day. Organization finally makes sense.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by focused teams</h2>
          <p className="mt-3 text-gray-600">Real stories from people shipping great work with NoteFlow.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="border border-gray-200 rounded-xl p-6 bg-white">
              <blockquote className="text-gray-800">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{q.name}</span> &middot; {q.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
