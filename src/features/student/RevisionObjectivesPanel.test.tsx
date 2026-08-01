import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RevisionObjectivesPanel } from '../../components/RevisionObjectivesPanel';

const objectives = ['Explain the first idea.', 'Apply the second idea.'];

function renderPanel(supplementKeys: string[] = []) {
  return render(
    <RevisionObjectivesPanel
      objectives={objectives}
      supplementKeys={supplementKeys}
      topicName="4.3 Logic gates and Truth tables"
    />,
  );
}

describe('RevisionObjectivesPanel', () => {
  it('is closed by default, toggles natively, and uses ordered-list semantics', () => {
    const { container } = renderPanel();
    const details = container.querySelector('details');
    const summary = container.querySelector('summary');

    expect(details?.tagName).toBe('DETAILS');
    expect(summary?.tagName).toBe('SUMMARY');
    expect(details).not.toHaveAttribute('open');
    fireEvent.click(summary!);
    expect(details).toHaveAttribute('open');

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Explain the first idea.')).toBeInTheDocument();
  });

  it('renders the logic-gate diagrams and semantic truth tables only for their key', () => {
    const { container } = renderPanel(['logic_gates_reference']);
    fireEvent.click(container.querySelector('summary')!);

    expect(screen.getByRole('img', { name: 'AND gate with inputs A and B and output Q' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'OR gate with inputs A and B and output Q' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'NOT gate with input A and output Q' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Combined example: A AND B, then OR C, produces Q' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'AND and OR truth table' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'NOT truth table' })).toBeInTheDocument();
    expect(screen.queryByText('OCR flowchart symbols')).not.toBeInTheDocument();
  });

  it('renders all six flowchart references only for their key', () => {
    const { container } = renderPanel(['flowchart_symbols_reference']);
    fireEvent.click(container.querySelector('summary')!);

    expect(screen.getAllByRole('img')).toHaveLength(6);
    expect(screen.getByRole('img', { name: 'Terminal (start or stop) flowchart symbol' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Flow line flowchart symbol' })).toBeInTheDocument();
    expect(screen.queryByText('Logic gates and truth tables')).not.toBeInTheDocument();
  });

  it('ignores unknown supplement keys and renders nothing for empty objectives', () => {
    const { container, rerender } = renderPanel(['future_unknown_key']);
    fireEvent.click(container.querySelector('summary')!);
    expect(screen.queryByText('Essential reference')).not.toBeInTheDocument();

    rerender(
      <RevisionObjectivesPanel
        objectives={[]}
        supplementKeys={['logic_gates_reference']}
        topicName="Empty topic"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
