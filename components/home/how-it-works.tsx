"use client"
const steps = [
  { title: "Capture", desc: "Create a note instantly with keyboard-first controls." },
  { title: "Organize", desc: "Add tags, pin important notes, and group by folders." },
  { title: "Find", desc: "Search across titles, content, and tags in milliseconds." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How it works</h2>
          <p className="mt-3 text-gray-600">Three simple steps to a calmer, more organized mind.</p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border border-gray-200 rounded-xl p-6 bg-white relative">
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
