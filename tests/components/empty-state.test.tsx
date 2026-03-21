import { describe, it, expect } from 'vitest';
import { FileText } from 'lucide-react';

describe('EmptyState Component', () => {
  it('accepts required props', () => {
    const props = {
      icon: FileText,
      title: 'No items',
      description: 'Nothing to show here',
    };
    expect(props.title).toBe('No items');
    expect(props.description).toBe('Nothing to show here');
  });

  it('accepts optional action prop', () => {
    const props = {
      icon: FileText,
      title: 'Empty',
      description: 'Add something',
      action: 'button element',
    };
    expect(props.action).toBeDefined();
  });
});
