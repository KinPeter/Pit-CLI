import prompts from 'prompts'

async function selectMenu(description: string, menuItems: string[]): Promise<string> {
  const res = await prompts({
    type: 'select',
    name: 'value',
    message: '',
    instructions: false,
    choices: menuItems.map(item => ({ title: item, value: item })),
  })

  console.log(res)

  return res.value
}

async function multiSelect(description: string, menuItems: string[]): Promise<string> {
  const res = await prompts({
    type: 'multiselect',
    name: 'value',
    message: '',
    instructions: false,
    choices: menuItems.map(item => ({ title: item, value: item })),
  })

  console.log(res)

  return res.value[0]
}

export default {
  selectMenu,
  multiSelect,
}
