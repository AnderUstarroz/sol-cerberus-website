export const CAST_FUNCTIONS: { [key: string]: Function } = {
  // feeTrans,
};

export function inputsToRust(inputsSettings: any, decimals: number): any {
  //Transforms readable configuration into Rust compatible values
  let rustSettings: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(inputsSettings)) {
    rustSettings[key] =
      `${key}Trans` in CAST_FUNCTIONS
        ? CAST_FUNCTIONS[`${key}Trans`](value, decimals)
        : value;
  }
  return rustSettings;
}

export function rustToInputs(rustSettings: any, decimals: number): any {
  //Transforms the Rust values values into readable configuration
  let inputsSettings: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(rustSettings)) {
    inputsSettings[key] =
      `${key}Trans` in CAST_FUNCTIONS
        ? CAST_FUNCTIONS[`${key}Trans`](value, decimals, false)
        : value;
  }
  return inputsSettings;
}
