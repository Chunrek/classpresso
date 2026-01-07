/**
 * CSS Generator Tests
 */

import { describe, it, expect } from 'vitest';
import { parseUtilityClass } from '../src/core/css-generator.js';

describe('parseUtilityClass', () => {
  describe('display utilities', () => {
    it('parses flex', () => {
      expect(parseUtilityClass('flex')).toEqual(['display: flex']);
    });

    it('parses grid', () => {
      expect(parseUtilityClass('grid')).toEqual(['display: grid']);
    });

    it('parses block', () => {
      expect(parseUtilityClass('block')).toEqual(['display: block']);
    });

    it('parses inline', () => {
      expect(parseUtilityClass('inline')).toEqual(['display: inline']);
    });

    it('parses inline-block', () => {
      expect(parseUtilityClass('inline-block')).toEqual(['display: inline-block']);
    });

    it('parses hidden', () => {
      expect(parseUtilityClass('hidden')).toEqual(['display: none']);
    });
  });

  describe('flex direction utilities', () => {
    it('parses flex-col', () => {
      expect(parseUtilityClass('flex-col')).toEqual(['flex-direction: column']);
    });

    it('parses flex-row', () => {
      expect(parseUtilityClass('flex-row')).toEqual(['flex-direction: row']);
    });

    it('parses flex-col-reverse', () => {
      expect(parseUtilityClass('flex-col-reverse')).toEqual(['flex-direction: column-reverse']);
    });

    it('parses flex-row-reverse', () => {
      expect(parseUtilityClass('flex-row-reverse')).toEqual(['flex-direction: row-reverse']);
    });
  });

  describe('justify content utilities', () => {
    it('parses justify-start', () => {
      expect(parseUtilityClass('justify-start')).toEqual(['justify-content: flex-start']);
    });

    it('parses justify-center', () => {
      expect(parseUtilityClass('justify-center')).toEqual(['justify-content: center']);
    });

    it('parses justify-end', () => {
      expect(parseUtilityClass('justify-end')).toEqual(['justify-content: flex-end']);
    });

    it('parses justify-between', () => {
      expect(parseUtilityClass('justify-between')).toEqual(['justify-content: space-between']);
    });

    it('parses justify-around', () => {
      expect(parseUtilityClass('justify-around')).toEqual(['justify-content: space-around']);
    });
  });

  describe('align items utilities', () => {
    it('parses items-start', () => {
      expect(parseUtilityClass('items-start')).toEqual(['align-items: flex-start']);
    });

    it('parses items-center', () => {
      expect(parseUtilityClass('items-center')).toEqual(['align-items: center']);
    });

    it('parses items-end', () => {
      expect(parseUtilityClass('items-end')).toEqual(['align-items: flex-end']);
    });

    it('parses items-stretch', () => {
      expect(parseUtilityClass('items-stretch')).toEqual(['align-items: stretch']);
    });
  });

  describe('spacing utilities', () => {
    it('parses p-4', () => {
      const result = parseUtilityClass('p-4');
      expect(result).toEqual(['padding: 1rem']);
    });

    it('parses px-2', () => {
      const result = parseUtilityClass('px-2');
      expect(result).toEqual(['padding-left: 0.5rem', 'padding-right: 0.5rem']);
    });

    it('parses py-3', () => {
      const result = parseUtilityClass('py-3');
      expect(result).toEqual(['padding-top: 0.75rem', 'padding-bottom: 0.75rem']);
    });

    it('parses m-2', () => {
      const result = parseUtilityClass('m-2');
      expect(result).toEqual(['margin: 0.5rem']);
    });

    it('parses mt-4', () => {
      const result = parseUtilityClass('mt-4');
      expect(result).toEqual(['margin-top: 1rem']);
    });

    it('parses gap-2', () => {
      const result = parseUtilityClass('gap-2');
      expect(result).toEqual(['gap: 0.5rem']);
    });

    it('parses gap-x-4', () => {
      const result = parseUtilityClass('gap-x-4');
      expect(result).toEqual(['column-gap: 1rem']);
    });

    it('parses gap-y-4', () => {
      const result = parseUtilityClass('gap-y-4');
      expect(result).toEqual(['row-gap: 1rem']);
    });
  });

  describe('size utilities', () => {
    it('parses w-full', () => {
      expect(parseUtilityClass('w-full')).toEqual(['width: 100%']);
    });

    it('parses h-screen', () => {
      expect(parseUtilityClass('h-screen')).toEqual(['height: 100vh']);
    });

    it('parses w-auto', () => {
      expect(parseUtilityClass('w-auto')).toEqual(['width: auto']);
    });

    it('parses min-h-screen', () => {
      expect(parseUtilityClass('min-h-screen')).toEqual(['min-height: 100vh']);
    });

    it('parses max-w-full', () => {
      expect(parseUtilityClass('max-w-full')).toEqual(['max-width: 100%']);
    });
  });

  describe('rounded utilities', () => {
    it('parses rounded', () => {
      expect(parseUtilityClass('rounded')).toEqual(['border-radius: 0.25rem']);
    });

    it('parses rounded-md', () => {
      expect(parseUtilityClass('rounded-md')).toEqual(['border-radius: 0.375rem']);
    });

    it('parses rounded-lg', () => {
      expect(parseUtilityClass('rounded-lg')).toEqual(['border-radius: 0.5rem']);
    });

    it('parses rounded-full', () => {
      expect(parseUtilityClass('rounded-full')).toEqual(['border-radius: 9999px']);
    });

    it('parses rounded-none', () => {
      expect(parseUtilityClass('rounded-none')).toEqual(['border-radius: 0px']);
    });
  });

  describe('text size utilities', () => {
    it('parses text-sm', () => {
      const result = parseUtilityClass('text-sm');
      expect(result).toContain('font-size: 0.875rem');
    });

    it('parses text-lg', () => {
      const result = parseUtilityClass('text-lg');
      expect(result).toContain('font-size: 1.125rem');
    });

    it('parses text-2xl', () => {
      const result = parseUtilityClass('text-2xl');
      expect(result).toContain('font-size: 1.5rem');
    });
  });

  describe('font weight utilities', () => {
    it('parses font-bold', () => {
      expect(parseUtilityClass('font-bold')).toEqual(['font-weight: 700']);
    });

    it('parses font-semibold', () => {
      expect(parseUtilityClass('font-semibold')).toEqual(['font-weight: 600']);
    });

    it('parses font-medium', () => {
      expect(parseUtilityClass('font-medium')).toEqual(['font-weight: 500']);
    });
  });

  describe('position utilities', () => {
    it('parses relative', () => {
      expect(parseUtilityClass('relative')).toEqual(['position: relative']);
    });

    it('parses absolute', () => {
      expect(parseUtilityClass('absolute')).toEqual(['position: absolute']);
    });

    it('parses fixed', () => {
      expect(parseUtilityClass('fixed')).toEqual(['position: fixed']);
    });

    it('parses sticky', () => {
      expect(parseUtilityClass('sticky')).toEqual(['position: sticky']);
    });
  });

  describe('overflow utilities', () => {
    it('parses overflow-hidden', () => {
      expect(parseUtilityClass('overflow-hidden')).toEqual(['overflow: hidden']);
    });

    it('parses overflow-auto', () => {
      expect(parseUtilityClass('overflow-auto')).toEqual(['overflow: auto']);
    });
  });

  describe('opacity utilities', () => {
    it('parses opacity-50', () => {
      expect(parseUtilityClass('opacity-50')).toEqual(['opacity: 0.5']);
    });

    it('parses opacity-100', () => {
      expect(parseUtilityClass('opacity-100')).toEqual(['opacity: 1']);
    });

    it('parses opacity-0', () => {
      expect(parseUtilityClass('opacity-0')).toEqual(['opacity: 0']);
    });
  });

  describe('z-index utilities', () => {
    it('parses z-10', () => {
      expect(parseUtilityClass('z-10')).toEqual(['z-index: 10']);
    });

    it('parses z-50', () => {
      expect(parseUtilityClass('z-50')).toEqual(['z-index: 50']);
    });

    it('parses z-auto', () => {
      expect(parseUtilityClass('z-auto')).toEqual(['z-index: auto']);
    });
  });

  describe('cursor utilities', () => {
    it('parses cursor-pointer', () => {
      expect(parseUtilityClass('cursor-pointer')).toEqual(['cursor: pointer']);
    });

    it('parses cursor-not-allowed', () => {
      expect(parseUtilityClass('cursor-not-allowed')).toEqual(['cursor: not-allowed']);
    });
  });

  describe('text transform utilities', () => {
    it('parses uppercase', () => {
      expect(parseUtilityClass('uppercase')).toEqual(['text-transform: uppercase']);
    });

    it('parses lowercase', () => {
      expect(parseUtilityClass('lowercase')).toEqual(['text-transform: lowercase']);
    });

    it('parses capitalize', () => {
      expect(parseUtilityClass('capitalize')).toEqual(['text-transform: capitalize']);
    });
  });

  describe('truncate utility', () => {
    it('parses truncate with multiple properties', () => {
      const result = parseUtilityClass('truncate');
      expect(result).toContain('overflow: hidden');
      expect(result).toContain('text-overflow: ellipsis');
      expect(result).toContain('white-space: nowrap');
    });
  });

  describe('unknown utilities', () => {
    it('returns empty array for unknown utilities', () => {
      expect(parseUtilityClass('unknown-class')).toEqual([]);
    });

    it('returns empty array for custom classes', () => {
      expect(parseUtilityClass('my-custom-class')).toEqual([]);
    });
  });
});
