# Somnia Event Indexer

Minimal block-based event indexer for Somnia.

## Scope
- Consume on-chain events by block range
- Avoid missed logs and handle reorgs safely

## Stack
- Node.js
- ethers.js

## Design Notes
Events are processed using a confirmation buffer instead of live subscriptions.
