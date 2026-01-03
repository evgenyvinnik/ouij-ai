#!/bin/bash
# Simplified dev script - just runs vite
echo "Starting Vite dev server..."
echo "Note: Edge Functions (/api/*) won't work locally with this setup"
echo "For full functionality including AI chat, deploy to Vercel"
bun run dev:frontend
