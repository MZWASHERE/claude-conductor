#!/usr/bin/env node
// PreToolUse hook - Warn when modifying core config files

const path = require('path');

async function main() {
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const data = JSON.parse(input);
  const filePath = data.tool_input?.file_path || '';

  // Check if modifying core conductor config
  const configPattern = /conductor\/(product|tech-stack|workflow)\.md$/;
  if (configPattern.test(filePath)) {
    const configName = path.basename(filePath);
    console.log(JSON.stringify({
      systemMessage: `Modifying core conductor config: ${configName}`
    }));
  }
}

main().catch(() => process.exit(1));
