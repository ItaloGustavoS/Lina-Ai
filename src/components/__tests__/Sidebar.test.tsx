import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { navLinks } from '@/lib/navLinks';
import { useSession } from '@/hooks/useSession';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the useSession hook
jest.mock('@/hooks/useSession');

describe('Sidebar', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  it('renders the sidebar with navigation links and a logout button', () => {
    render(<Sidebar />);

    // Check for the heading
    expect(screen.getByRole('heading', { name: /Lina AI/i })).toBeInTheDocument();

    // Check for all navigation links
    navLinks.forEach(link => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });

    // Check for the logout button
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('calls the logout function when the logout button is clicked', () => {
    render(<Sidebar />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
