import Anthropic from '@anthropic-ai/sdk';
import { SKILL_TOOLS, SYSTEM_PROMPT } from './tools/definitions.js';
import { executeTool, ToolInput } from './skills/loader.js';

const MAX_TOOL_ROUNDS = 10;

export interface AgentOptions {
  query: string;
  apiKey?: string;
  model?: string;
  verbose?: boolean;
}

export async function runAgent(options: AgentOptions): Promise<void> {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is required. Set it as an environment variable or pass --api-key.'
    );
  }

  const client = new Anthropic({ apiKey });
  const model = options.model ?? 'claude-sonnet-4-6';

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: options.query },
  ];

  if (options.verbose) {
    process.stderr.write(`[cyberstrike] Model: ${model}\n`);
    process.stderr.write(`[cyberstrike] Query: ${options.query}\n\n`);
  }

  let rounds = 0;

  while (rounds < MAX_TOOL_ROUNDS) {
    rounds++;

    const response = await client.messages.create({
      model,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: SKILL_TOOLS,
      messages,
      stream: false,
    });

    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    );

    if (options.verbose && toolUseBlocks.length > 0) {
      for (const block of toolUseBlocks) {
        process.stderr.write(`[cyberstrike] Tool: ${block.name}(${JSON.stringify(block.input)})\n`);
      }
    }

    if (response.stop_reason === 'end_turn' || toolUseBlocks.length === 0) {
      for (const block of textBlocks) {
        process.stdout.write(block.text);
      }
      process.stdout.write('\n');
      break;
    }

    messages.push({ role: 'assistant', content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((block) => {
      const result = executeTool(block.name, block.input as ToolInput);
      return {
        type: 'tool_result' as const,
        tool_use_id: block.id,
        content: result,
      };
    });

    messages.push({ role: 'user', content: toolResults });
  }

  if (rounds >= MAX_TOOL_ROUNDS) {
    process.stderr.write('[cyberstrike] Warning: reached maximum tool rounds.\n');
  }
}

export async function runAgentStreaming(options: AgentOptions): Promise<void> {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is required. Set it as an environment variable or pass --api-key.'
    );
  }

  const client = new Anthropic({ apiKey });
  const model = options.model ?? 'claude-sonnet-4-6';

  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: options.query },
  ];

  if (options.verbose) {
    process.stderr.write(`[cyberstrike] Model: ${model}\n`);
    process.stderr.write(`[cyberstrike] Query: ${options.query}\n\n`);
  }

  let rounds = 0;

  while (rounds < MAX_TOOL_ROUNDS) {
    rounds++;

    let accumulatedContent: Anthropic.ContentBlock[] = [];
    let stopReason: string | null = null;

    const stream = client.messages.stream({
      model,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: SKILL_TOOLS,
      messages,
    });

    let currentToolName = '';
    let currentToolId = '';
    let currentToolInput = '';
    let inToolUse = false;

    stream.on('text', (text) => {
      process.stdout.write(text);
    });

    stream.on('message', (msg) => {
      accumulatedContent = msg.content;
      stopReason = msg.stop_reason;
    });

    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          inToolUse = true;
          currentToolName = event.content_block.name;
          currentToolId = event.content_block.id;
          currentToolInput = '';
          if (options.verbose) {
            process.stderr.write(`\n[cyberstrike] Tool: ${currentToolName}(`);
          }
        }
      } else if (event.type === 'content_block_delta') {
        if (inToolUse && event.delta.type === 'input_json_delta') {
          currentToolInput += event.delta.partial_json;
          if (options.verbose) {
            process.stderr.write(event.delta.partial_json);
          }
        }
      } else if (event.type === 'content_block_stop' && inToolUse) {
        inToolUse = false;
        if (options.verbose) {
          process.stderr.write(')\n');
        }
      }
    }

    const toolUseBlocks = accumulatedContent.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );

    if (stopReason === 'end_turn' || toolUseBlocks.length === 0) {
      process.stdout.write('\n');
      break;
    }

    messages.push({ role: 'assistant', content: accumulatedContent });

    const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((block) => {
      let parsedInput: ToolInput;
      try {
        parsedInput = JSON.parse(
          block.type === 'tool_use' && typeof (block as unknown as Record<string, unknown>).input === 'string'
            ? ((block as unknown as Record<string, unknown>).input as string)
            : JSON.stringify(block.input)
        ) as ToolInput;
      } catch {
        parsedInput = block.input as ToolInput;
      }
      const result = executeTool(block.name, parsedInput);
      return {
        type: 'tool_result' as const,
        tool_use_id: block.id,
        content: result,
      };
    });

    messages.push({ role: 'user', content: toolResults });
  }

  if (rounds >= MAX_TOOL_ROUNDS) {
    process.stderr.write('[cyberstrike] Warning: reached maximum tool rounds.\n');
  }
}
