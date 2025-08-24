import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { navLinks } from '@/lib/navLinks';
import { useSession } from '@/hooks/useSession';

import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { navLinks } from '@/lib/navLinks';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';

// Mock the next/navigation hooks
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the useSession hook
jest.mock('@/hooks/useSession');

describe('Sidebar', () => {
  const mockLogout = jest.fn().mockResolvedValue(null);

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  it('renders the sidebar with navigation links and a logout button', () => {
    render(<Sidebar />);
    expect(screen.getByRole('heading', { name: /Lina AI/i })).toBeInTheDocument();
    navLinks.forEach(link => {
      expect(screen.getByRole('link', { name: link.label })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('calls the logout function and redirects to /login when the logout button is clicked', async () => {
    render(<Sidebar />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
