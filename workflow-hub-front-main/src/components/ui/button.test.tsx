import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
    it('renders with correct text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles variant prop correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');
    });

    it('handles size prop correctly', () => {
        render(<Button size="sm">Small button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-9');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled button</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
