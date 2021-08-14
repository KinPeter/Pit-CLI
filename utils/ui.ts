import prompts from 'prompts' // https://github.com/terkelg/prompts#readme

async function selectMenuString(description: string, menuItems: string[]): Promise<string> {
  const res = await prompts({
    type: 'select',
    name: 'value',
    message: description,
    instructions: false,
    choices: menuItems.map(item => ({ title: item, value: item })),
  })
  return res.value
}

async function multiSelectString(description: string, menuItems: string[]): Promise<string[]> {
  const res = await prompts({
    type: 'multiselect',
    name: 'values',
    message: description,
    instructions: false,
    // optionsPerPage: 15,
    choices: menuItems.map(item => ({ title: item, value: item })),
  })
  return res.values
}

export default {
  selectMenuString,
  multiSelectString,
}
