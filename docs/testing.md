# Testing Guide

This project uses **Vitest** for Test Driven Development (TDD).

## Running Tests

### Run all tests once
```bash
npm test -- --run
```

### Run tests in watch mode
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Writing Tests

### Test File Location
- Place test files in the `tests/` directory
- Name test files with `.test.ts` or `.spec.ts` extension

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = input.toUpperCase()
    
    // Assert
    expect(result).toBe('TEST')
  })
})
```

## TDD Workflow

1. **Write a failing test** - Define expected behavior
2. **Run the test** - Verify it fails (Red)
3. **Write minimal code** - Make the test pass (Green)
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - Continue with next feature

## Configuration

Tests are configured in `vitest.config.ts` with:
- Global test utilities enabled
- jsdom environment for DOM testing
- Coverage reporting with v8

## Example: Testing a Card Class

```typescript
// tests/card.test.ts
import { describe, it, expect } from 'vitest'
import { Card } from '../src/models/Card'

describe('Card', () => {
  it('should create a card with suit and rank', () => {
    const card = new Card('hearts', 'A')
    expect(card.suit).toBe('hearts')
    expect(card.rank).toBe('A')
  })
})
```
