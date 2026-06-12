import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../pages/DashboardPage';
import * as localApi from '../services/localApi';

beforeEach(() => {
  localApi.setSimulateChartError(false);
  jest.clearAllMocks();
});

test('renders filter controls on load', () => {
  render(<DashboardPage />);
  expect(screen.getByLabelText(/date range/i)).toBeInTheDocument();
  expect(screen.getByRole('group', { name: /segment filter/i })).toBeInTheDocument();
});

test('shows loading skeletons initially', () => {
  render(<DashboardPage />);
  expect(screen.getByLabelText(/loading chart/i)).toBeInTheDocument();
});

test('renders metric values after summary loads', async () => {
  render(<DashboardPage />);
  await waitFor(() =>
    expect(screen.queryByLabelText(/loading chart/i)).not.toBeInTheDocument(),
    { timeout: 3000 }
  );
  expect(screen.getByText(/total requests/i)).toBeInTheDocument();
  expect(screen.getByText(/active users/i)).toBeInTheDocument();
});

test('shows chart error without hiding metric cards when simulate chart error is toggled', async () => {
  render(<DashboardPage />);

  await waitFor(() =>
    expect(screen.queryByLabelText(/loading chart/i)).not.toBeInTheDocument(),
    { timeout: 3000 }
  );

  localApi.setSimulateChartError(true);

  await act(async () => {
    await userEvent.click(screen.getByLabelText(/simulate chart api error/i));
  });

  await waitFor(() =>
    expect(screen.getByRole('alert')).toBeInTheDocument(),
    { timeout: 3000 }
  );

  expect(screen.getByText(/total requests/i)).toBeInTheDocument();
  expect(screen.getByText(/active users/i)).toBeInTheDocument();
});

test('filter controls are present and interactive', async () => {
  render(<DashboardPage />);

  const select = screen.getByLabelText(/select date range/i);
  expect(select).toBeInTheDocument();

  await act(async () => {
    await userEvent.selectOptions(select, '7d');
  });

  expect((select as HTMLSelectElement).value).toBe('7d');
});

test('segment buttons have correct aria-pressed state', async () => {
  render(<DashboardPage />);

  const allBtn = screen.getByRole('button', { name: /all users/i });
  expect(allBtn).toHaveAttribute('aria-pressed', 'true');

  const proBtn = screen.getByRole('button', { name: /^pro$/i });
  await act(async () => {
    await userEvent.click(proBtn);
  });

  expect(proBtn).toHaveAttribute('aria-pressed', 'true');
  expect(allBtn).toHaveAttribute('aria-pressed', 'false');
});
