import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { navLinks } from '@/lib/navLinks';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar', () => {
  it('renders the sidebar with navigation links', () => {
    render(<Sidebar />);

    // Check for the heading
    expect(screen.getByRole('heading', { name: /Lina AI/i })).toBeInTheDocument();

    // Check for all navigation links
    navLinks.forEach(link => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });
  });
});
