type ExampleSetting = {
  name: string
  description: string
}

type ExampleSettingsProps = {
  items: readonly ExampleSetting[]
}

/** A consistent, compact explanation of the table settings demonstrated on a screen. */
export function ExampleSettings({ items }: ExampleSettingsProps) {
  return (
    <dl className="mt-4 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5">
      {items.map((item) => (
        <div className="rounded-md bg-white px-2.5 py-1.5 shadow-xs" key={item.name}>
          <dt className="inline font-mono font-bold text-slate-800">{item.name}</dt>
          <dd className="inline text-slate-500"> — {item.description}</dd>
        </div>
      ))}
    </dl>
  )
}
