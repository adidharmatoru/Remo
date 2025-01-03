import { describe, it, expect, vi, beforeEach } from 'vitest';
import { keyboardControl } from '../../composables/controls/keyboardControl';

describe('keyboardControl', () => {
  let keyboard;
  const mockEventChannel = {
    value: {
      readyState: 'open',
      send: vi.fn()
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    keyboard = keyboardControl(mockEventChannel);
  });

  it('should initialize with keyboard disabled', () => {
    expect(keyboard.keyboardEnabled.value).toBe(false);
  });

  it('should toggle keyboard control', () => {
    keyboard.toggleKeyboard();
    expect(keyboard.keyboardEnabled.value).toBe(true);

    keyboard.toggleKeyboard();
    expect(keyboard.keyboardEnabled.value).toBe(false);
  });

  it('should handle keydown events when enabled', () => {
    keyboard.toggleKeyboard();

    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    document.dispatchEvent(event);

    expect(mockEventChannel.value.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'key_down',
        key: 'KeyA'
      })
    );
  });

  it('should handle keyup events when enabled', () => {
    keyboard.toggleKeyboard();

    const event = new KeyboardEvent('keyup', { code: 'KeyA' });
    document.dispatchEvent(event);

    expect(mockEventChannel.value.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'key_up',
        key: 'KeyA'
      })
    );
  });

  it('should handle event channel not ready', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    mockEventChannel.value.readyState = 'closed';

    keyboard.toggleKeyboard();
    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    document.dispatchEvent(event);

    expect(consoleSpy).toHaveBeenCalledWith('Event channel not ready');
  });

  it('should cleanup properly', () => {
    keyboard.toggleKeyboard();
    keyboard.cleanup();

    expect(keyboard.keyboardEnabled.value).toBe(false);

    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    document.dispatchEvent(event);
    expect(mockEventChannel.value.send).not.toHaveBeenCalled();
  });
});