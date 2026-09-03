'use client'

import { GripVertical, Plus, Save } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { defineColumns } from 'boneless-table'
import { AdminPage } from '../../../src/components/admin-page'
import { ExampleCode } from '../../../src/components/example-code'
import { ExampleSettings } from '../../../src/components/example-settings'
import { selectionColumnSettings, TableCheckbox } from '../../../src/components/table-checkbox'
import { BonelessTable } from '../../../src/components/themed-boneless-table'

type Task = {
  id: string
  title: string
  owner: string
  estimate: number
  status: 'Backlog' | 'In progress' | 'Done'
}

type ChecklistItem = {
  id: string
  title: string
  complete: boolean
  children?: ChecklistItem[]
}

const initialTasks: Task[] = [
  { id: 'brief', title: 'Confirm the project brief', owner: 'Avery', estimate: 2, status: 'Done' },
  {
    id: 'wireframe',
    title: 'Review checkout wireframes',
    owner: 'Mina',
    estimate: 5,
    status: 'In progress',
  },
  { id: 'copy', title: 'Prepare launch copy', owner: 'Leo', estimate: 3, status: 'Backlog' },
  { id: 'qa', title: 'Schedule accessibility QA', owner: 'Zara', estimate: 4, status: 'Backlog' },
]

const initialChecklist: ChecklistItem[] = [
  {
    id: 'launch',
    title: 'Launch checklist',
    complete: false,
    children: [
      { id: 'legal', title: 'Approve legal copy', complete: true },
      { id: 'billing', title: 'Verify production billing', complete: false },
    ],
  },
  {
    id: 'campaign',
    title: 'Campaign assets',
    complete: false,
    children: [
      { id: 'email', title: 'Finalize email sequence', complete: false },
      { id: 'social', title: 'Schedule social posts', complete: false },
    ],
  },
]

const code = `<BonelessTable
  data={tasks}
  columns={taskColumns}
  getRowId={(task) => task.id}
  resultLabel="tasks"
  resultHint="Editable task list"
/>

<BonelessTable
  data={checklist}
  columns={checklistColumns}
  getRowId={(item) => item.id}
  getSubRows={(item) => item.children}
  tree={{ columnId: 'title', indentPx: 18 }}
  resultLabel="checklist items"
  resultHint="Editable nested checklist"
/>`

function updateTask(tasks: Task[], id: string, patch: Partial<Task>) {
  return tasks.map((task) => (task.id === id ? { ...task, ...patch } : task))
}

function updateChecklist(
  items: ChecklistItem[],
  id: string,
  patch: Partial<ChecklistItem>,
): ChecklistItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, ...patch }
      : {
          ...item,
          children: item.children ? updateChecklist(item.children, id, patch) : undefined,
        },
  )
}

function flattenChecklist(items: ChecklistItem[]): ChecklistItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenChecklist(item.children) : [])])
}

function TaskDragHandle({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })

  return (
    <button
      aria-label={`Drag ${label}`}
      className="cursor-grab touch-none text-slate-400 active:cursor-grabbing"
      data-dragging={isDragging || undefined}
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={17} />
    </button>
  )
}

function TaskDropTarget({
  children,
  className,
  rowId,
  slot,
}: {
  children: ReactNode
  className?: string
  rowId: string
  slot: string
}) {
  const { active, over } = useDndContext()
  const { setNodeRef } = useDroppable({
    id: `drop-${rowId}-${slot}`,
    data: { rowId },
  })
  const isRowOver = over?.data.current?.rowId === rowId
  const isActiveRow = active?.id === rowId

  return (
    <div
      className={`-mx-2.5 -my-2 flex min-h-14.5 w-[calc(100%_+_1.25rem)] items-center px-2.5 ${className ?? ''} ${isActiveRow ? 'opacity-35' : ''} ${isRowOver ? 'bg-teal-100 outline-2 outline-teal-500 outline-dashed' : ''}`}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

function TaskDragPreview({ task }: { task: Task }) {
  return (
    <div className="grid w-[42rem] grid-cols-[2.5rem_minmax(0,1.6fr)_minmax(7rem,1fr)_5rem_8rem] items-center rounded-lg border border-teal-500 bg-white px-2.5 py-3 text-sm text-slate-700 shadow-xl ring-4 ring-teal-100">
      <span className="text-slate-400">
        <GripVertical size={17} />
      </span>
      <strong className="truncate text-slate-900">{task.title}</strong>
      <span className="truncate">{task.owner}</span>
      <span className="text-right">{task.estimate}h</span>
      <span className="text-right">{task.status}</span>
    </div>
  )
}

export default function FormControlsPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [taskSelection, setTaskSelection] = useState<string[]>([])
  const [checklist, setChecklist] = useState(initialChecklist)
  const [checklistSelection, setChecklistSelection] = useState<string[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string>()
  const tasksRef = useRef(tasks)
  const taskSelectionRef = useRef(taskSelection)
  const checklistRef = useRef(checklist)
  const checklistSelectionRef = useRef(checklistSelection)

  tasksRef.current = tasks
  taskSelectionRef.current = taskSelection
  checklistRef.current = checklist
  checklistSelectionRef.current = checklistSelection

  const moveTask = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return
    setTasks((current) => {
      const from = current.findIndex((task) => task.id === sourceId)
      const to = current.findIndex((task) => task.id === targetId)
      if (from < 0 || to < 0) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved!)
      return next
    })
  }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const activeTask = activeTaskId ? tasks.find((task) => task.id === activeTaskId) : undefined

  const taskColumns = useMemo(
    () =>
      defineColumns<Task>([
        {
          id: 'select',
          header: () => (
            <TableCheckbox
              aria-label="Select all tasks"
              checked={
                tasksRef.current.length > 0 &&
                tasksRef.current.every((task) => taskSelectionRef.current.includes(task.id))
              }
              indeterminate={
                taskSelectionRef.current.length > 0 &&
                taskSelectionRef.current.length < tasksRef.current.length
              }
              onChange={() =>
                setTaskSelection((current) =>
                  current.length === tasksRef.current.length
                    ? []
                    : tasksRef.current.map((task) => task.id),
                )
              }
            />
          ),
          cell: ({ row }) => (
            <TableCheckbox
              aria-label={`Select ${row.original.title}`}
              checked={taskSelectionRef.current.includes(row.original.id)}
              onChange={() =>
                setTaskSelection((current) =>
                  current.includes(row.original.id)
                    ? current.filter((id) => id !== row.original.id)
                    : [...current, row.original.id],
                )
              }
            />
          ),
          enableSorting: false,
          meta: { bonelessTable: selectionColumnSettings },
        },
        {
          id: 'drag',
          header: 'Order',
          cell: ({ row }) => (
            <TaskDropTarget rowId={row.original.id} slot="drag">
              <TaskDragHandle id={row.original.id} label={row.original.title} />
            </TaskDropTarget>
          ),
          enableSorting: false,
          meta: { bonelessTable: { sizing: { minPx: 58, flex: 0.3 } } },
        },
        {
          key: 'title',
          header: 'Task',
          cell: ({ row, getValue }) => (
            <TaskDropTarget rowId={row.original.id} slot="title">
              <input
                aria-label="Task title"
                className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 outline-none hover:border-slate-200 focus:border-teal-500 focus:bg-white"
                value={getValue<string>()}
                onChange={(event) =>
                  setTasks((current) =>
                    updateTask(current, row.original.id, { title: event.target.value }),
                  )
                }
              />
            </TaskDropTarget>
          ),
          meta: { bonelessTable: { sizing: { minPx: 240, flex: 1.6 } } },
        },
        {
          key: 'owner',
          header: 'Owner',
          cell: ({ row, getValue }) => (
            <TaskDropTarget rowId={row.original.id} slot="owner">
              <input
                aria-label="Task owner"
                className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 outline-none hover:border-slate-200 focus:border-teal-500 focus:bg-white"
                value={getValue<string>()}
                onChange={(event) =>
                  setTasks((current) =>
                    updateTask(current, row.original.id, { owner: event.target.value }),
                  )
                }
              />
            </TaskDropTarget>
          ),
          meta: { bonelessTable: { sizing: { minPx: 130 } } },
        },
        {
          key: 'estimate',
          header: 'Hours',
          cell: ({ row, getValue }) => (
            <TaskDropTarget rowId={row.original.id} slot="estimate">
              <input
                aria-label="Estimated hours"
                className="w-16 rounded border border-transparent bg-transparent px-1.5 py-1 text-right outline-none hover:border-slate-200 focus:border-teal-500 focus:bg-white"
                min="0"
                type="number"
                value={getValue<number>()}
                onChange={(event) =>
                  setTasks((current) =>
                    updateTask(current, row.original.id, {
                      estimate: Number(event.target.value) || 0,
                    }),
                  )
                }
              />
            </TaskDropTarget>
          ),
          meta: { bonelessTable: { sizing: { minPx: 90 }, align: 'right' } },
        },
        {
          key: 'status',
          header: 'Status',
          cell: ({ row, getValue }) => (
            <TaskDropTarget rowId={row.original.id} slot="status">
              <select
                aria-label="Task status"
                className="rounded border border-slate-200 bg-white px-1.5 py-1 text-sm outline-none focus:border-teal-500"
                value={getValue<string>()}
                onChange={(event) =>
                  setTasks((current) =>
                    updateTask(current, row.original.id, {
                      status: event.target.value as Task['status'],
                    }),
                  )
                }
              >
                <option>Backlog</option>
                <option>In progress</option>
                <option>Done</option>
              </select>
            </TaskDropTarget>
          ),
          meta: { bonelessTable: { sizing: { minPx: 145 } } },
        },
      ]),
    [],
  )

  const checklistColumns = useMemo(
    () =>
      defineColumns<ChecklistItem>([
        {
          id: 'select',
          header: () => (
            <TableCheckbox
              aria-label="Select all checklist items"
              checked={
                flattenChecklist(checklistRef.current).length > 0 &&
                flattenChecklist(checklistRef.current).every((item) =>
                  checklistSelectionRef.current.includes(item.id),
                )
              }
              indeterminate={
                checklistSelectionRef.current.length > 0 &&
                checklistSelectionRef.current.length < flattenChecklist(checklistRef.current).length
              }
              onChange={() => {
                const ids = flattenChecklist(checklistRef.current).map((item) => item.id)
                setChecklistSelection((current) => (current.length === ids.length ? [] : ids))
              }}
            />
          ),
          cell: ({ row }) => (
            <TableCheckbox
              aria-label={`Select ${row.original.title}`}
              checked={checklistSelectionRef.current.includes(row.original.id)}
              onChange={() =>
                setChecklistSelection((current) =>
                  current.includes(row.original.id)
                    ? current.filter((id) => id !== row.original.id)
                    : [...current, row.original.id],
                )
              }
            />
          ),
          enableSorting: false,
          meta: { bonelessTable: selectionColumnSettings },
        },
        {
          key: 'title',
          header: () => <span className="pl-6.5">Checklist item</span>,
          cell: ({ row, getValue }) => (
            <input
              aria-label="Checklist item"
              className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 outline-none hover:border-slate-200 focus:border-teal-500 focus:bg-white"
              value={getValue<string>()}
              onChange={(event) =>
                setChecklist((current) =>
                  updateChecklist(current, row.original.id, { title: event.target.value }),
                )
              }
            />
          ),
          meta: { bonelessTable: { sizing: { minPx: 280, flex: 1.7 } } },
        },
        {
          key: 'complete',
          header: 'Complete',
          cell: ({ row, getValue }) => (
            <TableCheckbox
              aria-label={`Mark ${row.original.title} complete`}
              checked={getValue<boolean>()}
              onChange={(event) =>
                setChecklist((current) =>
                  updateChecklist(current, row.original.id, { complete: event.target.checked }),
                )
              }
            />
          ),
          meta: { bonelessTable: { sizing: { minPx: 120 }, align: 'right' } },
        },
      ]),
    [],
  )

  return (
    <AdminPage title="Form controls">
      <section className="space-y-7">
        <div className="flex items-end justify-between gap-4 max-sm:items-start">
          <div>
            <h2 className="text-lg font-bold">Editable tables as controlled form fields</h2>
            <p className="mt-1 max-w-3xl text-slate-500">
              Inputs own the application data; TanStack owns sorting, expansion, and selection
              state. Try editing a value, selecting rows, or dragging a task by its handle.
            </p>
            <ExampleSettings
              items={[
                { name: 'custom cells', description: 'connect inputs to local form state' },
                { name: 'getRowId', description: 'gives drag and selection stable identifiers' },
                { name: 'getSubRows + tree', description: 'make the checklist nested' },
              ]}
            />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white">
            <Save size={16} /> Save draft
          </button>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">Flat task editor</h3>
              <p className="text-sm text-slate-500">
                {taskSelection.length} selected · drag rows to change form order
              </p>
            </div>
            <button
              onClick={() =>
                setTasks((current) => [
                  ...current,
                  {
                    id: crypto.randomUUID(),
                    title: 'New task',
                    owner: 'Unassigned',
                    estimate: 1,
                    status: 'Backlog',
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm font-bold text-slate-700"
            >
              <Plus size={16} /> Add task
            </button>
          </div>
          <DndContext
            collisionDetection={pointerWithin}
            onDragCancel={() => setActiveTaskId(undefined)}
            onDragEnd={({ active, over }) => {
              const targetId = over?.data.current?.rowId
              if (targetId) moveTask(String(active.id), targetId)
              setActiveTaskId(undefined)
            }}
            onDragStart={({ active }) => setActiveTaskId(String(active.id))}
            sensors={sensors}
          >
            <BonelessTable
              data={tasks}
              columns={taskColumns}
              getRowId={(task) => task.id}
              resultHint="Editable task list"
              resultLabel="tasks"
            />
            <DragOverlay dropAnimation={null}>
              {activeTask ? <TaskDragPreview task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </section>

        <section>
          <div className="mb-3">
            <h3 className="font-bold">Tree checklist</h3>
            <p className="text-sm text-slate-500">
              {checklistSelection.length} selected · selection and editable inputs work at every
              depth
            </p>
          </div>
          <BonelessTable
            data={checklist}
            columns={checklistColumns}
            getRowId={(item) => item.id}
            getSubRows={(item) => item.children}
            tree={{ columnId: 'title', indentPx: 18 }}
            resultHint="Editable nested checklist"
            resultLabel="checklist items"
          />
        </section>
        <ExampleCode>{code}</ExampleCode>
      </section>
    </AdminPage>
  )
}
