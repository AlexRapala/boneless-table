type ExampleCodeProps = {
  children: string
  title?: string
}

export function ExampleCode({ children, title = 'Code for this example' }: ExampleCodeProps) {
  return (
    <details className="mt-5 rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-800">
        {title}
      </summary>
      <pre className="max-h-120 overflow-auto border-t border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        <code>{children}</code>
      </pre>
    </details>
  )
}
