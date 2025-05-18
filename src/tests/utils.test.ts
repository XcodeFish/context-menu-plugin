import { calculatePosition, MenuError, ErrorCodes, handleError, debounce } from '../shared/utils';
import { t, setLocale } from '../shared/i18n';

describe('Menu Utils Tests', () => {
  describe('calculatePosition', () => {
    test('handles basic position calculation', () => {
      const e = { clientX: 100, clientY: 100 };
      const menuSize = { width: 200, height: 300 };
      const position = calculatePosition(e, menuSize);
      
      expect(position.x).toBeDefined();
      expect(position.y).toBeDefined();
    });

    test('respects window boundaries', () => {
      const e = { clientX: window.innerWidth - 10, clientY: window.innerHeight - 10 };
      const menuSize = { width: 200, height: 300 };
      const position = calculatePosition(e, menuSize);
      
      expect(position.x).toBeLessThan(window.innerWidth);
      expect(position.y).toBeLessThan(window.innerHeight);
    });
  });

  describe('Error Handling', () => {
    test('creates MenuError with correct code', () => {
      const error = new MenuError(ErrorCodes.FRAMEWORK_NOT_DETECTED, 'Test error');
      expect(error.code).toBe('CM001');
      expect(error.message).toBe('Test error');
    });

    test('handleError processes MenuError correctly', () => {
      const error = new MenuError(ErrorCodes.INVALID_MENU_ITEMS, 'Invalid items');
      const result = handleError(error, true);
      expect(result.code).toBe('CM002');
    });
  });

  describe('Debounce', () => {
    test('debounces function calls', (done) => {
      let counter = 0;
      const increment = () => counter++;
      const debouncedIncrement = debounce(increment, 100);

      // 多次调用
      debouncedIncrement();
      debouncedIncrement();
      debouncedIncrement();

      // 应该只执行一次
      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 200);
    });
  });

  describe('Internationalization', () => {
    test('translates correctly for different locales', () => {
      setLocale('en-US');
      expect(t('copy')).toBe('Copy');
      
      setLocale('zh-CN');
      expect(t('copy')).toBe('复制');
    });

    test('falls back to English for missing translations', () => {
      setLocale('fr-FR'); // 不支持的语言
      expect(t('copy')).toBe('Copy');
    });
  });
});