"use client"
export function Logos() {
  const items = [
    { name: "Acme Co", src: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Anonymous_emblem.svg" },
    { name: "Lightpad", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Nimbus", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Zenware", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  ]

  return (
    <section aria-label="Trusted by" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-xs uppercase tracking-wide text-gray-500">
          Trusted by teams worldwide
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-center gap-6">
          {items.map((logo) => (
            <div key={logo.name} className="h-10 flex items-center justify-center text-gray-400">
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="opacity-70 max-h-10"
                height={24}
                width={120}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
