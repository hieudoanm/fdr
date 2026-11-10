import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CuisineSelect } from '../CuisineSelect';
import { FIXTURE_CUISINES } from '../__fixtures__/fixtures';

const setup = (value = 'all', onChange = jest.fn()) => {
  render(
    <CuisineSelect
      cuisines={FIXTURE_CUISINES}
      value={value}
      onChange={onChange}
    />
  );
  return { onChange };
};

describe('CuisineSelect', () => {
  it('shows All Cuisines when nothing is selected', () => {
    setup();
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      'All Cuisines'
    );
    expect(screen.queryByTestId('cuisine-select-menu')).not.toBeInTheDocument();
  });

  it('shows the selected cuisine emoji and label', () => {
    setup('japanese');
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      'Japan'
    );
    expect(screen.getByTestId('cuisine-select-trigger')).toHaveTextContent(
      '🇯🇵'
    );
  });

  it('opens a menu listing all cuisines plus the all option', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    const menu = screen.getByTestId('cuisine-select-menu');
    expect(screen.getByTitle('Italy')).toBeInTheDocument();
    expect(screen.getByTitle('Japan')).toBeInTheDocument();
    expect(
      within(menu).getByRole('option', { name: /All Cuisines/ })
    ).toBeInTheDocument();
  });

  it('selecting a cuisine reports its value and closes', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByTitle('Japan'));
    expect(onChange).toHaveBeenCalledWith('japanese');
    expect(screen.queryByTestId('cuisine-select-menu')).not.toBeInTheDocument();
  });

  it('selecting the all option reports "all" and closes', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('japanese');
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    await user.click(screen.getByRole('option', { name: /All Cuisines/ }));
    expect(onChange).toHaveBeenCalledWith('all');
    expect(screen.queryByTestId('cuisine-select-menu')).not.toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    expect(screen.getByTestId('cuisine-select-menu')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByTestId('cuisine-select-menu')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    expect(screen.getByTestId('cuisine-select-menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('cuisine-select-menu')).not.toBeInTheDocument();
  });

  it('focuses the selected option when the menu opens', async () => {
    const user = userEvent.setup();
    setup('japanese');
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    const menu = screen.getByTestId('cuisine-select-menu');
    expect(within(menu).getByTitle('Japan')).toHaveFocus();
  });

  it('moves focus with arrow keys and wraps around', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    const menu = screen.getByTestId('cuisine-select-menu');
    const options = within(menu).getAllByRole('option');
    expect(options[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(options[1]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(options[2]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(options[0]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(options[2]).toHaveFocus();
  });

  it('jumps to first and last options with Home and End', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('cuisine-select-trigger'));
    const menu = screen.getByTestId('cuisine-select-menu');
    const options = within(menu).getAllByRole('option');

    await user.keyboard('{End}');
    expect(options[2]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(options[0]).toHaveFocus();
  });

  it('returns focus to the trigger on Escape and on selection', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    const trigger = screen.getByTestId('cuisine-select-trigger');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByTitle('Japan'));
    expect(onChange).toHaveBeenCalledWith('japanese');
    expect(trigger).toHaveFocus();
  });
});
