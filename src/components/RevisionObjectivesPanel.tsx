import { ChevronRight } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Panel } from './ui/Panel';
import type { RevisionSupplementKey } from '../types/domain';

interface RevisionObjectivesPanelProps {
  topicName: string;
  objectives: string[];
  supplementKeys: readonly (RevisionSupplementKey | string)[];
}

interface DiagramProps {
  title: string;
  children: ReactNode;
}

const tableHeadingClassName = 'border border-[#c9c7e3] bg-[#ecebff] px-3 py-2 text-center text-sm font-bold';
const tableCellClassName = 'border border-[#c9c7e3] px-3 py-2 text-center text-sm font-semibold';

function Diagram({ title, children }: DiagramProps) {
  const titleId = useId();
  return (
    <figure className="rounded-app border border-[#dedbf0] bg-white p-4">
      <svg aria-labelledby={titleId} className="mx-auto h-auto w-full max-w-[280px] text-[#202a6f]" role="img" viewBox="0 0 220 160">
        <title id={titleId}>{title}</title>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-sm font-bold text-ink">{title}</figcaption>
    </figure>
  );
}

function LogicGatesReference() {
  return (
    <section aria-labelledby="logic-gates-reference-title" className="border-t border-[#dedbf0] bg-[#f7faff] p-4 lg:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Essential reference</p>
        <h5 className="mt-1 text-lg font-bold text-ink" id="logic-gates-reference-title">Logic gates and truth tables</h5>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Diagram title="AND gate with inputs A and B and output Q">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
            <path d="M62 35h42a45 45 0 0 1 0 90H62Z" />
            <path d="M22 60h40M22 100h40M149 80h45" />
          </g>
          <g fill="currentColor" fontSize="14" fontWeight="700"><text x="8" y="64">A</text><text x="8" y="104">B</text><text x="198" y="84">Q</text></g>
        </Diagram>
        <Diagram title="OR gate with inputs A and B and output Q">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
            <path d="M58 35c38 0 68 12 94 45-26 33-56 45-94 45 14-25 14-65 0-90Z" />
            <path d="M22 60h48M22 100h48M152 80h42" />
          </g>
          <g fill="currentColor" fontSize="14" fontWeight="700"><text x="8" y="64">A</text><text x="8" y="104">B</text><text x="198" y="84">Q</text></g>
        </Diagram>
        <Diagram title="NOT gate with input A and output Q">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
            <path d="M58 42v76l70-38Z" />
            <circle cx="137" cy="80" r="9" />
            <path d="M22 80h36M146 80h48" />
          </g>
          <g fill="currentColor" fontSize="14" fontWeight="700"><text x="8" y="84">A</text><text x="198" y="84">Q</text></g>
        </Diagram>
        <Diagram title="Combined example: A AND B, then OR C, produces Q">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M44 34h25a27 27 0 0 1 0 54H44Z" />
            <path d="M16 48h28M16 74h28M96 61h27M16 116h108" />
            <path d="M116 47c26 0 43 8 60 34-17 26-34 34-60 34 10-21 10-47 0-68Z" />
            <path d="M176 81h25" />
          </g>
          <g fill="currentColor" fontSize="12" fontWeight="700"><text x="4" y="51">A</text><text x="4" y="77">B</text><text x="4" y="120">C</text><text x="204" y="85">Q</text></g>
        </Diagram>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-app border border-[#dedbf0] bg-white p-4">
          <table className="w-full border-collapse text-ink">
            <caption className="mb-3 text-left font-bold">AND and OR truth table</caption>
            <thead><tr><th className={tableHeadingClassName} scope="col">A</th><th className={tableHeadingClassName} scope="col">B</th><th className={tableHeadingClassName} scope="col">A AND B</th><th className={tableHeadingClassName} scope="col">A OR B</th></tr></thead>
            <tbody>{[['0', '0', '0', '0'], ['0', '1', '0', '1'], ['1', '0', '0', '1'], ['1', '1', '1', '1']].map((row) => <tr key={row.join('')} >{row.map((value, index) => <td className={tableCellClassName} key={`${row.join('')}-${index}`}>{value}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-app border border-[#dedbf0] bg-white p-4">
          <table className="w-full border-collapse text-ink">
            <caption className="mb-3 text-left font-bold">NOT truth table</caption>
            <thead><tr><th className={tableHeadingClassName} scope="col">A</th><th className={tableHeadingClassName} scope="col">NOT A</th></tr></thead>
            <tbody>{[['0', '1'], ['1', '0']].map((row) => <tr key={row.join('')} >{row.map((value, index) => <td className={tableCellClassName} key={`${row.join('')}-${index}`}>{value}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FlowchartSymbol({ title, children }: DiagramProps) {
  const titleId = useId();
  return (
    <figure className="rounded-app border border-[#dedbf0] bg-white p-4">
      <svg aria-labelledby={titleId} className="mx-auto h-auto w-full max-w-[220px] text-[#202a6f]" role="img" viewBox="0 0 220 120">
        <title id={titleId}>{title} flowchart symbol</title>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-sm font-bold text-ink">{title}</figcaption>
    </figure>
  );
}

function FlowchartSymbolsReference() {
  const symbolStroke = { fill: '#f7faff', stroke: 'currentColor', strokeWidth: 4 };
  return (
    <section aria-labelledby="flowchart-symbols-reference-title" className="border-t border-[#dedbf0] bg-[#f7faff] p-4 lg:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Essential reference</p>
      <h5 className="mt-1 text-lg font-bold text-ink" id="flowchart-symbols-reference-title">OCR flowchart symbols</h5>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <FlowchartSymbol title="Terminal (start or stop)"><rect height="54" rx="27" style={symbolStroke} width="150" x="35" y="33" /><text fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="110" y="65">START / STOP</text></FlowchartSymbol>
        <FlowchartSymbol title="Process"><rect height="60" style={symbolStroke} width="150" x="35" y="30" /><text fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="110" y="65">PROCESS</text></FlowchartSymbol>
        <FlowchartSymbol title="Input or output"><path d="M52 30h145l-29 60H23Z" style={symbolStroke} /><text fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="110" y="65">INPUT / OUTPUT</text></FlowchartSymbol>
        <FlowchartSymbol title="Decision"><path d="m110 18 78 42-78 42-78-42Z" style={symbolStroke} /><text fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="110" y="65">DECISION</text></FlowchartSymbol>
        <FlowchartSymbol title="Subprogram"><rect height="60" style={symbolStroke} width="150" x="35" y="30" /><path d="M52 30v60M168 30v60" fill="none" stroke="currentColor" strokeWidth="4" /><text fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle" x="110" y="65">SUBPROGRAM</text></FlowchartSymbol>
        <FlowchartSymbol title="Flow line"><defs><marker id="flow-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="6" refY="4"><path d="M0 0 8 4 0 8Z" fill="currentColor" /></marker></defs><path d="M35 60h145" fill="none" markerEnd="url(#flow-arrow)" stroke="currentColor" strokeWidth="4" /></FlowchartSymbol>
      </div>
    </section>
  );
}

function RevisionSupplement({ supplementKey }: { supplementKey: RevisionSupplementKey | string }) {
  if (supplementKey === 'logic_gates_reference') return <LogicGatesReference />;
  if (supplementKey === 'flowchart_symbols_reference') return <FlowchartSymbolsReference />;
  return null;
}

export function RevisionObjectivesPanel({ topicName, objectives, supplementKeys }: RevisionObjectivesPanelProps) {
  if (!objectives.length) return null;

  return (
    <Panel className="overflow-hidden p-0" tone="light">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[linear-gradient(135deg,#202a6f_0%,#43308f_100%)] px-5 py-5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white [&::-webkit-details-marker]:hidden lg:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9dfff]">{topicName}</p>
            <h4 className="mt-2 text-xl font-bold lg:text-2xl">For this topic, you must be able to…</h4>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 transition group-open:rotate-90" aria-hidden="true">
            <ChevronRight size={21} />
          </span>
        </summary>
        <ol className="grid gap-3 bg-white p-4 lg:grid-cols-2 lg:p-6">
          {objectives.map((objective, index) => (
            <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-app border border-[#dedbf0] bg-[#f7faff] p-4 text-sm font-semibold leading-6 text-ink" key={objective}>
              <span className="grid size-8 place-items-center rounded-full bg-[#554fd1] font-bold text-white" aria-hidden="true">{index + 1}</span>
              <span>{objective}</span>
            </li>
          ))}
        </ol>
        {supplementKeys.map((supplementKey) => <RevisionSupplement key={supplementKey} supplementKey={supplementKey} />)}
      </details>
    </Panel>
  );
}
