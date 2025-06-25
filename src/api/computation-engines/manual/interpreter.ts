/**
 * JS-Interpreter utility functions for manual computation debugging
 */
import { IEnvironment } from "../../../types/environment";

// Comprehensive interface for JS-Interpreter
interface JSInterpreter {
  step(): boolean;
  run(): boolean;
  value: unknown;
  getStateStack(): unknown[];
  getGlobalScope(): unknown;
  setProperty(obj: unknown, name: string, value: unknown): void;
  getProperty(obj: unknown, name: string): unknown;
  createNativeFunction(func: (...args: unknown[]) => unknown): unknown;
  nativeToPseudo(obj: unknown): unknown;
  pseudoToNative?(obj: unknown): unknown;
}

interface InterpreterConstructor {
  new (
    code: string,
    initFunc?: (interpreter: JSInterpreter, globalObject: unknown) => void
  ): JSInterpreter;
}

interface StackFrame {
  node?: {
    type: string;
    start: number;
    end: number;
    name?: string;
    declarations?: Array<{ id?: { name: string } }>;
    operator?: string;
    left?: { name?: string; type?: string };
    right?: { type?: string };
  };
  scope?: {
    object: unknown;
    constructor: { name: string };
  };
  func?: {
    node?: {
      id?: { name: string };
    };
  };
}

// Helper function to get scope name based on stack position
const getScopeName = (index: number, stackLength: number): string => {
  return index === 0 ? "Global" : `Local-${stackLength - 1 - index}`;
};

// Helper function to convert interpreter value to native value
const convertToNativeValue = (interpreter: JSInterpreter, value: unknown) => {
  return interpreter.pseudoToNative ? interpreter.pseudoToNative(value) : value;
};

// Helper function to find a variable in a specific stack frame
const findVariableInFrame = (
  interpreter: JSInterpreter,
  state: unknown,
  varName: string,
  frameIndex: number,
  stackLength: number
): { found: boolean; value?: unknown; scopeName: string } => {
  const scopeName = getScopeName(frameIndex, stackLength);
  const stackFrame = state as StackFrame;

  if (!stackFrame.scope?.object) {
    return { found: false, scopeName };
  }

  try {
    const varValue = interpreter.getProperty(stackFrame.scope.object, varName);
    if (varValue !== undefined) {
      console.log(`${scopeName}: Found variable '${varName}':`, varValue);
      const nativeValue = convertToNativeValue(interpreter, varValue);
      return { found: true, value: nativeValue, scopeName };
    }
  } catch (err) {
    console.log(
      `${scopeName}: Error checking declared variable '${varName}':`,
      err
    );
  }

  return { found: false, scopeName };
};

// Helper function to find a variable in the stack (searching from innermost to outermost)
const findVariableInStack = (
  interpreter: JSInterpreter,
  stack: unknown[],
  varName: string
) => {
  for (let i = stack.length - 1; i >= 0; i--) {
    const result = findVariableInFrame(
      interpreter,
      stack[i],
      varName,
      i,
      stack.length
    );
    if (result.found) {
      return result;
    }
  }
  return { found: false, value: undefined, scopeName: "" };
};

// Helper function to collect all variables from the stack
const collectVariablesFromStack = (
  interpreter: JSInterpreter,
  stack: unknown[],
  varNames: string[]
) => {
  // Early return for invalid conditions
  if (!stack?.length || !varNames?.length) {
    return {};
  }

  const variables: Record<string, unknown> = {};

  for (const varName of varNames) {
    console.log(`Checking for variable: ${varName}`);
    const result = findVariableInStack(interpreter, stack, varName);

    if (result.found && result.value !== undefined && !(varName in variables)) {
      variables[varName] = result.value;
    }
  }

  return variables;
};

/**
 * Initialize JS-Interpreter with environment variables and debugging utilities
 * @param currentCode - The JavaScript code to execute
 * @param environment - The Formulize environment containing variables
 * @param setError - Error callback function
 * @returns Initialized interpreter instance or null if failed
 */
export const initializeInterpreter = (
  currentCode: string,
  environment: IEnvironment | null,
  setError: (error: string) => void
): JSInterpreter | null => {
  if (!(window as any).Interpreter) {
    setError("JS-Interpreter not loaded. Please refresh the page.");
    return null;
  }
  if (!currentCode.trim()) {
    setError("No code available to execute");
    return null;
  }

  try {
    // Create initialization function to set up variables properly
    const initFunc = (interpreter: JSInterpreter, globalObject: unknown) => {
      const envVariables = environment?.variables || {};

      // Set up each environment variable as a global property for tracking
      for (const [key, variable] of Object.entries(envVariables)) {
        try {
          // Convert the variable to a pseudo object that the interpreter can track
          const pseudoVariable = interpreter.nativeToPseudo(variable);
          interpreter.setProperty(globalObject, key, pseudoVariable);
          console.log(`Set up variable ${key}:`, variable);
        } catch (err) {
          console.error(`Error setting up variable ${key}:`, err);
          // Fallback to setting as primitive value
          interpreter.setProperty(globalObject, key, variable);
        }
      }

      // Also provide the getVariablesJSON function
      const getVariablesJSONWrapper = function () {
        return JSON.stringify(envVariables);
      };
      interpreter.setProperty(
        globalObject,
        "getVariablesJSON",
        interpreter.createNativeFunction(getVariablesJSONWrapper)
      );
    };

    // Create interpreter with the code and proper variable setup
    const InterpreterClass = (window as any)
      .Interpreter as InterpreterConstructor;
    return new InterpreterClass(currentCode, initFunc);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(`Code error: ${errorMessage}`);
    return null;
  }
};

// Export the helper functions for use in other modules
export {
  getScopeName,
  convertToNativeValue,
  findVariableInFrame,
  findVariableInStack,
  collectVariablesFromStack,
};

// Export the interfaces for type checking
export type { JSInterpreter, StackFrame };
