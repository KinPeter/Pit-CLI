import {
  redBright as chalkRedBright,
  green as chalkGreen,
  blueBright as chalkBlueBright,
  cyan as chalkCyan,
} from 'chalk'

export interface LoggerInstance {
  red: (message: string) => void
  green: (message: string) => void
  blue: (message: string) => void
  cyan: (message: string) => void
  def: (message: string) => void
  linebreak: () => void
}

function getInstance(module?: string): LoggerInstance {
  return {
    red(message: string): void {
      console.log(chalkRedBright(`[${module}] ${message}`))
    },
    green(message: string): void {
      console.log(chalkGreen(`[${module}] ${message}`))
    },
    blue(message: string): void {
      console.log(chalkBlueBright(`[${module}] ${message}`))
    },
    cyan(message: string): void {
      console.log(chalkCyan(`[${module}] ${message}`))
    },
    def(message: string): void {
      console.log(`[${module}] ${message}`)
    },
    linebreak(): void {
      console.log('\n')
    },
  }
}

export default {
  getInstance,
}
