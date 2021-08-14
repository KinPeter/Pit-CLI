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

async function multiSelectString(description: string, menuItems: string[]): Promise<string> {
  const res = await prompts({
    type: 'multiselect',
    name: 'value',
    message: '',
    instructions: false,
    // optionsPerPage: 15,
    choices: menuItems.map(item => ({ title: item, value: item })),
  })

  console.log(res)

  return res.value[0]
}

export default {
  selectMenuString,
  multiSelectString,
}
