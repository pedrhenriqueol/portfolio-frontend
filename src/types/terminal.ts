import React from 'react';

export interface TerminalLine {
    id?: string;
    text: string;
    color?: string;
    node?: React.ReactNode;
    isStreaming?: boolean;
}

export type ActiveTerminalGame = 'snake' | 'bug-hunter' | 'trivia' | 'aim-test' | 'matrix' | null;

export interface SimulationStep {
    delay: number;
    line: TerminalLine;
}

export interface CopilotChatPayload {
    message: string;
}
